import { FastifyInstance } from "fastify";
import { coursesController } from "./courses.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../../middleware/auth.js";
import { roleGuard } from "../../middleware/roleGuard.js";

type IdParams = { Params: { id: string } };

export async function coursesRoutes(app: FastifyInstance) {
  // ─── Public / Optional-auth ────────────────────────────────
  app.get("/", { preHandler: [optionalAuthMiddleware] }, coursesController.listCourses.bind(coursesController));
  app.get<IdParams>("/:id", { preHandler: [optionalAuthMiddleware] }, coursesController.getCourse.bind(coursesController));
  app.get<IdParams>("/:id/quiz", { preHandler: [optionalAuthMiddleware] }, coursesController.getCourseQuiz.bind(coursesController));
  app.get<IdParams>("/lessons/:id", { preHandler: [optionalAuthMiddleware] }, coursesController.getLesson.bind(coursesController));

  // ─── Admin / Teacher Only ──────────────────────────────────
  const staffGuard = [authMiddleware, roleGuard("ADMIN", "TEACHER")];
  app.post("/", { preHandler: staffGuard }, coursesController.createCourse.bind(coursesController));
  app.post<IdParams>("/:id/modules", { preHandler: staffGuard }, coursesController.createModule.bind(coursesController));
  app.post<IdParams>("/:id/lessons", { preHandler: staffGuard }, coursesController.createLesson.bind(coursesController));
  app.post<IdParams>("/:id/quiz", { preHandler: staffGuard }, coursesController.createQuiz.bind(coursesController));

  // ─── Authenticated User ────────────────────────────────────
  app.post<IdParams>("/:id/enroll", { preHandler: [authMiddleware] }, coursesController.enrollUser.bind(coursesController));
  app.post<IdParams>("/lessons/:id/complete", { preHandler: [authMiddleware] }, coursesController.finishLesson.bind(coursesController));

  // Bookmarks
  app.post<IdParams>("/:id/bookmark", { preHandler: [authMiddleware] }, coursesController.toggleBookmark.bind(coursesController));
  app.get("/my/bookmarks", { preHandler: [authMiddleware] }, coursesController.getUserBookmarks.bind(coursesController));

  // Notes
  app.post<IdParams>("/:id/notes", { preHandler: [authMiddleware] }, coursesController.createNote.bind(coursesController));
  app.get<IdParams>("/:id/notes", { preHandler: [authMiddleware] }, coursesController.getCourseNotes.bind(coursesController));
  app.patch<IdParams>("/notes/:id", { preHandler: [authMiddleware] }, coursesController.updateNote.bind(coursesController));
  app.delete<IdParams>("/notes/:id", { preHandler: [authMiddleware] }, coursesController.deleteNote.bind(coursesController));

  // Quiz
  app.post<IdParams>("/quiz/:id/attempt", { preHandler: [authMiddleware] }, coursesController.submitQuiz.bind(coursesController));

  // Stats
  app.get("/my/stats", { preHandler: [authMiddleware] }, coursesController.getUserStats.bind(coursesController));
  app.get("/my/enrolled", { preHandler: [authMiddleware] }, coursesController.getEnrolledCourses.bind(coursesController));
}
