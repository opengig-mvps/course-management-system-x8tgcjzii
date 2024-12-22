import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from "@/lib/authOptions";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await getAuthSession();
    const userId = params.userId;

    if (!session || session.user.id !== userId || session.user.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });

    const enrolledCourses = enrollments.map((enrollment: any) => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      zoomLink: enrollment.course.zoomLink,
      price: enrollment.course.price,
      slots: enrollment.course.slots,
      tutorId: enrollment.course.tutorId,
      createdAt: enrollment.course.createdAt.toISOString(),
      updatedAt: enrollment.course.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Enrolled courses retrieved successfully',
        data: enrolledCourses,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error retrieving enrolled courses:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}