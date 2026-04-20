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
    throw new Error(body.message || `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Types ───────────────────────────────────────────────────────

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
  role: 'ADMIN' | 'USER';
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  code: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; firstName: string | null; lastName: string | null; photoURL: string | null };
  _count: { comments: number };
}

export interface ForumComment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; firstName: string | null; lastName: string | null; photoURL: string | null };
}

export interface Club {
  id: string;
  name: string;
  description: string | null;
  imageURL: string | null;
  createdAt: string;
  ownerId: string;
  _count: { memberships: number; posts: number };
}

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

export interface Lab {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
  _count: { submissions: number };
}

// ─── API Methods ─────────────────────────────────────────────────

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

  // Blog
  getBlogPosts: (page = 1, limit = 20) =>
    request<PaginatedResponse<BlogPost>>(`/blog?page=${page}&limit=${limit}`),
  getBlogPost: (slug: string) => request<BlogPost>(`/blog/${slug}`),

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
};
