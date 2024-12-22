import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from "@/lib/authOptions";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        zoomLink: true,
        price: true,
        slots: true,
        tutorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Courses retrieved successfully',
        data: courses,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error retrieving courses:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}

type CourseRequestBody = {
  title: string;
  description: string;
  zoomLink: string;
  price: number;
  slots: any;
};

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'tutor') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    const body: CourseRequestBody = await request.json();
    const { title, description, zoomLink, price, slots } = body;

    if (!title || !price || !slots) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        zoomLink,
        price,
        slots,
        tutorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Course created successfully',
        data: {
          id: course.id,
          title: course.title,
          description: course.description,
          zoomLink: course.zoomLink,
          price: course.price,
          slots: course.slots,
          tutorId: course.tutorId,
          createdAt: course.createdAt.toISOString(),
          updatedAt: course.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}