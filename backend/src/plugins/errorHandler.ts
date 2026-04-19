import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { Sentry } from "../config/sentry.js";
import { env } from "../config/env.js";

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    // Log the error
    request.log.error({ err: error, url: request.url, method: request.method }, "Request error");

    // Report to Sentry in production
    if (env.isProd && env.SENTRY_DSN) {
      Sentry.captureException(error);
    }

    // Prisma known errors
    if (error.code === "P2025") {
      return reply.status(404).send({
        error: "Not Found",
        message: "The requested resource was not found.",
      });
    }

    // Validation errors
    if (error.validation) {
      return reply.status(400).send({
        error: "Validation Error",
        message: error.message,
      });
    }

    // Rate limit errors
    if (error.statusCode === 429) {
      return reply.status(429).send({
        error: "Too Many Requests",
        message: "You are being rate limited. Please try again later.",
      });
    }

    // Default error response
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 && env.isProd
      ? "An unexpected error occurred."
      : error.message;

    return reply.status(statusCode).send({
      error: statusCode >= 500 ? "Internal Server Error" : "Error",
      message,
    });
  });
}
