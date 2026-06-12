const admin = require("firebase-admin");

// NOTE:
// This file is required by authController.
// In production it must be configured via these env vars:
//   - FIREBASE_PROJECT_ID
//   - FIREBASE_CLIENT_EMAIL
//   - FIREBASE_PRIVATE_KEY
//
// For dev/CI where Firebase might be missing, we do NOT want the whole backend
// to crash. Instead we export a lazy/nullable admin app.

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

const privateKey = rawPrivateKey
  ? rawPrivateKey.replace(/\\n/g, "\n")
  : undefined;

const missing = [];
if (!projectId) missing.push("FIREBASE_PROJECT_ID");
if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
if (!rawPrivateKey) missing.push("FIREBASE_PRIVATE_KEY");

const isConfigured = missing.length === 0;

let adminApp = null;

if (isConfigured) {
  if (privateKey && !privateKey.includes("BEGIN PRIVATE KEY")) {
    console.error(
      "FIREBASE_PRIVATE_KEY does not look like a PEM. Verify Render env formatting (newlines)."
    );
  }

  adminApp = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
} else {
  // Keep backend running even if Firebase isn't configured.
  // Any endpoint that depends on Firebase should handle the missing config.
  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "Firebase Admin not initialized (missing env vars):",
      missing.join(", ")
    );
  }
}

// Export both: the initialized admin app (if any), and a helper to enforce config.
const requireFirebaseAdmin = () => {
  if (!isConfigured || !adminApp) {
    const err = new Error(
      "Firebase Admin credentials are not fully configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
    );
    err.code = "FIREBASE_NOT_CONFIGURED";
    throw err;
  }
  return adminApp;
};

module.exports = {
  adminApp,
  requireFirebaseAdmin,
};

