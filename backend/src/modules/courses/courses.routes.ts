import { FastifyInstance } from "fastify";
import { coursesController } from "./courses.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/roleGuard.js";

interface IdParams { Params: { id: string } }

export async function coursesRoutes(app: FastifyInstance) {
  // Public
  app.get("/", coursesController.listCourses);
  app.get<IdParams>("/:id", { preHandler: [optionalAuthMiddleware] }, coursesController.getCourse);
  app.get<IdParams>("/lessons/:id", { preHandler: [optionalAuthMiddleware] }, coursesController.getLesson);

  // Admin & Teacher Only
  app.post("/", { preHandler: [authMiddleware, roleGuard("ADMIN", "TEACHER")] }, coursesController.createCourse);
  app.post<IdParams>("/:id/lessons", { preHandler: [authMiddleware, roleGuard("ADMIN", "TEACHER")] }, coursesController.createLesson);

  // Protected (User)
  app.post<IdParams>("/:id/enroll", { preHandler: [authMiddleware] }, coursesController.enrollUser);
  app.post<IdParams>("/lessons/:id/complete", { preHandler: [authMiddleware] }, coursesController.finishLesson);
}
