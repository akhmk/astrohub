import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_URL: z.string().default("http://localhost:4000"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:5173"),

  // Firebase — only the project ID is needed for token verification
  FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID is required"),

  // Admin
  ADMIN_EMAILS: z.string().default(""),

  // Sentry
  SENTRY_DSN: z.string().optional().default(""),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return {
    ...parsed.data,
    isDev: parsed.data.NODE_ENV === "development",
    isProd: parsed.data.NODE_ENV === "production",
    corsOrigins: parsed.data.CORS_ORIGIN.split(",").map((s) => s.trim()),
    adminEmails: parsed.data.ADMIN_EMAILS
      ? parsed.data.ADMIN_EMAILS.split(",").map((s) => s.trim().toLowerCase())
      : [],
  };
}

export const env = loadEnv();
export type Env = ReturnType<typeof loadEnv>;
