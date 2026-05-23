import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse } from "../../utils/pagination.js";
import type {
  CreateCourseInput,
  CreateModuleInput,
  CreateLessonInput,
  CreateQuizInput,
  SubmitQuizInput,
  CreateNoteInput,
  UpdateNoteInput,
  CoursesFilter,
} from "./courses.schema.js";

// ─── Selectors ───────────────────────────────────────────────────

const courseCardSelect = {
  id: true,
  title: true,
  subtitle: true,
  description: true,
  imageURL: true,
  category: true,
  level: true,
  estimatedHours: true,
  tags: true,
  isPublished: true,
  createdAt: true,
  author: {
    select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
  },
  _count: { select: { enrollments: true, lessons: true, modules: true } },
};

// ─── Courses ─────────────────────────────────────────────────────

export class CoursesService {
  async listCourses(filter: CoursesFilter, userId?: string) {
    const { page, limit, search, category, level } = filter;
    const where: any = { isPublished: true };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }
    if (category) where.category = { equals: category, mode: "insensitive" };
    if (level) where.level = level;

    const [rawData, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: courseCardSelect,
      }),
      prisma.course.count({ where }),
    ]);

    let bookmarkedIds = new Set<string>();
    let enrolledIds = new Set<string>();
    let progressMap = new Map<string, number>();

    if (userId) {
      const [bookmarks, enrollments] = await Promise.all([
        prisma.courseBookmark.findMany({ where: { userId }, select: { courseId: true } }),
        prisma.courseEnrollment.findMany({ where: { userId }, select: { courseId: true } }),
      ]);
      bookmarkedIds = new Set(bookmarks.map((b: any) => b.courseId));
      enrolledIds = new Set(enrollments.map((e: any) => e.courseId));

      if (enrolledIds.size > 0) {
        const progressRows = await prisma.lessonProgress.groupBy({
          by: ["courseId"],
          where: { userId, courseId: { in: [...enrolledIds] } },
          _count: { lessonId: true },
        });
        for (const row of progressRows) {
          progressMap.set(row.courseId, row._count.lessonId);
        }
      }
    }

    const data = rawData.map((c: any) => ({
      ...c,
      isBookmarked: bookmarkedIds.has(c.id),
      isEnrolled: enrolledIds.has(c.id),
      completedLessonsCount: progressMap.get(c.id) ?? 0,
    }));

    const totalPages = Math.ceil(total / limit);
    return { data, meta: { page, limit, total, totalPages, hasMore: page < totalPages } };
  }

  async getCourse(id: string, userId?: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
        },
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, duration: true, lessonType: true, order: true, moduleId: true, summary: true },
            },
          },
        },
        lessons: {
          where: { moduleId: null },
          orderBy: { order: "asc" },
          select: { id: true, title: true, duration: true, lessonType: true, order: true, moduleId: true, summary: true },
        },
        _count: { select: { enrollments: true, lessons: true, modules: true } },
      },
    });

    if (!course) return null;

    let isEnrolled = false;
    let isBookmarked = false;
    let completedLessons: string[] = [];

    if (userId) {
      const [enrollment, bookmark, progress] = await Promise.all([
        prisma.courseEnrollment.findUnique({ where: { userId_courseId: { userId, courseId: id } } }),
        prisma.courseBookmark.findUnique({ where: { userId_courseId: { userId, courseId: id } } }),
        prisma.lessonProgress.findMany({ where: { userId, courseId: id }, select: { lessonId: true } }),
      ]);
      isEnrolled = !!enrollment;
      isBookmarked = !!bookmark;
      completedLessons = progress.map((p: any) => p.lessonId);
    }

    return { ...course, isEnrolled, isBookmarked, completedLessons };
  }

  async createCourse(authorId: string, data: CreateCourseInput) {
    return prisma.course.create({
      data: { ...data, authorId },
      select: courseCardSelect,
    });
  }

  // ─── Modules ──────────────────────────────────────────────────

  async createModule(courseId: string, data: CreateModuleInput) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");
    return prisma.courseModule.create({ data: { ...data, courseId } });
  }

  // ─── Lessons ──────────────────────────────────────────────────

  async createLesson(courseId: string, data: CreateLessonInput) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");
    return prisma.lesson.create({ data: { ...data, courseId } });
  }

  async getLesson(lessonId: string, userId?: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
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

  // ─── Enrollment ───────────────────────────────────────────────

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

    const [progress] = await Promise.all([
      prisma.lessonProgress.create({ data: { userId, lessonId, courseId: lesson.courseId } }),
      this._grantXP(userId, 10),
      this._updateStreak(userId),
    ]);

    return progress;
  }

  // ─── Bookmarks ────────────────────────────────────────────────

  async toggleBookmark(courseId: string, userId: string) {
    const existing = await prisma.courseBookmark.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      await prisma.courseBookmark.delete({ where: { id: existing.id } });
      return { action: "removed" as const };
    }

    await prisma.courseBookmark.create({ data: { userId, courseId } });
    return { action: "added" as const };
  }

  async getUserBookmarks(userId: string) {
    const bookmarks = await prisma.courseBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: courseCardSelect },
      },
    });
    return bookmarks.map((b: any) => ({ ...b.course, isBookmarked: true }));
  }

  // ─── Notes ────────────────────────────────────────────────────

  async createNote(courseId: string, userId: string, data: CreateNoteInput) {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new Error("You must be enrolled to add notes");

    return prisma.courseNote.create({
      data: { userId, courseId, lessonId: data.lessonId, content: data.content },
    });
  }

  async getCourseNotes(courseId: string, userId: string) {
    return prisma.courseNote.findMany({
      where: { courseId, userId },
      orderBy: { createdAt: "desc" },
      include: {
        lesson: { select: { id: true, title: true } },
      },
    });
  }

  async updateNote(noteId: string, userId: string, data: UpdateNoteInput) {
    const note = await prisma.courseNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) throw new Error("Note not found");
    return prisma.courseNote.update({ where: { id: noteId }, data: { content: data.content } });
  }

  async deleteNote(noteId: string, userId: string) {
    const note = await prisma.courseNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) throw new Error("Note not found");
    await prisma.courseNote.delete({ where: { id: noteId } });
  }

  // ─── Quiz ─────────────────────────────────────────────────────

  async createQuiz(courseId: string, data: CreateQuizInput) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");

    const { questions, ...quizData } = data;
    return prisma.quiz.create({
      data: {
        ...quizData,
        courseId,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            options: q.options,
            explanation: q.explanation,
            order: q.order,
            points: q.points,
          })),
        },
      },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  }

  async getCourseQuiz(courseId: string, userId?: string) {
    const quiz = await prisma.quiz.findFirst({
      where: { courseId },
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    });
    if (!quiz) return null;

    let bestAttempt = null;
    let myAttempts: any[] = [];
    if (userId) {
      myAttempts = await prisma.quizAttempt.findMany({
        where: { quizId: quiz.id, userId },
        orderBy: { completedAt: "desc" },
        select: { id: true, score: true, maxScore: true, passed: true, completedAt: true },
      });
      if (myAttempts.length > 0) {
        bestAttempt = myAttempts.reduce((best, a) => (a.score > best.score ? a : best));
      }
    }

    // Strip correct answers from options before sending to client
    const sanitizedQuestions = quiz.questions.map((q: any) => ({
      ...q,
      options: (q.options as any[]).map(({ id, text }) => ({ id, text })),
    }));

    return { ...quiz, questions: sanitizedQuestions, myAttempts, bestAttempt };
  }

  async submitQuiz(quizId: string, userId: string, data: SubmitQuizInput) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) throw new Error("Quiz not found");

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId: quiz.courseId } },
    });
    if (!enrollment) throw new Error("You must be enrolled to take the quiz");

    const answerMap = new Map(data.answers.map((a) => [a.questionId, a.selectedOptionId]));

    let score = 0;
    let maxScore = 0;
    const answers: any[] = [];

    for (const question of quiz.questions) {
      const options = question.options as any[];
      const selectedId = answerMap.get(question.id);
      const selectedOption = options.find((o) => o.id === selectedId);
      const correctOption = options.find((o) => o.isCorrect);
      const isCorrect = !!selectedOption?.isCorrect;

      maxScore += question.points;
      if (isCorrect) score += question.points;

      answers.push({
        questionId: question.id,
        selectedOptionId: selectedId ?? null,
        correctOptionId: correctOption?.id ?? null,
        isCorrect,
        explanation: question.explanation,
      });
    }

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: { userId, quizId, score: percentage, maxScore: 100, passed, answers },
    });

    if (passed) {
      await this._grantXP(userId, 50);
      await prisma.userStats.upsert({
        where: { userId },
        update: { totalQuizzesPassed: { increment: 1 } },
        create: { userId, totalQuizzesPassed: 1, xp: 50 },
      });
    }

    return { ...attempt, percentage, passed, answers };
  }

  async getQuizAttempt(attemptId: string, userId: string) {
    const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt || attempt.userId !== userId) throw new Error("Attempt not found");
    return attempt;
  }

  // ─── User Stats ───────────────────────────────────────────────

  async getUserStats(userId: string) {
    const [stats, enrollmentCount, completedCount] = await Promise.all([
      prisma.userStats.findUnique({ where: { userId } }),
      prisma.courseEnrollment.count({ where: { userId } }),
      prisma.lessonProgress.count({ where: { userId } }),
    ]);

    return {
      xp: stats?.xp ?? 0,
      streak: stats?.streak ?? 0,
      lastStudiedAt: stats?.lastStudiedAt ?? null,
      totalLessonsCompleted: stats?.totalLessonsCompleted ?? completedCount,
      totalQuizzesPassed: stats?.totalQuizzesPassed ?? 0,
      enrolledCourses: enrollmentCount,
    };
  }

  async getEnrolledCourses(userId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          select: {
            ...courseCardSelect,
            lessons: { select: { id: true } },
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
    const progressMap = new Map<string, number>(progressRows.map((r: any) => [r.courseId, Number(r._count?.lessonId ?? 0)]));

    return enrollments.map((e: any) => {
      const totalLessons = Number(e.course.lessons?.length ?? e.course._count?.lessons ?? 0);
      const completedLessons = Number(progressMap.get(e.courseId) ?? 0);
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      return {
        ...e.course,
        isEnrolled: true,
        enrolledAt: e.enrolledAt,
        completedLessonsCount: completedLessons,
        totalLessonsCount: totalLessons,
        progress,
      };
    });
  }

  // ─── Private helpers ──────────────────────────────────────────

  private async _grantXP(userId: string, amount: number) {
    await prisma.userStats.upsert({
      where: { userId },
      update: { xp: { increment: amount }, totalLessonsCompleted: { increment: 1 } },
      create: { userId, xp: amount, totalLessonsCompleted: 1 },
    });
  }

  private async _updateStreak(userId: string) {
    const stats = await prisma.userStats.findUnique({ where: { userId } });
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (stats?.lastStudiedAt) {
      const last = new Date(stats.lastStudiedAt);
      const lastDay = last.toDateString();
      const yesterdayStr = yesterday.toDateString();
      const todayStr = now.toDateString();
      if (lastDay === yesterdayStr || lastDay === todayStr) {
        newStreak = lastDay === todayStr ? stats.streak : stats.streak + 1;
      }
    }

    await prisma.userStats.upsert({
      where: { userId },
      update: { streak: newStreak, lastStudiedAt: now },
      create: { userId, streak: newStreak, lastStudiedAt: now },
    });
  }
}

export const coursesService = new CoursesService();
