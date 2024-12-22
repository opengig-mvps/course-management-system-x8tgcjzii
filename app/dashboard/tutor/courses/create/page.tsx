'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/date-picker';
import { Plus, X, LoaderCircleIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import axios from 'axios';

const courseSchema = z.object({
  title: z.string().min(1, { message: 'Course title is required' }),
  description: z.string().min(1, { message: 'Course description is required' }),
  zoomLink: z.string().url({ message: 'Please enter a valid URL' }),
  price: z.coerce.number().positive({ message: 'Please enter a valid positive number' }),
  schedules: z.array(
    z.object({
      startDateTime: z.date(),
      endDateTime: z.date(),
    })
  ).refine(schedules => schedules.every(schedule => 
    schedule.startDateTime < schedule.endDateTime
  ), { message: 'Start time must be before end time' })
});

type CourseFormData = z.infer<typeof courseSchema>;

const CreateCoursePage = () => {
  const { data: session } = useSession();
  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      zoomLink: '',
      price: undefined,
      schedules: [{ startDateTime: new Date(), endDateTime: new Date() }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules'
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        zoomLink: data.zoomLink,
        price: data.price,
        slots: data.schedules.map(schedule => ({
          startTime: schedule.startDateTime.toISOString(),
          endTime: schedule.endDateTime.toISOString(),
        })),
      };

      const response = await api.post(`/api/courses`, payload);

      if (response.data.success) {
        toast.success('Course created successfully!');
        reset();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message ?? 'Something went wrong');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                {...register('title')}
                placeholder="Enter course title"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Describe the course content"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoomLink">Zoom Link</Label>
              <Input
                {...register('zoomLink')}
                placeholder="Enter Zoom meeting link"
              />
              {errors.zoomLink && <p className="text-red-500 text-sm">{errors.zoomLink.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                type="number"
                {...register('price', { valueAsNumber: true })}
                placeholder="Enter course price"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Class Schedule</Label>
                <Button 
                  type="button" 
                  onClick={() => append({ startDateTime: new Date(), endDateTime: new Date() })} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </div>

              {fields?.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Class {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date Time</Label>
                      <Controller
                        control={control}
                        name={`schedules.${index}.startDateTime`}
                        render={({ field: { value, onChange } }) => (
                          <DateTimePicker
                            date={value}
                            setDate={onChange}
                          />
                        )}
                      />
                      {errors.schedules?.[index]?.startDateTime && (
                        <p className="text-red-500 text-sm">
                          {errors.schedules[index]?.startDateTime?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>End Date Time</Label>
                      <Controller
                        control={control}
                        name={`schedules.${index}.endDateTime`}
                        render={({ field: { value, onChange } }) => (
                          <DateTimePicker
                            date={value}
                            setDate={onChange}
                          />
                        )}
                      />
                      {errors.schedules?.[index]?.endDateTime && (
                        <p className="text-red-500 text-sm">
                          {errors.schedules[index]?.endDateTime?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Course...
                </>
              ) : (
                'Create Course'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateCoursePage;