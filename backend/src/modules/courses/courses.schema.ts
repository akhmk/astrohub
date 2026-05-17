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
  duration: z.number().int().min(1).optional(),
  summary: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;

export const createNoteSchema = z.object({
  content: z.string().min(1).max(5000),
  lessonId: z.string().optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
  content: z.string().min(1).max(5000),
});

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
