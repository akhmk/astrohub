import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  imageURL: z.string().url().optional().or(z.literal("")),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const createLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().optional(),
  videoURL: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
