"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  zoomLink: string;
  price: number;
  slots: any;
  tutorId: string;
  createdAt: string;
  updatedAt: string;
}

const TutorCoursesPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/users/${session?.user.id}/courses`);
        setCourses(res.data.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircleIcon className="animate-spin h-6 w-6" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.length === 0 ? (
            <p>No courses created yet.</p>
          ) : (
            courses?.map((course: Course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{course?.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{course?.description}</p>
                  <p className="text-sm text-muted-foreground">Price: ${course?.price}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="outline" onClick={() => router.push(`/dashboard/tutor/courses/${course?.id}`)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TutorCoursesPage;