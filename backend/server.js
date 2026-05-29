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
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
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

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

connectDB();

// Middleware
app.use(express.json())

// Routes
app.use("/api/auth", authRoute);
app.use("/api/sessions",sessionRoutes);
app.use("/api/questions",questionRoutes);

app.use("/api/ai/generate-questions",protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation",protect, generateConceptExplanation);

// Serve uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}))

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))