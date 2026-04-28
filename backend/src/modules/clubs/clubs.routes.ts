import { FastifyInstance } from "fastify";
import { clubsController } from "./clubs.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/roleGuard.js";

interface IdParams { Params: { id: string } }

export async function clubsRoutes(app: FastifyInstance) {
  // Public
  app.get("/", { preHandler: [optionalAuthMiddleware] }, clubsController.listClubs);
  app.get<IdParams>("/:id", clubsController.getClub);
  app.get<IdParams>("/:id/posts", clubsController.listClubPosts);

  // Protected
  // Protected
  app.post("/", { preHandler: [authMiddleware] }, clubsController.createClub);
  app.post<IdParams>("/:id/join", { preHandler: [authMiddleware] }, clubsController.joinClub);
  app.post<IdParams>("/:id/leave", { preHandler: [authMiddleware] }, clubsController.leaveClub);
  app.post<IdParams>("/:id/posts", { preHandler: [authMiddleware] }, clubsController.createClubPost);

  // Admin Only
  app.patch<IdParams>("/:id/approve", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, clubsController.approveClub);
}
