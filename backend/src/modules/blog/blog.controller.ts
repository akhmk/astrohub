import { FastifyRequest, FastifyReply } from "fastify";
import { blogService } from "./blog.service.js";
import { createBlogPostSchema, updateBlogPostSchema } from "./blog.schema.js";
import { paginationSchema } from "../../utils/pagination.js";

export class BlogController {
  async listPosts(request: FastifyRequest, reply: FastifyReply) {
    const query = paginationSchema.parse(request.query);
    const result = await blogService.listPublished(query);
    return reply.send(result);
  }

  async getPost(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const post = await blogService.getBySlug(request.params.slug);
    if (!post) {
      return reply.status(404).send({ error: "Blog post not found" });
    }
    // Only show unpublished to admins
    if (!post.published && request.user?.role !== "ADMIN") {
      return reply.status(404).send({ error: "Blog post not found" });
    }
    return reply.send(post);
  }

  async createPost(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createBlogPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    try {
      const post = await blogService.create(request.user!.id, parsed.data);
      return reply.status(201).send(post);
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.status(409).send({ error: "A blog post with this slug already exists" });
      }
      throw error;
    }
  }

  async updatePost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateBlogPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    if (!(await blogService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Blog post not found" });
    }

    try {
      const post = await blogService.update(request.params.id, parsed.data);
      return reply.send(post);
    } catch (error: any) {
      if (error.code === "P2002") {
        return reply.status(409).send({ error: "A blog post with this slug already exists" });
      }
      throw error;
    }
  }

  async deletePost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    if (!(await blogService.exists(request.params.id))) {
      return reply.status(404).send({ error: "Blog post not found" });
    }
    await blogService.delete(request.params.id);
    return reply.status(204).send();
  }
}

export const blogController = new BlogController();
