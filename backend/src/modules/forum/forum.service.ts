import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse, type PaginationQuery } from "../../utils/pagination.js";
import type { CreateForumPostInput, UpdateForumPostInput, CreateCommentInput } from "./forum.schema.js";

const postSelect = {
  id: true,
  title: true,
  content: true,
  code: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
  },
  _count: { select: { comments: true, favorites: true } },
};

export class ForumService {
  async listPosts(query: PaginationQuery) {
    const [data, total] = await Promise.all([
      prisma.forumPost.findMany({
        ...paginate(query),
        orderBy: { createdAt: "desc" },
        select: postSelect,
      }),
      prisma.forumPost.count(),
    ]);

    return paginatedResponse(data, total, query);
  }

  async getPost(id: string) {
    return prisma.forumPost.findUnique({
      where: { id },
      select: {
        ...postSelect,
        comments: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
            },
          },
        },
        favorites: {
          select: { userId: true },
        },
      },
    });
  }

  async createPost(authorId: string, data: CreateForumPostInput) {
    return prisma.forumPost.create({
      data: { ...data, author: { connect: { id: authorId } } } as any,
      select: postSelect,
    });
  }

  async updatePost(id: string, data: UpdateForumPostInput) {
    return prisma.forumPost.update({
      where: { id },
      data,
      select: postSelect,
    });
  }

  async deletePost(id: string) {
    return prisma.forumPost.delete({ where: { id } });
  }

  async getPostAuthorId(id: string): Promise<string | null> {
    const post = await prisma.forumPost.findUnique({
      where: { id },
      select: { authorId: true },
    });
    return post?.authorId ?? null;
  }

  // Comments
  async addComment(postId: string, authorId: string, data: CreateCommentInput) {
    return prisma.forumComment.create({
      data: { ...data, post: { connect: { id: postId } }, author: { connect: { id: authorId } } } as any,
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
        },
      },
    });
  }

  async deleteComment(id: string) {
    return prisma.forumComment.delete({ where: { id } });
  }

  async getCommentAuthorId(id: string): Promise<string | null> {
    const comment = await prisma.forumComment.findUnique({
      where: { id },
      select: { authorId: true },
    });
    return comment?.authorId ?? null;
  }

  // Favorites
  async toggleFavorite(postId: string, userId: string) {
    const existing = await prisma.forumFavorite.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.forumFavorite.delete({ where: { id: existing.id } });
      return { action: "removed" };
    } else {
      await prisma.forumFavorite.create({ data: { userId, postId } });
      return { action: "added" };
    }
  }
}

export const forumService = new ForumService();
