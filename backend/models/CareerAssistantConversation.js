const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mode: {
      type: String,
      enum: ["HR Interviewer"],
      required: true,
    },
    conversationId: { type: String, required: true, index: true },
    currentQuestionIndex: { type: Number, default: 0 },
    context: {
      role: { type: String, default: "" },
      experience: { type: String, default: "" },
      subject: { type: String, default: "" },
    },
    // Stores question/answer history
    messages: [
      {
        index: { type: Number, required: true },
        question: { type: String, default: "" },
        userAnswer: { type: String, default: "" },
        evaluation: { type: Object, default: {} },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CareerAssistantConversation",
  conversationSchema
);

