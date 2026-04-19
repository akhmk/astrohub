import { z } from "zod";

export const createForumPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters").max(10000, "Content must be at most 10000 characters"),
  code: z.string().max(5000).optional().nullable(),
});

export const updateForumPostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).max(10000).optional(),
  code: z.string().max(5000).optional().nullable(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment must be at most 2000 characters"),
});

export type CreateForumPostInput = z.infer<typeof createForumPostSchema>;
export type UpdateForumPostInput = z.infer<typeof updateForumPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
