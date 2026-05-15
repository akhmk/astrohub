import { auth } from '../firebase';

const API_BASE = 'http://localhost:4000/api';

/**
 * AstroHub API Client
 * Automatically attaches Firebase auth token to requests.
 */

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };

  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || body.error || `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Shared Types ──────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiUser {
  id: string;
  firebaseUid: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoURL: string | null;
  role: 'ADMIN' | 'USER' | 'TEACHER';
}

// ─── Forum ─────────────────────────────────────────────────────

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  code: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; firstName: string | null; lastName: string | null; photoURL: string | null };
  _count: { comments: number; favorites: number };
  favorites?: { userId: string }[];
}

export interface ForumComment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; firstName: string | null; lastName: string | null; photoURL: string | null };
}

// ─── Clubs ─────────────────────────────────────────────────────

export interface Club {
  id: string;
  name: string;
  description: string | null;
  imageURL: string | null;
  createdAt: string;
  ownerId: string;
  owner?: { id: string; firstName: string | null; lastName: string | null; photoURL: string | null };
  isApproved: boolean;
  memberships?: { userId: string }[];
  _count: { memberships: number; posts: number };
}

// ─── Blog ──────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string | null;
  coverURL: string | null;
  published: boolean;
  createdAt: string;
  author?: { id: string; firstName: string | null; lastName: string | null };
}

// ─── Roadmaps ──────────────────────────────────────────────────

export interface Roadmap {
  id: string;
  title: string;
  description: string | null;
  steps: { id: string; title: string; description?: string; order: number }[];
  order: number;
}

export interface RoadmapProgress {
  completedSteps: string[];
  updatedAt: string | null;
}

// ─── Labs ──────────────────────────────────────────────────────

export interface Lab {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
  _count: { submissions: number };
}

// ─── Courses & Learning ────────────────────────────────────────

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type LessonType = 'TEXT' | 'VIDEO' | 'INTERACTIVE';

export interface LessonSummary {
  id: string;
  title: string;
  duration: number | null;
  lessonType: LessonType;
  order: number;
  moduleId: string | null;
  summary: string | null;
}

export interface Lesson extends LessonSummary {
  content: string | null;
  videoURL: string | null;
  courseId: string;
  isCompleted?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  order: number;
  courseId: string;
  lessons: LessonSummary[];
}

export interface CourseSummary {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageURL: string | null;
  category: string | null;
  level: Difficulty;
  estimatedHours: number | null;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  author?: { id: string; firstName: string | null; lastName: string | null; photoURL: string | null };
  _count: { enrollments: number; lessons: number; modules: number };
  isBookmarked?: boolean;
  isEnrolled?: boolean;
  completedLessonsCount?: number;
}

export interface Course extends CourseSummary {
  outcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
  lessons: LessonSummary[]; // lessons without a module
  completedLessons: string[];
  isBookmarked: boolean;
}

// ─── Quiz ──────────────────────────────────────────────────────

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizOptionFull extends QuizOption {
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  explanation: string | null;
  order: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  courseId: string;
  passingScore: number;
  questions: QuizQuestion[];
  myAttempts: QuizAttemptSummary[];
  bestAttempt: QuizAttemptSummary | null;
}

export interface QuizAttemptSummary {
  id: string;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: string;
}

export interface QuizAttemptAnswer {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  isCorrect: boolean;
  explanation: string | null;
}

export interface QuizAttemptResult extends QuizAttemptSummary {
  percentage: number;
  answers: QuizAttemptAnswer[];
}

// ─── Notes ─────────────────────────────────────────────────────

export interface CourseNote {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  lesson?: { id: string; title: string } | null;
}

// ─── Stats ─────────────────────────────────────────────────────

export interface UserStats {
  xp: number;
  streak: number;
  lastStudiedAt: string | null;
  totalLessonsCompleted: number;
  totalQuizzesPassed: number;
  enrolledCourses: number;
}

export interface EnrolledCourse extends CourseSummary {
  enrolledAt: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
  progress: number;
}

// ─── API Methods ───────────────────────────────────────────────

export const api = {
  // Users
  getMe: () => request<ApiUser>('/users/me'),
  updateMe: (data: Partial<Pick<ApiUser, 'firstName' | 'lastName' | 'username'>>) =>
    request<ApiUser>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

  // Forum
  getForumPosts: (page = 1, limit = 20) =>
    request<PaginatedResponse<ForumPost>>(`/forum/posts?page=${page}&limit=${limit}`),
  getForumPost: (id: string) =>
    request<ForumPost & { comments: ForumComment[] }>(`/forum/posts/${id}`),
  createForumPost: (data: { title: string; content: string; code?: string }) =>
    request<ForumPost>('/forum/posts', { method: 'POST', body: JSON.stringify(data) }),
  deleteForumPost: (id: string) =>
    request<void>(`/forum/posts/${id}`, { method: 'DELETE' }),
  toggleFavorite: (postId: string) =>
    request<{ action: 'added' | 'removed' }>(`/forum/posts/${postId}/favorite`, { method: 'POST' }),
  addComment: (postId: string, content: string) =>
    request<ForumComment>(`/forum/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  deleteComment: (id: string) =>
    request<void>(`/forum/comments/${id}`, { method: 'DELETE' }),

  // Clubs
  getClubs: (page = 1, limit = 20) =>
    request<PaginatedResponse<Club>>(`/clubs?page=${page}&limit=${limit}`),
  getClub: (id: string) => request<Club>(`/clubs/${id}`),
  createClub: (data: { name: string; description?: string; imageURL?: string }) =>
    request<Club>('/clubs', { method: 'POST', body: JSON.stringify(data) }),
  joinClub: (id: string) => request<void>(`/clubs/${id}/join`, { method: 'POST' }),
  leaveClub: (id: string) => request<void>(`/clubs/${id}/leave`, { method: 'POST' }),
  approveClub: (id: string) => request<Club>(`/clubs/${id}/approve`, { method: 'PATCH' }),

  // Blog
  getBlogPosts: (page = 1, limit = 20) =>
    request<PaginatedResponse<BlogPost>>(`/blog?page=${page}&limit=${limit}`),
  getBlogPost: (slug: string) => request<BlogPost>(`/blog/${slug}`),
  createBlogPost: (data: { title: string; slug: string; content: string; excerpt?: string; published?: boolean }) =>
    request<BlogPost>('/blog', { method: 'POST', body: JSON.stringify(data) }),
  deleteBlogPost: (id: string) => request<void>(`/blog/${id}`, { method: 'DELETE' }),

  // Roadmaps
  getRoadmaps: (page = 1, limit = 20) =>
    request<PaginatedResponse<Roadmap>>(`/roadmaps?page=${page}&limit=${limit}`),
  getRoadmap: (id: string) => request<Roadmap>(`/roadmaps/${id}`),
  getProgress: (id: string) => request<RoadmapProgress>(`/roadmaps/${id}/progress`),
  updateProgress: (id: string, completedSteps: string[]) =>
    request<RoadmapProgress>(`/roadmaps/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ completedSteps }) }),

  // Labs
  getLabs: (page = 1, limit = 20) =>
    request<PaginatedResponse<Lab>>(`/labs?page=${page}&limit=${limit}`),
  getLab: (id: string) => request<Lab>(`/labs/${id}`),
  submitLab: (id: string, content: string) =>
    request<any>(`/labs/${id}/submissions`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Courses — listing & detail
  getCourses: (params: { page?: number; limit?: number; search?: string; category?: string; level?: Difficulty } = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    if (params.search) q.set('search', params.search);
    if (params.category) q.set('category', params.category);
    if (params.level) q.set('level', params.level);
    return request<PaginatedResponse<CourseSummary>>(`/courses?${q.toString()}`);
  },
  getCourse: (id: string) => request<Course>(`/courses/${id}`),

  // Courses — admin/teacher
  createCourse: (data: {
    title: string; subtitle?: string; description?: string; imageURL?: string;
    category?: string; level?: Difficulty; estimatedHours?: number;
    tags?: string[]; outcomes?: string[]; prerequisites?: string[];
  }) => request<CourseSummary>('/courses', { method: 'POST', body: JSON.stringify(data) }),
  createModule: (courseId: string, data: { title: string; description?: string; order?: number }) =>
    request<any>(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) }),
  createLesson: (courseId: string, data: {
    title: string; content?: string; videoURL?: string; duration?: number;
    summary?: string; lessonType?: LessonType; order?: number; moduleId?: string;
  }) => request<Lesson>(`/courses/${courseId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
  createQuiz: (courseId: string, data: any) =>
    request<Quiz>(`/courses/${courseId}/quiz`, { method: 'POST', body: JSON.stringify(data) }),

  // Courses — enrollment & progress
  enrollCourse: (id: string) => request<{ message: string }>(`/courses/${id}/enroll`, { method: 'POST' }),
  finishLesson: (lessonId: string) => request<void>(`/courses/lessons/${lessonId}/complete`, { method: 'POST' }),
  getLesson: (lessonId: string) => request<Lesson>(`/courses/lessons/${lessonId}`),

  // Courses — bookmarks
  toggleBookmark: (courseId: string) =>
    request<{ action: 'added' | 'removed' }>(`/courses/${courseId}/bookmark`, { method: 'POST' }),
  getBookmarks: () => request<CourseSummary[]>('/courses/my/bookmarks'),

  // Courses — notes
  createNote: (courseId: string, data: { content: string; lessonId?: string }) =>
    request<CourseNote>(`/courses/${courseId}/notes`, { method: 'POST', body: JSON.stringify(data) }),
  getCourseNotes: (courseId: string) =>
    request<CourseNote[]>(`/courses/${courseId}/notes`),
  updateNote: (noteId: string, content: string) =>
    request<CourseNote>(`/courses/notes/${noteId}`, { method: 'PATCH', body: JSON.stringify({ content }) }),
  deleteNote: (noteId: string) =>
    request<void>(`/courses/notes/${noteId}`, { method: 'DELETE' }),

  // Courses — quiz
  getCourseQuiz: (courseId: string) => request<Quiz>(`/courses/${courseId}/quiz`),
  submitQuiz: (quizId: string, answers: { questionId: string; selectedOptionId: string }[]) =>
    request<QuizAttemptResult>(`/courses/quiz/${quizId}/attempt`, { method: 'POST', body: JSON.stringify({ answers }) }),

  // User stats & enrolled courses
  getUserStats: () => request<UserStats>('/courses/my/stats'),
  getEnrolledCourses: () => request<EnrolledCourse[]>('/courses/my/enrolled'),
};
