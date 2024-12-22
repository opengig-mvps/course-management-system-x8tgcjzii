import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/modules/stripe';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: any;

  try {
    if (!sig) {
      throw new Error("Missing Stripe signature");
    }
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent: any = event.data.object;
        await prisma.payment.updateMany({
          where: { id: paymentIntent.id },
          data: { paymentStatus: "succeeded" },
        });
        await sendEmail({
          to: paymentIntent.receipt_email,
          template: {
            subject: 'Payment Successful',
            html: '<h1>Your payment was successful!</h1>',
            text: 'Your payment was successful!',
          },
        });
        break;

      case "customer.subscription.created":
        const subscription: any = event.data.object;
        await prisma.payment.create({
          data: {
            id: subscription.id,
            amount: subscription.plan.amount,
            paymentStatus: "succeeded",
            userId: subscription.customer,
            courseId: subscription.metadata.courseId,
          },
        });
        await sendEmail({
          to: subscription.customer_email,
          template: {
            subject: 'Subscription Created',
            html: '<h1>Your subscription was created successfully!</h1>',
            text: 'Your subscription was created successfully!',
          },
        });
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Unhandled event type" },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: true, message: "Webhook handled successfully", data: {} },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Error handling webhook: ${error.message}` },
      { status: 500 }
    );
  }
}