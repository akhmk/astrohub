import { FastifyRequest, FastifyReply } from "fastify";
import { forumService } from "./forum.service.js";
import { createForumPostSchema, updateForumPostSchema, createCommentSchema } from "./forum.schema.js";
import { paginationSchema } from "../../utils/pagination.js";

export class ForumController {
  async listPosts(request: FastifyRequest, reply: FastifyReply) {
    const query = paginationSchema.parse(request.query);
    const result = await forumService.listPosts(query);
    return reply.send(result);
  }

  async getPost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const post = await forumService.getPost(request.params.id);
    if (!post) {
      return reply.status(404).send({ error: "Post not found" });
    }
    return reply.send(post);
  }

  async createPost(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createForumPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    const post = await forumService.createPost(request.user!.id, parsed.data);
    return reply.status(201).send(post);
  }

  async updatePost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateForumPostSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    // Check ownership
    const authorId = await forumService.getPostAuthorId(request.params.id);
    if (!authorId) {
      return reply.status(404).send({ error: "Post not found" });
    }
    if (authorId !== request.user!.id && request.user!.role !== "ADMIN") {
      return reply.status(403).send({ error: "You can only edit your own posts" });
    }

    const post = await forumService.updatePost(request.params.id, parsed.data);
    return reply.send(post);
  }

  async deletePost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const authorId = await forumService.getPostAuthorId(request.params.id);
    if (!authorId) {
      return reply.status(404).send({ error: "Post not found" });
    }
    if (authorId !== request.user!.id && request.user!.role !== "ADMIN") {
      return reply.status(403).send({ error: "You can only delete your own posts" });
    }

    await forumService.deletePost(request.params.id);
    return reply.status(204).send();
  }

  async addComment(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = createCommentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
    }

    // Check post exists
    const post = await forumService.getPost(request.params.id);
    if (!post) {
      return reply.status(404).send({ error: "Post not found" });
    }

    const comment = await forumService.addComment(request.params.id, request.user!.id, parsed.data);
    return reply.status(201).send(comment);
  }

  async deleteComment(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const authorId = await forumService.getCommentAuthorId(request.params.id);
    if (!authorId) {
      return reply.status(404).send({ error: "Comment not found" });
    }
    if (authorId !== request.user!.id && request.user!.role !== "ADMIN") {
      return reply.status(403).send({ error: "You can only delete your own comments" });
    }

    await forumService.deleteComment(request.params.id);
    return reply.status(204).send();
  }
}

export const forumController = new ForumController();
