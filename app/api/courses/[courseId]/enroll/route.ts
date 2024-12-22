import { NextResponse } from 'next/server';
import { stripeCheckout } from '@/modules/stripe';
import prisma from '@/lib/prisma';
import { getAuthSession } from "@/lib/authOptions";

type EnrollRequestBody = {
  successUrl: string;
  cancelUrl: string;
};

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'User not authenticated or not a student' },
        { status: 403 },
      );
    }

    const userId = session.user.id;
    const courseId = params.courseId;

    const body: EnrollRequestBody = await request.json();
    const { successUrl, cancelUrl } = body;

    const course = await prisma.course.findFirst({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 },
      );
    }

    const paymentSession = await stripeCheckout.createOneTimePaymentSession({
      amount: course.price * 100,
      successUrl,
      cancelUrl,
      metadata: {
        userId,
        courseId,
      },
    });

    await prisma.payment.create({
      data: {
        amount: course.price,
        paymentStatus: 'pending',
        userId,
        courseId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Payment session created successfully',
        data: {
          sessionId: paymentSession.id,
          sessionUrl: paymentSession.url,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error creating payment session:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}