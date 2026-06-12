const CareerAssistantConversation = require("../models/CareerAssistantConversation");
const CareerAssistantReport = require("../models/CareerAssistantReport");

const {
  parseResumeToText,
  generateInterviewCoach,
  generateResumeReview,
  generateProjectReview,
  generateCareerAdvisor,
  generateHrStart,
  generateHrAnswerEvaluation,
} = require("../services/careerAssistantService");

const interviewCoach = async (req, res) => {
  try {
    const { role, experience, subject, question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "question is required",
      });
    }

    const data = await generateInterviewCoach({
      role,
      experience,
      subject,
      question,
    });

    const report = await CareerAssistantReport.create({
      user: req.user._id,
      mode: "Interview Coach",
      context: { role: role || "", experience: experience || "", subject: subject || "" },
      inputs: { question },
      output: data,
    });

    return res.status(200).json({ success: true, report, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate interview coach output",
      error: error.message,
    });
  }
};

const resumeReviewer = async (req, res) => {
  try {
    const { role, experience, subject } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "resume file is required (PDF or DOCX)",
        details: {
          hasFile: !!req.file,
          hasBuffer: !!req.file?.buffer,
          fileMimetype: req.file?.mimetype,
          fileOriginalname: req.file?.originalname,
        },
      });
    }


    const resumeText = await parseResumeToText(req.file.buffer, req.file.originalname);

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the resume",
      });
    }

    const data = await generateResumeReview({
      role,
      experience,
      subject,
      resumeText,
    });

    const report = await CareerAssistantReport.create({
      user: req.user._id,
      mode: "Resume Reviewer",
      context: { role: role || "", experience: experience || "", subject: subject || "" },
      inputs: { filename: req.file.originalname },
      output: data,
    });

    return res.status(200).json({ success: true, report, data });
  } catch (error) {
  console.error("========== ERROR ==========");
  console.error(error);
  console.error(error.stack);

  return res.status(500).json({
    success: false,
    message: "Failed to review resume",
    error: error.message,
    stack: error.stack,
  });
}
};

const projectReviewer = async (req, res) => {
  try {
    const { role, experience, subject, title, description, stack, githubUrl } = req.body;

    if (!title || !description || !stack) {
      return res.status(400).json({
        success: false,
        message: "title, description, and stack are required",
      });
    }

    const data = await generateProjectReview({
      role,
      experience,
      subject,
      title,
      description,
      stack,
      githubUrl,
    });

    const report = await CareerAssistantReport.create({
      user: req.user._id,
      mode: "Project Reviewer",
      context: { role: role || "", experience: experience || "", subject: subject || "" },
      inputs: { title, description, stack, githubUrl: githubUrl || "" },
      output: data,
    });

    return res.status(200).json({ success: true, report, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to review project",
      error: error.message,
    });
  }
};

const careerAdvisor = async (req, res) => {
  try {
    const { role, experience, skills } = req.body;

    if (!role || !experience || !skills) {
      return res.status(400).json({
        success: false,
        message: "role, experience, and skills are required",
      });
    }

    const data = await generateCareerAdvisor({ role, experience, skills });

    const report = await CareerAssistantReport.create({
      user: req.user._id,
      mode: "Career Advisor",
      context: { role: role || "", experience: experience || "", subject: "" },
      inputs: { skills },
      output: data,
    });

    return res.status(200).json({ success: true, report, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate career roadmap",
      error: error.message,
    });
  }
};

const hrStart = async (req, res) => {
  try {
    const { role, experience, subject } = req.body;

    const data = await generateHrStart({ role, experience, subject });

    const conversation = await CareerAssistantConversation.create({
      user: req.user._id,
      mode: "HR Interviewer",
      conversationId: data.conversationId,
      currentQuestionIndex: data.currentQuestionIndex,
      context: { role: role || "", experience: experience || "", subject: subject || "" },
      messages: [
        {
          index: data.currentQuestionIndex,
          question: data.question,
          userAnswer: "",
          evaluation: {},
        },
      ],
    });

    return res.status(200).json({ success: true, conversationId: conversation.conversationId, data });
  } catch (error) {
    // Include more details for debugging in production (safe fields only)
    return res.status(500).json({
      success: false,
      message: "Failed to start HR interview",
      error: error?.message,
      details: {
        // helpful for env/config failures
        hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
        openRouterModel: process.env.OPENROUTER_MODEL || "openrouter/free",
      },
    });
  }
};


const hrAnswer = async (req, res) => {
  try {
    const { conversationId, userAnswer } = req.body;

    if (!conversationId || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: "conversationId and userAnswer are required",
      });
    }

    const conversation = await CareerAssistantConversation.findOne({
      user: req.user._id,
      conversationId,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const previousQuestionIndex = conversation.currentQuestionIndex;

    const evaluationAndNext = await generateHrAnswerEvaluation({
      role: conversation.context.role,
      experience: conversation.context.experience,
      subject: conversation.context.subject,
      previousQuestionIndex,
      userAnswer,
    });

    // Update messages for previous index
    conversation.messages = conversation.messages.map((m) => {
      if (m.index === previousQuestionIndex) {
        return {
          ...m,
          userAnswer,
          evaluation: evaluationAndNext.evaluation,
        };
      }
      return m;
    });

    // Push next question message
    conversation.currentQuestionIndex = evaluationAndNext.currentQuestionIndex;
    conversation.messages.push({
      index: evaluationAndNext.currentQuestionIndex,
      question: evaluationAndNext.nextQuestion.question,
      userAnswer: "",
      evaluation: {},
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      conversationId,
      data: {
        evaluation: evaluationAndNext.evaluation,
        nextQuestion: evaluationAndNext.nextQuestion,
        currentQuestionIndex: conversation.currentQuestionIndex,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate HR answer",
      error: error.message,
    });
  }
};

module.exports = {
  interviewCoach,
  resumeReviewer,
  projectReviewer,
  careerAdvisor,
  hrStart,
  hrAnswer,
};

