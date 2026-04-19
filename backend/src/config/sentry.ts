import * as Sentry from "@sentry/node";
import { env } from "./env.js";

export function initSentry() {
  if (!env.SENTRY_DSN) {
    console.log("ℹ️  Sentry DSN not provided — error tracking disabled");
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.isProd ? 0.2 : 1.0,
  });

  console.log("✅ Sentry initialized");
}

export { Sentry };
