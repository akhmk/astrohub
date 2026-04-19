import { FastifyInstance } from "fastify";
import { blogController } from "./blog.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/roleGuard.js";

interface SlugParams { Params: { slug: string } }
interface IdParams { Params: { id: string } }

export async function blogRoutes(app: FastifyInstance) {
  // Public
  app.get("/", blogController.listPosts);
  app.get<SlugParams>("/:slug", { preHandler: [optionalAuthMiddleware] }, blogController.getPost);

  // Admin only
  app.post("/", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, blogController.createPost);
  app.patch<IdParams>("/:id", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, blogController.updatePost);
  app.delete<IdParams>("/:id", { preHandler: [authMiddleware, roleGuard("ADMIN")] }, blogController.deletePost);
}
