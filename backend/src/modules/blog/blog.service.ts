import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse, type PaginationQuery } from "../../utils/pagination.js";
import type { CreateBlogPostInput, UpdateBlogPostInput } from "./blog.schema.js";

const blogSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  coverURL: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
  },
};

export class BlogService {
  async listPublished(query: PaginationQuery) {
    const where = { published: true };
    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        ...paginate(query),
        orderBy: { createdAt: "desc" },
        select: { ...blogSelect, content: false },
      }),
      prisma.blogPost.count({ where }),
    ]);
    return paginatedResponse(data, total, query);
  }

  async getBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
      select: blogSelect,
    });
  }

  async create(authorId: string, data: CreateBlogPostInput) {
    return prisma.blogPost.create({
      data: { ...data, authorId },
      select: blogSelect,
    });
  }

  async update(id: string, data: UpdateBlogPostInput) {
    return prisma.blogPost.update({
      where: { id },
      data,
      select: blogSelect,
    });
  }

  async delete(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const post = await prisma.blogPost.findUnique({ where: { id }, select: { id: true } });
    return !!post;
  }
}

export const blogService = new BlogService();
