"use client";

import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  description: string;
  zoomLink: string;
  price: number;
  slots: any;
  tutorId: string;
  createdAt: string;
  updatedAt: string;
};

const CoursesPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/courses");
      setCourses(res.data.data); // res.data will be this format : {success:boolean, message:string, data:any}
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

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <LoaderCircleIcon className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <>
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Price: ${course.price}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/dashboard/student/courses/${course.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesPage;