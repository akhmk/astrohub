import { FastifyInstance } from "fastify";
import { usersController } from "./users.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

export async function usersRoutes(app: FastifyInstance) {
  // All user routes require authentication
  app.addHook("preHandler", authMiddleware);

  app.get("/me", usersController.getMe);
  app.patch("/me", usersController.updateMe);
}
