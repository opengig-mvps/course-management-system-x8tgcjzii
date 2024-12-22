'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { LoaderCircleIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  tutorId: string;
}

const CourseCard = ({ course, onEnroll }: { course: Course, onEnroll: (courseId: string) => void }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl font-bold leading-tight">{course.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Additional content can go here */}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-6 border-t">
        <span className="text-2xl font-bold">${course.price.toFixed(2)}</span>
        <Button className="w-32" onClick={() => onEnroll(course.id)}>Enroll Now</Button>
      </CardFooter>
    </Card>
  );
}

const EnrollCourses = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data?.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!session) {
      toast.error("You must be logged in to enroll in a course.");
      return;
    }

    try {
      const response = await axios.post(`/api/courses/${courseId}/enroll`, {
        successUrl: `${window.location.origin}/dashboard/student/courses/success`,
        cancelUrl: `${window.location.origin}/dashboard/student/courses/cancel`
      });

      if (response.data.success) {
        window.location.href = response.data.data.sessionUrl;
      } else {
        toast.error("Failed to create payment session.");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderCircleIcon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Expand your skills with our expert-led online courses
          </p>
        </div>
        
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {courses?.map((course) => (
              <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
            ))}
          </div>
        ) : (
          <Alert className="max-w-2xl">
            <AlertTitle>No courses available</AlertTitle>
            <AlertDescription>
              Check back later for new course offerings.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default EnrollCourses;