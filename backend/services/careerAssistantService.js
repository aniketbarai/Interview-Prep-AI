const OpenAI = require("openai");
const path = require("path");

const {
  interviewCoachPrompt,
  resumeReviewerPrompt,
  projectReviewerPrompt,
  careerAdvisorPrompt,
  hrStartPrompt,
  hrAnswerPrompt,
} = require("../utils/careerAssistantPrompts");

// Resume parsing deps are loaded lazily in resume reviewer

let client = null;
const OPENROUTER_MODEL = "openrouter/free";

const getClient = () => {
  if (client) return client;

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Set it to enable Career Assistant Hub AI features."
    );
  }

  client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "AI Interview Prep",
    },
  });

  return client;
};

const safeJsonParse = (rawText) => {
  const cleanedText = (rawText || "")
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleanedText);
};

const generateJsonCompletion = async ({ systemContent, userContent }) => {
  const activeClient = getClient();

  const completion = await activeClient.chat.completions.create({
    model: OPENROUTER_MODEL,
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userContent },
    ],
  });

  const rawText = completion?.choices?.[0]?.message?.content;
  if (!rawText) throw new Error("No response from AI");

  return safeJsonParse(rawText);
};

const parseResumeToText = async (fileBuffer, filename) => {
  const ext = path.extname(filename || "").toLowerCase();

  if (ext === ".pdf") {
  const pdfParse = require("pdf-parse");

  const data = await pdfParse(fileBuffer);

  return data.text || "";
}

  if (ext === ".docx" || ext === ".doc") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result?.value || "";
  }

  throw new Error("Unsupported resume file type. Use PDF or DOCX.");
};

const generateInterviewCoach = async ({ role, experience, subject, question }) => {
  const systemContent = "You are an elite Interview Coach. Return ONLY valid JSON.";
  const prompt =
    interviewCoachPrompt({ role, experience, subject }) +
    `\n\nUSER QUESTION:\n${question}`;

  return generateJsonCompletion({ systemContent, userContent: prompt });
};

const generateResumeReview = async ({ role, experience, subject, resumeText }) => {
  const systemContent = "You are an expert Resume Reviewer. Return ONLY valid JSON.";
  const prompt =
    resumeReviewerPrompt({ role, experience, subject }) +
    `\n\nRESUME TEXT:\n${resumeText}`;

  return generateJsonCompletion({ systemContent, userContent: prompt });
};

const generateProjectReview = async ({
  role,
  experience,
  subject,
  title,
  description,
  stack,
  githubUrl,
}) => {
  const systemContent = "You are an expert technical reviewer. Return ONLY valid JSON.";
  const prompt = projectReviewerPrompt({
    role,
    experience,
    subject,
    title,
    description,
    stack,
    githubUrl,
  });

  return generateJsonCompletion({ systemContent, userContent: prompt });
};

const generateCareerAdvisor = async ({ role, experience, skills }) => {
  const systemContent = "You are a professional career mentor. Return ONLY valid JSON.";
  const prompt = careerAdvisorPrompt({ role, experience, skills });

  return generateJsonCompletion({ systemContent, userContent: prompt });
};

const generateHrStart = async ({ role, experience, subject }) => {
  const systemContent = "You are an expert HR interviewer. Return ONLY valid JSON.";
  const conversationId = `hr_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const prompt =
    hrStartPrompt({ role, experience, subject }) +
    `\n\nCONVERSATION_ID: ${conversationId}`;

  const data = await generateJsonCompletion({ systemContent, userContent: prompt });
  return { ...data, conversationId };
};

const generateHrAnswerEvaluation = async ({
  role,
  experience,
  subject,
  previousQuestionIndex,
  userAnswer,
}) => {
  const systemContent =
    "You are an expert HR interviewer and evaluator. Return ONLY valid JSON.";
  const prompt = hrAnswerPrompt({
    role,
    experience,
    subject,
    previousQuestionIndex,
    userAnswer,
  });

  return generateJsonCompletion({ systemContent, userContent: prompt });
};

module.exports = {
  parseResumeToText,
  generateInterviewCoach,
  generateResumeReview,
  generateProjectReview,
  generateCareerAdvisor,
  generateHrStart,
  generateHrAnswerEvaluation,
};

