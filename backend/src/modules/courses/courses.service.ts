import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse, type PaginationQuery } from "../../utils/pagination.js";
import type { CreateCourseInput, CreateLessonInput } from "./courses.schema.js";

const courseSelect = {
  id: true,
  title: true,
  description: true,
  imageURL: true,
  createdAt: true,
  author: {
    select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
  },
  _count: { select: { enrollments: true, lessons: true } },
};

export class CoursesService {
  async listCourses(query: PaginationQuery) {
    const [data, total] = await Promise.all([
      prisma.course.findMany({
        ...paginate(query),
        orderBy: { createdAt: "desc" },
        select: courseSelect,
      }),
      prisma.course.count(),
    ]);
    return paginatedResponse(data, total, query);
  }

  async getCourse(id: string, userId?: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
        },
        lessons: {
          orderBy: { order: "asc" },
          select: { id: true, title: true, videoURL: true, order: true }, // Don't fetch full content in list
        },
        _count: { select: { enrollments: true, lessons: true } },
      },
    });

    if (!course) return null;

    let isEnrolled = false;
    let completedLessons: string[] = [];

    if (userId) {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId, courseId: id } },
      });
      isEnrolled = !!enrollment;

      if (isEnrolled) {
        const progress = await prisma.lessonProgress.findMany({
          where: { userId, courseId: id },
          select: { lessonId: true },
        });
        completedLessons = progress.map((p) => p.lessonId);
      }
    }

    return { ...course, isEnrolled, completedLessons };
  }

  async createCourse(authorId: string, data: CreateCourseInput) {
    return prisma.course.create({
      data: { ...data, author: { connect: { id: authorId } } } as any,
      select: courseSelect,
    });
  }

  async createLesson(courseId: string, data: CreateLessonInput) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");

    return prisma.lesson.create({
      data: { ...data, course: { connect: { id: courseId } } } as any,
    });
  }

  async getLesson(lessonId: string, userId?: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) return null;

    let isCompleted = false;
    if (userId) {
      const progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });
      isCompleted = !!progress;
    }

    return { ...lesson, isCompleted };
  }

  async enrollUser(courseId: string, userId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");

    const existing = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      throw new Error("Already enrolled in this course");
    }

    return prisma.courseEnrollment.create({
      data: { userId, courseId },
    });
  }

  async finishLesson(lessonId: string, userId: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new Error("Lesson not found");

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });

    if (!enrollment) throw new Error("You must be enrolled to complete a lesson");

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (existing) return existing;

    return prisma.lessonProgress.create({
      data: { userId, lessonId, courseId: lesson.courseId },
    });
  }
}

export const coursesService = new CoursesService();
