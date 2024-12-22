"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, Link as LinkIcon, LoaderCircleIcon } from "lucide-react";

const EnrolledCoursesPage = () => {
  const { data: session } = useSession();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session) {
      return;
    }
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${session?.user.id}/enrollments`);
        setEnrolledCourses(response.data.data);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [session]);

  const formatDate = (dateString: any) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircleIcon className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Enrolled Courses</h1>
      {enrolledCourses.length === 0 ? (
        <p className="text-gray-600">You have not enrolled in any courses.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses?.map((course) => (
            <Card key={course?.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{course?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Instructor: {course?.tutorId}</p>
                <p className="text-sm text-muted-foreground">Total Classes: {course?.slots?.length}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Class Information
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>{selectedCourse?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Zoom Link</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedCourse?.slots?.map((classInfo: any) => (
                            <TableRow key={classInfo?.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(classInfo?.startTime)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {new Date(classInfo?.startTime).toLocaleTimeString()} - {new Date(classInfo?.endTime).toLocaleTimeString()}
                                </div>
                              </TableCell>
                              <TableCell>{classInfo?.status}</TableCell>
                              <TableCell>
                                <a
                                  href={classInfo?.zoomLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline flex items-center gap-2"
                                >
                                  <LinkIcon className="h-4 w-4" />
                                  Join
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;