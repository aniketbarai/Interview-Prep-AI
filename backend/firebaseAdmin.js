const admin = require("firebase-admin");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Firebase Admin initialization failed. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
  );
  throw new Error("Firebase Admin credentials are not fully configured.");
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
