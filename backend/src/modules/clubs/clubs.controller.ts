import { FastifyRequest, FastifyReply } from "fastify";
import { clubsService } from "./clubs.service.js";
import { createClubSchema, createClubPostSchema } from "./clubs.schema.js";
import { paginationSchema } from "../../utils/pagination.js";

export class ClubsController {
  async listClubs(request: FastifyRequest, reply: FastifyReply) {
    const query = paginationSchema.parse(request.query);
    const isAdmin = request.user?.role === "ADMIN";
    const result = await clubsService.listClubs(query, isAdmin);
    return reply.send(result);
  }

  async getClub(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const club = await clubsService.getClub(request.params.id);
    if (!club) {
      return reply.status(404).send({ error: "Club not found" });
    }
    return reply.send(club);
  }

  async createClub(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createClubSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    try {
      const club = await clubsService.createClub(request.user!.id, parsed.data);
      return reply.status(201).send(club);
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.status(409).send({ error: "A club with this name already exists" });
      }
      throw error;
    }
  }

  async joinClub(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const club = await clubsService.getClub(request.params.id);
    if (!club) {
      return reply.status(404).send({ error: "Club not found" });
    }

    try {
      await clubsService.joinClub(request.params.id, request.user!.id);
      return reply.send({ message: "Joined club successfully" });
    } catch (error: any) {
      return reply.status(409).send({ error: error.message });
    }
  }

  async leaveClub(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await clubsService.leaveClub(request.params.id, request.user!.id);
      return reply.send({ message: "Left club successfully" });
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async listClubPosts(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const query = paginationSchema.parse(request.query);
    const result = await clubsService.listClubPosts(request.params.id, query);
    return reply.send(result);
  }

  async createClubPost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = createClubPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    // Check membership
    const isMember = await clubsService.isMember(request.params.id, request.user!.id);
    if (!isMember) {
      return reply.status(403).send({ error: "You must be a member of this club to post" });
    }

    const post = await clubsService.createClubPost(request.params.id, request.user!.id, parsed.data);
    return reply.status(201).send(post);
  }

  async approveClub(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const club = await clubsService.approveClub(request.params.id);
      return reply.send(club);
    } catch (error: any) {
      if (error.message === "Club not found") {
        return reply.status(404).send({ error: error.message });
      }
      return reply.status(400).send({ error: error.message });
    }
  }
}

export const clubsController = new ClubsController();
