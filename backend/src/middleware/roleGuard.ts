import { FastifyRequest, FastifyReply } from "fastify";
import type { Role } from "@prisma/client";

/**
 * Creates a role-based access guard.
 *
 * Usage:
 *   { preHandler: [authMiddleware, roleGuard("ADMIN")] }
 *   { preHandler: [authMiddleware, roleGuard("ADMIN", "USER")] }
 */
export function roleGuard(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({
        error: "Forbidden",
        message: `This action requires one of the following roles: ${allowedRoles.join(", ")}`,
      });
    }
  };
}
