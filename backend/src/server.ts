import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "./config/env.js";
import { initSentry } from "./config/sentry.js";
import { errorHandler } from "./plugins/errorHandler.js";

// Module routes
import { usersRoutes } from "./modules/users/users.routes.js";
import { forumRoutes } from "./modules/forum/forum.routes.js";
import { clubsRoutes } from "./modules/clubs/clubs.routes.js";
import { blogRoutes } from "./modules/blog/blog.routes.js";
import { roadmapsRoutes } from "./modules/roadmaps/roadmaps.routes.js";
import { labsRoutes } from "./modules/labs/labs.routes.js";

// ============================================
// Initialize
// ============================================

// Sentry (optional)
initSentry();

// Create Fastify instance with Pino logger
const app = Fastify({
  logger: {
    level: env.isDev ? "info" : "warn",
    transport: env.isDev
      ? {
          target: "pino-pretty",
          options: { colorize: true },
        }
      : undefined,
  },
});

// ============================================
// Plugins
// ============================================

// CORS — env-based origins for future domain readiness
await app.register(cors, {
  origin: env.corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
});

// Security headers
await app.register(helmet, {
  contentSecurityPolicy: false, // API-only, no HTML
});

// Rate limiting
await app.register(rateLimit, {
  max: env.RATE_LIMIT_MAX,
  timeWindow: env.RATE_LIMIT_WINDOW_MS,
});

// Global error handler
await app.register(errorHandler);

// ============================================
// Health check
// ============================================

app.get("/health", async () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  environment: env.NODE_ENV,
}));

// ============================================
// API Routes
// ============================================

app.register(usersRoutes, { prefix: "/api/users" });
app.register(forumRoutes, { prefix: "/api/forum" });
app.register(clubsRoutes, { prefix: "/api/clubs" });
app.register(blogRoutes, { prefix: "/api/blog" });
app.register(roadmapsRoutes, { prefix: "/api/roadmaps" });
app.register(labsRoutes, { prefix: "/api/labs" });

// ============================================
// Start server
// ============================================

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0", // Required for Docker/Railway/Render
    });

    console.log(`
╔══════════════════════════════════════════╗
║         🚀 AstroHub API Server          ║
╠══════════════════════════════════════════╣
║  Status:      Running                   ║
║  Port:        ${String(env.PORT).padEnd(27)}║
║  Environment: ${env.NODE_ENV.padEnd(27)}║
║  URL:         ${env.API_URL.padEnd(27)}║
╚══════════════════════════════════════════╝
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
const signals = ["SIGINT", "SIGTERM"] as const;
for (const signal of signals) {
  process.on(signal, async () => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    await app.close();
    process.exit(0);
  });
}
