import { FastifyRequest, FastifyReply } from "fastify";
import { usersService } from "./users.service.js";
import { updateUserSchema } from "./users.schema.js";

export class UsersController {
  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const user = await usersService.getById(request.user!.id);
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    return reply.send(user);
  }

  async updateMe(request: FastifyRequest, reply: FastifyReply) {
    const parsed = updateUserSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const user = await usersService.update(request.user!.id, parsed.data);
      return reply.send(user);
    } catch (error: any) {
      if (error.message === "Username is already taken") {
        return reply.status(409).send({ error: error.message });
      }
      throw error;
    }
  }
}

export const usersController = new UsersController();
