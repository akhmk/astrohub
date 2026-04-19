import admin from "firebase-admin";
import { env } from "./env.js";

let firebaseApp: admin.app.App;

try {
  const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY);

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:");
  console.error(error);
  process.exit(1);
}

export const firebaseAuth = firebaseApp.auth();
export default firebaseApp;
