// backend code here 
// npm i express bcryptjs cors dotenv jsonwebtoken mongoose 
// multer @google/genai
require("dotenv").config();
const express = require("express")
const cors = require("cors")
const path = require("path");
const connectDB = require("./config/db")
const authRoute = require("./routes/authRoutes")
const sessionRoutes = require("./routes/sessionRoutes")
const questionRoutes = require("./routes/questionRoutes");
const careerAssistantRoutes = require("./routes/careerAssistantRoutes");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");
const { transporter } = require("./services/emailServices");


const app = express();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "OPENROUTER_API_KEY",
];


const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length) {
  console.error("Missing required environment variables:", missingEnv.join(", "));
  process.exit(1);
}

const allowedOrigins = [
  process.env.FRONTEND_URL || "https://interview-prep-ai-rho.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

// Middleware to handle CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin denied: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

// Correlation id + request logging (must be before routes)
app.use((req, res, next) => {
  const correlationId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  req.correlationId = correlationId;
  res.setHeader("X-Correlation-Id", correlationId);
  console.log(`[${correlationId}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware
app.use(express.json({ limit: "2mb" }));

// Routes
app.get('/api/auth/health', (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    env: {
      hasMongoUri: !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasFirebaseClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasFirebasePrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    },
  });
});

app.use("/api/auth", authRoute);
app.use("/api/sessions",sessionRoutes);
app.use("/api/questions",questionRoutes);
app.use("/api/career-assistant", careerAssistantRoutes);


app.use("/api/ai/generate-questions",protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation",protect, generateConceptExplanation);

// Serve uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}))

// Global error handler (production safe)
app.use((err, req, res, next) => {
  const correlationId = req.correlationId || "n/a";
  console.error(`[${correlationId}] Unhandled error:`, err?.message || err, "stack:", err?.stack);

  const status = Number.isInteger(err?.status) ? err.status : 500;

  res.status(status).json({
    message: status === 500 ? "Internal Server Error" : err.message || "Request failed",
  });
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email verification failed:", error.message);
  } else {
    console.log("Email server ready");
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
