import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse, type PaginationQuery } from "../../utils/pagination.js";
import type { CreateCourseInput, CreateLessonInput, CreateNoteInput, UpdateNoteInput } from "./courses.schema.js";

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
          select: { id: true, title: true, videoURL: true, duration: true, summary: true, order: true },
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
        completedLessons = progress.map((p: any) => p.lessonId);
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

    if (existing) throw new Error("Already enrolled in this course");

    return prisma.courseEnrollment.create({ data: { userId, courseId } });
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

  // ─── Enrolled courses for Dashboard ─────────────────────────────

  async getEnrolledCourses(userId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            imageURL: true,
            createdAt: true,
            author: { select: { id: true, firstName: true, lastName: true, photoURL: true } },
            _count: { select: { enrollments: true, lessons: true } },
          },
        },
      },
    });

    const courseIds = enrollments.map((e: any) => e.courseId);
    const progressRows = await prisma.lessonProgress.groupBy({
      by: ["courseId"],
      where: { userId, courseId: { in: courseIds } },
      _count: { lessonId: true },
    });

    const progressMap = new Map<string, number>(
      progressRows.map((r: any) => [r.courseId, Number(r._count?.lessonId ?? 0)])
    );

    return enrollments.map((e: any) => {
      const totalLessons = Number(e.course._count?.lessons ?? 0);
      const completedLessons = Number(progressMap.get(e.courseId) ?? 0);
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      return {
        ...e.course,
        enrolledAt: e.enrolledAt,
        completedLessonsCount: completedLessons,
        totalLessonsCount: totalLessons,
        progress,
      };
    });
  }

  // ─── Notes ───────────────────────────────────────────────────────

  async getCourseNotes(courseId: string, userId: string) {
    return prisma.courseNote.findMany({
      where: { courseId, userId },
      orderBy: { createdAt: "desc" },
      include: { lesson: { select: { id: true, title: true } } },
    });
  }

  async createNote(userId: string, courseId: string, data: CreateNoteInput) {
    return prisma.courseNote.create({
      data: { userId, courseId, content: data.content, lessonId: data.lessonId ?? null },
      include: { lesson: { select: { id: true, title: true } } },
    });
  }

  async updateNote(noteId: string, userId: string, data: UpdateNoteInput) {
    const note = await prisma.courseNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) throw new Error("Note not found");
    return prisma.courseNote.update({
      where: { id: noteId },
      data: { content: data.content },
      include: { lesson: { select: { id: true, title: true } } },
    });
  }

  async deleteNote(noteId: string, userId: string) {
    const note = await prisma.courseNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) throw new Error("Note not found");
    return prisma.courseNote.delete({ where: { id: noteId } });
  }
}

export const coursesService = new CoursesService();
