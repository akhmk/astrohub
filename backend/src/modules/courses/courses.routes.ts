import { FastifyInstance } from "fastify";
import { coursesController } from "./courses.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/roleGuard.js";

interface IdParams { Params: { id: string } }

export async function coursesRoutes(app: FastifyInstance) {
  // ─── Public / optional-auth ──────────────────────────────────
  app.get("/", coursesController.listCourses);
  app.get<IdParams>("/:id", { preHandler: [optionalAuthMiddleware] }, coursesController.getCourse);
  app.get<IdParams>("/lessons/:id", { preHandler: [optionalAuthMiddleware] }, coursesController.getLesson);

  // ─── Admin & Teacher only ─────────────────────────────────────
  const staffGuard = [authMiddleware, roleGuard("ADMIN", "TEACHER")];
  app.post("/", { preHandler: staffGuard }, coursesController.createCourse);
  app.post<IdParams>("/:id/lessons", { preHandler: staffGuard }, coursesController.createLesson);

  // ─── Authenticated user ───────────────────────────────────────
  app.get("/my/enrolled", { preHandler: [authMiddleware] }, coursesController.getEnrolledCourses);

  app.post<IdParams>("/:id/enroll", { preHandler: [authMiddleware] }, coursesController.enrollUser);
  app.post<IdParams>("/lessons/:id/complete", { preHandler: [authMiddleware] }, coursesController.finishLesson);

  // Notes
  app.get<IdParams>("/:id/notes", { preHandler: [authMiddleware] }, coursesController.getCourseNotes);
  app.post<IdParams>("/:id/notes", { preHandler: [authMiddleware] }, coursesController.createNote);
  app.patch<IdParams>("/notes/:id", { preHandler: [authMiddleware] }, coursesController.updateNote);
  app.delete<IdParams>("/notes/:id", { preHandler: [authMiddleware] }, coursesController.deleteNote);
}
