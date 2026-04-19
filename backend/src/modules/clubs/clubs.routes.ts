import { FastifyInstance } from "fastify";
import { clubsController } from "./clubs.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

interface IdParams { Params: { id: string } }

export async function clubsRoutes(app: FastifyInstance) {
  // Public
  app.get("/", clubsController.listClubs);
  app.get<IdParams>("/:id", clubsController.getClub);
  app.get<IdParams>("/:id/posts", clubsController.listClubPosts);

  // Protected
  app.post("/", { preHandler: [authMiddleware] }, clubsController.createClub);
  app.post<IdParams>("/:id/join", { preHandler: [authMiddleware] }, clubsController.joinClub);
  app.post<IdParams>("/:id/leave", { preHandler: [authMiddleware] }, clubsController.leaveClub);
  app.post<IdParams>("/:id/posts", { preHandler: [authMiddleware] }, clubsController.createClubPost);
}
