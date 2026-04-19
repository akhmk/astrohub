import { FastifyInstance } from "fastify";
import { roadmapsController } from "./roadmaps.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/roleGuard.js";

interface IdParams { Params: { id: string } }

export async function roadmapsRoutes(app: FastifyInstance) {
  // Public
  app.get("/", roadmapsController.list);
  app.get<IdParams>("/:id", roadmapsController.getById);

  // Admin only
  app.post("/", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, roadmapsController.create);
  app.patch<IdParams>("/:id", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, roadmapsController.update);
  app.delete<IdParams>("/:id", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, roadmapsController.delete);

  // User progress (authenticated)
  app.get<IdParams>("/:id/progress", { preHandler: [authMiddleware] }, roadmapsController.getProgress);
  app.patch<IdParams>("/:id/progress", { preHandler: [authMiddleware] }, roadmapsController.updateProgress);
}
