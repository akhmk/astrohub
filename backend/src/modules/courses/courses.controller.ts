import { FastifyRequest, FastifyReply } from "fastify";
import { coursesService } from "./courses.service.js";
import { createCourseSchema, createLessonSchema } from "./courses.schema.js";
import { paginationSchema } from "../../utils/pagination.js";

export class CoursesController {
  async listCourses(request: FastifyRequest, reply: FastifyReply) {
    const query = paginationSchema.parse(request.query);
    const result = await coursesService.listCourses(query);
    return reply.send(result);
  }

  async getCourse(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const course = await coursesService.getCourse(request.params.id, request.user?.id);
    if (!course) {
      return reply.status(404).send({ error: "Course not found" });
    }
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

  async createLesson(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = createLessonSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    try {
      const lesson = await coursesService.createLesson(request.params.id, parsed.data);
      return reply.status(201).send(lesson);
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  }

  async getLesson(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const lesson = await coursesService.getLesson(request.params.id, request.user?.id);
    if (!lesson) {
      return reply.status(404).send({ error: "Lesson not found" });
    }
    return reply.send(lesson);
  }

  async enrollUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await coursesService.enrollUser(request.params.id, request.user!.id);
      return reply.send({ message: "Enrolled successfully" });
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async finishLesson(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const progress = await coursesService.finishLesson(request.params.id, request.user!.id);
      return reply.send(progress);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export const coursesController = new CoursesController();
