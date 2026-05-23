import { FastifyRequest, FastifyReply } from "fastify";
import { coursesService } from "./courses.service.js";
import {
  createCourseSchema,
  createModuleSchema,
  createLessonSchema,
  createQuizSchema,
  submitQuizSchema,
  createNoteSchema,
  updateNoteSchema,
  coursesFilterSchema,
} from "./courses.schema.js";

type IdParams = { Params: { id: string } };

export class CoursesController {
  // ─── Courses ────────────────────────────────────────────────

  async listCourses(request: FastifyRequest, reply: FastifyReply) {
    const filter = coursesFilterSchema.parse(request.query);
    const result = await coursesService.listCourses(filter, request.user?.id);
    return reply.send(result);
  }

  async getCourse(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const course = await coursesService.getCourse(request.params.id, request.user?.id);
    if (!course) return reply.status(404).send({ error: "Course not found" });
    return reply.send(course);
  }

  async createCourse(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createCourseSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    const course = await coursesService.createCourse(request.user!.id, parsed.data);
    return reply.status(201).send(course);
  }

  // ─── Modules ────────────────────────────────────────────────

  async createModule(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const parsed = createModuleSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    try {
      const mod = await coursesService.createModule(request.params.id, parsed.data);
      return reply.status(201).send(mod);
    } catch (e: any) {
      return reply.status(404).send({ error: e.message });
    }
  }

  // ─── Lessons ────────────────────────────────────────────────

  async createLesson(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const parsed = createLessonSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    try {
      const lesson = await coursesService.createLesson(request.params.id, parsed.data);
      return reply.status(201).send(lesson);
    } catch (e: any) {
      return reply.status(404).send({ error: e.message });
    }
  }

  async getLesson(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const lesson = await coursesService.getLesson(request.params.id, request.user?.id);
    if (!lesson) return reply.status(404).send({ error: "Lesson not found" });
    return reply.send(lesson);
  }

  // ─── Enrollment ─────────────────────────────────────────────

  async enrollUser(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    try {
      await coursesService.enrollUser(request.params.id, request.user!.id);
      return reply.send({ message: "Enrolled successfully" });
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  }

  async finishLesson(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    try {
      const progress = await coursesService.finishLesson(request.params.id, request.user!.id);
      return reply.send(progress);
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  }

  // ─── Bookmarks ──────────────────────────────────────────────

  async toggleBookmark(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const result = await coursesService.toggleBookmark(request.params.id, request.user!.id);
    return reply.send(result);
  }

  async getUserBookmarks(request: FastifyRequest, reply: FastifyReply) {
    const bookmarks = await coursesService.getUserBookmarks(request.user!.id);
    return reply.send(bookmarks);
  }

  // ─── Notes ──────────────────────────────────────────────────

  async createNote(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const parsed = createNoteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    try {
      const note = await coursesService.createNote(request.params.id, request.user!.id, parsed.data);
      return reply.status(201).send(note);
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  }

  async getCourseNotes(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const notes = await coursesService.getCourseNotes(request.params.id, request.user!.id);
    return reply.send(notes);
  }

  async updateNote(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const parsed = updateNoteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    try {
      const note = await coursesService.updateNote(request.params.id, request.user!.id, parsed.data);
      return reply.send(note);
    } catch (e: any) {
      return reply.status(404).send({ error: e.message });
    }
  }

  async deleteNote(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    try {
      await coursesService.deleteNote(request.params.id, request.user!.id);
      return reply.status(204).send();
    } catch (e: any) {
      return reply.status(404).send({ error: e.message });
    }
  }

  // ─── Quiz ────────────────────────────────────────────────────

  async createQuiz(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const parsed = createQuizSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    try {
      const quiz = await coursesService.createQuiz(request.params.id, parsed.data);
      return reply.status(201).send(quiz);
    } catch (e: any) {
      return reply.status(404).send({ error: e.message });
    }
  }

  async getCourseQuiz(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const quiz = await coursesService.getCourseQuiz(request.params.id, request.user?.id);
    if (!quiz) return reply.status(404).send({ error: "No quiz found for this course" });
    return reply.send(quiz);
  }

  async submitQuiz(request: FastifyRequest<IdParams>, reply: FastifyReply) {
    const parsed = submitQuizSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }
    try {
      const result = await coursesService.submitQuiz(request.params.id, request.user!.id, parsed.data);
      return reply.send(result);
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  }

  // ─── Stats ───────────────────────────────────────────────────

  async getUserStats(request: FastifyRequest, reply: FastifyReply) {
    const stats = await coursesService.getUserStats(request.user!.id);
    return reply.send(stats);
  }

  async getEnrolledCourses(request: FastifyRequest, reply: FastifyReply) {
    const courses = await coursesService.getEnrolledCourses(request.user!.id);
    return reply.send(courses);
  }
}

export const coursesController = new CoursesController();
