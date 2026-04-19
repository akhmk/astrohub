import { FastifyInstance } from "fastify";
import { forumController } from "./forum.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

interface IdParams { Params: { id: string } }

export async function forumRoutes(app: FastifyInstance) {
  // Public routes
  app.get("/posts", forumController.listPosts);
  app.get<IdParams>("/posts/:id", forumController.getPost);

  // Protected routes
  app.post("/posts", { preHandler: [authMiddleware] }, forumController.createPost);
  app.patch<IdParams>("/posts/:id", { preHandler: [authMiddleware] }, forumController.updatePost);
  app.delete<IdParams>("/posts/:id", { preHandler: [authMiddleware] }, forumController.deletePost);

  // Comments
  app.post<IdParams>("/posts/:id/comments", { preHandler: [authMiddleware] }, forumController.addComment);
  app.delete<IdParams>("/comments/:id", { preHandler: [authMiddleware] }, forumController.deleteComment);
}
