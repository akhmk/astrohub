import { z } from "zod";

export const createClubSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(2000).optional().nullable(),
  imageURL: z.string().url().optional().nullable(),
});

export const createClubPostSchema = z.object({
  content: z.string().min(1, "Content cannot be empty").max(5000),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type CreateClubPostInput = z.infer<typeof createClubPostSchema>;
