import axiosInstance from "../utils/axiosInstance";

export const CAREER_ASSISTANT_API = {
  interviewCoach: (payload) =>
    axiosInstance.post("/api/career-assistant/interview-coach", payload),

  resumeReview: (formData) =>
    axiosInstance.post("/api/career-assistant/resume-review", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  projectReview: (payload) =>
    axiosInstance.post("/api/career-assistant/project-review", payload),

  careerAdvisor: (payload) =>
    axiosInstance.post("/api/career-assistant/career-advisor", payload),

  hrStart: (payload) =>
    axiosInstance.post("/api/career-assistant/hr/start", payload),

  hrAnswer: (payload) =>
    axiosInstance.post("/api/career-assistant/hr/answer", payload),
};

