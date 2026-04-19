import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse, type PaginationQuery } from "../../utils/pagination.js";
import type { CreateRoadmapInput, UpdateRoadmapInput, UpdateProgressInput } from "./roadmaps.schema.js";

const roadmapSelect = {
  id: true,
  title: true,
  description: true,
  steps: true,
  order: true,
  createdAt: true,
  updatedAt: true,
};

export class RoadmapsService {
  async list(query: PaginationQuery) {
    const [data, total] = await Promise.all([
      prisma.roadmap.findMany({
        ...paginate(query),
        orderBy: { order: "asc" },
        select: roadmapSelect,
      }),
      prisma.roadmap.count(),
    ]);
    return paginatedResponse(data, total, query);
  }

  async getById(id: string) {
    return prisma.roadmap.findUnique({
      where: { id },
      select: roadmapSelect,
    });
  }

  async create(data: CreateRoadmapInput) {
    return prisma.roadmap.create({
      data: {
        ...data,
        steps: data.steps as any,
      },
      select: roadmapSelect,
    });
  }

  async update(id: string, data: UpdateRoadmapInput) {
    return prisma.roadmap.update({
      where: { id },
      data: {
        ...data,
        steps: data.steps as any,
      },
      select: roadmapSelect,
    });
  }

  async delete(id: string) {
    return prisma.roadmap.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const r = await prisma.roadmap.findUnique({ where: { id }, select: { id: true } });
    return !!r;
  }

  // Progress
  async getProgress(roadmapId: string, userId: string) {
    return prisma.roadmapProgress.findUnique({
      where: { userId_roadmapId: { userId, roadmapId } },
      select: {
        id: true,
        completedSteps: true,
        updatedAt: true,
      },
    });
  }

  async updateProgress(roadmapId: string, userId: string, data: UpdateProgressInput) {
    return prisma.roadmapProgress.upsert({
      where: { userId_roadmapId: { userId, roadmapId } },
      create: {
        userId,
        roadmapId,
        completedSteps: data.completedSteps as any,
      },
      update: {
        completedSteps: data.completedSteps as any,
      },
      select: {
        id: true,
        completedSteps: true,
        updatedAt: true,
      },
    });
  }
}

export const roadmapsService = new RoadmapsService();
