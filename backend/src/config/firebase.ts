import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { env } from "./env.js";

/**
 * Firebase token verification using Google's public keys.
 * No service account key needed — just the Firebase project ID.
 *
 * This verifies Firebase ID tokens by:
 * 1. Fetching Google's public signing keys (cached automatically by jose)
 * 2. Verifying the JWT signature
 * 3. Checking issuer and audience match the Firebase project
 */

// Google's public key endpoint for Firebase tokens
const GOOGLE_JWKS_URL = new URL(
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
);

// Remote JWKS set — jose caches and rotates keys automatically
const jwks = createRemoteJWKSet(GOOGLE_JWKS_URL);

export interface FirebaseTokenPayload extends JWTPayload {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  firebase?: {
    sign_in_provider: string;
  };
}

/**
 * Verify a Firebase ID token and return the decoded payload.
 * Throws if the token is invalid, expired, or has wrong audience/issuer.
 */
export async function verifyFirebaseToken(
  idToken: string
): Promise<FirebaseTokenPayload> {
  const { payload } = await jwtVerify(idToken, jwks, {
    issuer: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`,
    audience: env.FIREBASE_PROJECT_ID,
  });

  // Firebase puts the user ID in the 'sub' claim
  return {
    ...payload,
    uid: payload.sub!,
    email: payload.email as string | undefined,
    name: payload.name as string | undefined,
    picture: payload.picture as string | undefined,
  } as FirebaseTokenPayload;
}
