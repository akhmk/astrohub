import { z } from "zod";

export const createLabSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
});

export const updateLabSchema = createLabSchema.partial();

export const createSubmissionSchema = z.object({
  content: z.string().min(1, "Submission cannot be empty").max(50000),
});

export type CreateLabInput = z.infer<typeof createLabSchema>;
export type UpdateLabInput = z.infer<typeof updateLabSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
