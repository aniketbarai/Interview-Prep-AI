const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mode: {
      type: String,
      enum: [
        "Interview Coach",
        "Resume Reviewer",
        "Project Reviewer",
        "Career Advisor",
      ],
      required: true,
    },
    context: {
      role: { type: String, default: "" },
      experience: { type: String, default: "" },
      subject: { type: String, default: "" },
    },
    inputs: { type: Object, default: {} },
    output: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerAssistantReport", reportSchema);

