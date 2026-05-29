const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;

const missing = [];
if (!projectId) missing.push("FIREBASE_PROJECT_ID");
if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
if (!rawPrivateKey) missing.push("FIREBASE_PRIVATE_KEY");

if (missing.length) {
  console.error(
    "Firebase Admin initialization failed. Missing env vars:",
    missing.join(", ")
  );
  console.error("Current env presence:", {
    hasProjectId: !!projectId,
    hasClientEmail: !!clientEmail,
    hasPrivateKeyRaw: !!rawPrivateKey,
    hasPrivateKeyNormalized: !!privateKey,
  });
  throw new Error("Firebase Admin credentials are not fully configured.");
}

if (privateKey && !privateKey.includes("BEGIN PRIVATE KEY")) {
  console.error(
    "FIREBASE_PRIVATE_KEY does not look like a PEM. Verify Render env formatting (newlines)."
  );
}

const adminApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

module.exports = adminApp;

