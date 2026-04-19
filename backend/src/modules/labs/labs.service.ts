import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse, type PaginationQuery } from "../../utils/pagination.js";
import type { CreateLabInput, UpdateLabInput, CreateSubmissionInput } from "./labs.schema.js";

const labSelect = {
  id: true,
  title: true,
  description: true,
  content: true,
  difficulty: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { submissions: true } },
};

export class LabsService {
  async list(query: PaginationQuery) {
    const [data, total] = await Promise.all([
      prisma.lab.findMany({
        ...paginate(query),
        orderBy: { createdAt: "desc" },
        select: labSelect,
      }),
      prisma.lab.count(),
    ]);
    return paginatedResponse(data, total, query);
  }

  async getById(id: string) {
    return prisma.lab.findUnique({
      where: { id },
      select: labSelect,
    });
  }

  async create(data: CreateLabInput) {
    return prisma.lab.create({
      data,
      select: labSelect,
    });
  }

  async update(id: string, data: UpdateLabInput) {
    return prisma.lab.update({
      where: { id },
      data,
      select: labSelect,
    });
  }

  async delete(id: string) {
    return prisma.lab.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const lab = await prisma.lab.findUnique({ where: { id }, select: { id: true } });
    return !!lab;
  }

  // Submissions
  async createSubmission(labId: string, userId: string, data: CreateSubmissionInput) {
    return prisma.labSubmission.create({
      data: { ...data, labId, userId },
      select: {
        id: true,
        content: true,
        status: true,
        feedback: true,
        createdAt: true,
      },
    });
  }

  async listUserSubmissions(labId: string, userId: string) {
    return prisma.labSubmission.findMany({
      where: { labId, userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        status: true,
        feedback: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const labsService = new LabsService();
