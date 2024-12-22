import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from "@/lib/authOptions";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session: any = await getAuthSession();

    if (!session || session.user.id !== params.userId || session.user.role !== 'tutor') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    const userId: string = params.userId;

    const courses = await prisma.course.findMany({
      where: { tutorId: userId },
    });

    const courseList = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      zoomLink: course.zoomLink,
      price: course.price,
      slots: course.slots,
      tutorId: course.tutorId,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Courses retrieved successfully',
        data: courseList,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error retrieving courses:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}