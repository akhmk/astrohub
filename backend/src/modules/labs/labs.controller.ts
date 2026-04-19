import { FastifyRequest, FastifyReply } from "fastify";
import { labsService } from "./labs.service.js";
import { createLabSchema, updateLabSchema, createSubmissionSchema } from "./labs.schema.js";
import { paginationSchema } from "../../utils/pagination.js";

export class LabsController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = paginationSchema.parse(request.query);
    const result = await labsService.list(query);
    return reply.send(result);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const lab = await labsService.getById(request.params.id);
    if (!lab) {
      return reply.status(404).send({ error: "Lab not found" });
    }
    return reply.send(lab);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createLabSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    const lab = await labsService.create(parsed.data);
    return reply.status(201).send(lab);
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateLabSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    if (!(await labsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Lab not found" });
    }
    const lab = await labsService.update(request.params.id, parsed.data);
    return reply.send(lab);
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    if (!(await labsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Lab not found" });
    }
    await labsService.delete(request.params.id);
    return reply.status(204).send();
  }

  async createSubmission(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = createSubmissionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    if (!(await labsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Lab not found" });
    }
    const submission = await labsService.createSubmission(request.params.id, request.user!.id, parsed.data);
    return reply.status(201).send(submission);
  }

  async listSubmissions(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    if (!(await labsService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Lab not found" });
    }
    const submissions = await labsService.listUserSubmissions(request.params.id, request.user!.id);
    return reply.send(submissions);
  }
}

export const labsController = new LabsController();
