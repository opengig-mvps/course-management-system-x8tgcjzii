'use client' ;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, DollarSign, LineChart, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-400 to-blue-500 text-white text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                Welcome to EduLearn
              </h1>
              <p className="max-w-2xl text-lg md:text-xl">
                A platform where students and tutors connect for an enhanced learning experience.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
                <Button variant="outline" className="text-white hover:bg-white hover:text-black">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Features</h2>
              <p className="max-w-2xl text-muted-foreground md:text-lg">
                Discover the amazing features that make EduLearn the best choice for online education.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="p-6">
                  <CardHeader>
                    <Users className="h-12 w-12 mx-auto" />
                    <CardTitle>Student & Tutor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Seamlessly connect students and tutors for an enhanced learning experience.</p>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardHeader>
                    <DollarSign className="h-12 w-12 mx-auto" />
                    <CardTitle>Easy Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Secure and easy payment options for enrolling in courses.</p>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardHeader>
                    <LineChart className="h-12 w-12 mx-auto" />
                    <CardTitle>Course Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Tutors can easily create and manage their courses with detailed information.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Testimonials</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
                See what our users are saying about EduLearn.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-12">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/600x400.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "EduLearn has transformed my learning experience. The tutors are amazing and the platform is very user-friendly."
                </p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/600x400.png" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">Sarah Miller</p>
                    <p className="text-xs text-muted-foreground">Tutor</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "As a tutor, EduLearn has provided me with the tools I need to effectively manage my courses and connect with students."
                </p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/600x400.png" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">Michael Johnson</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "The payment process is smooth and the course content is top-notch. Highly recommend EduLearn!"
                </p>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Sign Up</h2>
              <p className="max-w-2xl mx-auto text-muted-foreground md:text-lg">
                Join EduLearn today and start your journey towards a better learning experience.
              </p>
            </div>
            <div className="max-w-md mx-auto mt-12">
              <form className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email address" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Your password" />
                </div>
                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-white p-6">
        <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Product</h3>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Security</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
            <a href="#">Community</a>
            <a href="#">Templates</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;