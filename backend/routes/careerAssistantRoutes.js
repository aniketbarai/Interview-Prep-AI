const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadResumeMiddleware");


const {
  interviewCoach,
  resumeReviewer,
  projectReviewer,
  careerAdvisor,
  hrStart,
  hrAnswer,
} = require("../controllers/careerAssistantController");

const router = express.Router();

router.post("/interview-coach", protect, interviewCoach);

router.post(
  "/resume-review",
  protect,
  upload.single("resume"),
  resumeReviewer
);

router.post("/project-review", protect, projectReviewer);
router.post("/career-advisor", protect, careerAdvisor);

router.post("/hr/start", protect, hrStart);
router.post("/hr/answer", protect, hrAnswer);

module.exports = router;

