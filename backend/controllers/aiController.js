const OpenAI = require("openai");

const {
  questionAnswerPrompt,conceptExplainPrompt
} = require("../utils/prompt");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,

  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Interview Prep"
  }
});

const generateInterviewQuestions = async (req, res) => {

  try {

    const {
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    } = req.body;

    // Validate input
    if (
      !role ||
      !experience ||
      !topicsToFocus ||
      !numberOfQuestions
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Generate prompt
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    // AI Request
    const completion = await client.chat.completions.create({
      model: "openrouter/free",

      messages: [
        {
          role: "system",
          content:
            "You are an interview preparation AI. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    // Extract AI response
    const rawText =
      completion?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({
        message: "No response from AI"
      });
    }

    // Clean response
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let data;

    // Parse JSON safely
    try {

      data = JSON.parse(cleanedText);

    } catch (parseError) {

      console.error("JSON PARSE ERROR:", parseError);
      console.log("RAW AI RESPONSE:", rawText);

      return res.status(500).json({
        message: "Invalid JSON response from AI",
        rawText
      });
    }

    // Success response
    res.status(200).json(data);

  } catch (error) {

    console.error(
      "AI ERROR:",
      error?.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to generate questions.",
      error: error.message
    });
  }
};

const generateConceptExplanation = async (req, res) => {
try {

    const { question } = req.body;

    // Validate input
    if (!question) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    // Generate prompt
    const prompt = conceptExplainPrompt(question);

    // AI Request
    const completion = await client.chat.completions.create({
      model: "openrouter/free",

      messages: [
        {
          role: "system",
          content:
            "You are an expert programming teacher. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    // Extract response
    const rawText =
      completion?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({
        message: "No response from AI"
      });
    }

    // Clean markdown wrappers if present
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    let data;

    // Parse JSON safely
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {

      console.error("JSON PARSE ERROR:", parseError);
      console.log("RAW AI RESPONSE:", rawText);

      return res.status(500).json({
        message: "Invalid JSON response from AI",
        rawText
      });
    }
    // Send response
    res.status(200).json(data);
}
catch (error) {

    console.error(
      "AI ERROR:",
      error?.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to generate questions.",
      error: error.message
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation
};