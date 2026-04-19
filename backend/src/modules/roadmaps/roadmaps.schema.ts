import { z } from "zod";

const roadmapStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number().int(),
});

export const createRoadmapSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional().nullable(),
  steps: z.array(roadmapStepSchema).default([]),
  order: z.number().int().default(0),
});

export const updateRoadmapSchema = createRoadmapSchema.partial();

export const updateProgressSchema = z.object({
  completedSteps: z.array(z.string()),
});

export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type UpdateRoadmapInput = z.infer<typeof updateRoadmapSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
