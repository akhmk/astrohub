import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3).max(150),
  subtitle: z.string().max(200).optional(),
  description: z.string().optional(),
  imageURL: z.string().url().optional().or(z.literal("")),
  category: z.string().max(60).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  estimatedHours: z.number().int().positive().optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  outcomes: z.array(z.string().max(200)).max(20).default([]),
  prerequisites: z.array(z.string().max(200)).max(10).default([]),
  isPublished: z.boolean().default(true),
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const createModuleSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().optional(),
  order: z.number().int().min(0).default(0),
});
export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export const createLessonSchema = z.object({
  title: z.string().min(3).max(150),
  content: z.string().optional(),
  videoURL: z.string().url().optional().or(z.literal("")),
  duration: z.number().int().positive().optional(),
  summary: z.string().max(500).optional(),
  lessonType: z.enum(["TEXT", "VIDEO", "INTERACTIVE"]).default("TEXT"),
  order: z.number().int().min(0).default(0),
  moduleId: z.string().optional(),
});
export type CreateLessonInput = z.infer<typeof createLessonSchema>;

const quizOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

export const createQuizSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().optional(),
  passingScore: z.number().int().min(1).max(100).default(70),
  questions: z.array(z.object({
    text: z.string().min(5),
    options: z.array(quizOptionSchema).min(2).max(6),
    explanation: z.string().optional(),
    order: z.number().int().min(0).default(0),
    points: z.number().int().positive().default(1),
  })).min(1).max(50),
});
export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const submitQuizSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    selectedOptionId: z.string(),
  })).min(1),
});
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

export const createNoteSchema = z.object({
  content: z.string().min(1).max(5000),
  lessonId: z.string().optional(),
});
export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
  content: z.string().min(1).max(5000),
});
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

export const coursesFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
});
export type CoursesFilter = z.infer<typeof coursesFilterSchema>;
