import { FastifyRequest, FastifyReply } from "fastify";
import { roadmapsService } from "./roadmaps.service.js";
import { createRoadmapSchema, updateRoadmapSchema, updateProgressSchema } from "./roadmaps.schema.js";
import { paginationSchema } from "../../utils/pagination.js";

export class RoadmapsController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = paginationSchema.parse(request.query);
    const result = await roadmapsService.list(query);
    return reply.send(result);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const roadmap = await roadmapsService.getById(request.params.id);
    if (!roadmap) {
      return reply.status(404).send({ error: "Roadmap not found" });
    }
    return reply.send(roadmap);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createRoadmapSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    const roadmap = await roadmapsService.create(parsed.data);
    return reply.status(201).send(roadmap);
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateRoadmapSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    if (!(await roadmapsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Roadmap not found" });
    }
    const roadmap = await roadmapsService.update(request.params.id, parsed.data);
    return reply.send(roadmap);
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    if (!(await roadmapsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Roadmap not found" });
    }
    await roadmapsService.delete(request.params.id);
    return reply.status(204).send();
  }

  async getProgress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    if (!(await roadmapsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Roadmap not found" });
    }
    const progress = await roadmapsService.getProgress(request.params.id, request.user!.id);
    return reply.send(progress || { completedSteps: [], updatedAt: null });
  }

  async updateProgress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateProgressSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    if (!(await roadmapsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Roadmap not found" });
    }
    const progress = await roadmapsService.updateProgress(request.params.id, request.user!.id, parsed.data);
    return reply.send(progress);
  }
}

export const roadmapsController = new RoadmapsController();
