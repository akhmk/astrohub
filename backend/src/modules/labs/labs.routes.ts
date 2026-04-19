import { FastifyInstance } from "fastify";
import { labsController } from "./labs.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/roleGuard.js";

interface IdParams { Params: { id: string } }

export async function labsRoutes(app: FastifyInstance) {
  // Public
  app.get("/", labsController.list);
  app.get<IdParams>("/:id", labsController.getById);

  // Admin only
  app.post("/", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, labsController.create);
  app.patch<IdParams>("/:id", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, labsController.update);
  app.delete<IdParams>("/:id", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, labsController.delete);

  // Submissions (authenticated)
  app.post<IdParams>("/:id/submissions", { preHandler: [authMiddleware] }, labsController.createSubmission);
  app.get<IdParams>("/:id/submissions", { preHandler: [authMiddleware] }, labsController.listSubmissions);
}
