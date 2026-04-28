import { FastifyRequest, FastifyReply } from "fastify";
import { verifyFirebaseToken } from "../config/firebase.js";
import { env } from "../config/env.js";
import prisma from "../utils/prisma.js";
import type { User, Role } from "@prisma/client";

// Extend Fastify's request type to include authenticated user
declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}

/**
 * Authentication middleware.
 * Verifies Firebase ID token and upserts users in PostgreSQL.
 *
 * Usage: Add as a preHandler on protected routes.
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Missing or invalid Authorization header. Expected: Bearer <token>",
    });
  }

  const token = authHeader.slice(7); // Remove "Bearer "

  try {
    // 1. Verify the Firebase ID token
    const decoded = await verifyFirebaseToken(token);

    // 2. Find or create the user in our database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      // Determine role based on admin email list
      const email = (decoded.email || "").toLowerCase();
      const role: Role = env.adminEmails.includes(email) ? "ADMIN" : "USER";

      // Extract names from Firebase profile
      const displayName = decoded.name || "";
      const nameParts = displayName.split(" ");

      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email: decoded.email || "",
          firstName: nameParts[0] || null,
          lastName: nameParts.slice(1).join(" ") || null,
          photoURL: decoded.picture || null,
          role,
        },
      });

      request.log.info({ userId: user.id, email: user.email }, "New user created from Firebase auth");
    }

    // 3. Attach user to request
    request.user = user;
  } catch (error: any) {
    request.log.warn({ error: error.message }, "Auth token verification failed");

    if (error.code === "ERR_JWT_EXPIRED") {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Token has expired. Please refresh your token.",
      });
    }

    return reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid authentication token.",
    });
  }
}

/**
 * Optional auth middleware — sets request.user if token is present, but doesn't fail.
 * Useful for routes that behave differently for authenticated vs anonymous users.
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return;

  try {
    const token = authHeader.slice(7);
    const decoded = await verifyFirebaseToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (user) {
      request.user = user;
    }
  } catch {
    // Silently ignore — user just won't be set
  }
}

/**
 * Middleware factory to restrict access based on roles.
 * Must be used AFTER authMiddleware.
 */
export function requireRole(allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(request.user.role)) {
      request.log.warn({ userId: request.user.id, role: request.user.role }, "Access denied: insufficient role");
      return reply.status(403).send({ 
        error: "Forbidden", 
        message: `This action requires one of the following roles: ${allowedRoles.join(", ")}` 
      });
    }
  };
}
