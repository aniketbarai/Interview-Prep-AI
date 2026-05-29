import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";

import Input from "../../components/Input/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 10,
      });

      const generatedQuestions = Array.isArray(aiResponse.data) ? aiResponse.data : [];

      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
        numberOfQuestions: 10,
      });

      if (response.data?.session?._id) {
        onClose?.();
        navigate(`/interview-prep/${response.data.session._id}`);
      }
    } catch (createError) {
      setError(
        createError?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed to a clean structural wrapper so it blends into your Portal Modal beautifully
    <div className="w-full">
      {/* Header Info Banner Section */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] text-orange-600 shadow-sm">
          <LuSparkles className="text-xl" />
        </div>

        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            Start a new interview session
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Generate tailored questions and answers based on your target role, experience, and focus areas.
          </p>
        </div>
      </div>

      {/* Main Dynamic Workspace Form */}
      <form onSubmit={handleCreateSession} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            value={formData.role}
            onChange={({ target }) => handleChange("role", target.value)}
            label="Target role"
            placeholder="Frontend Developer"
            type="text"
          />

          <Input
            value={formData.experience}
            onChange={({ target }) => handleChange("experience", target.value)}
            label="Years of experience"
            placeholder="2"
            type="number"
            min="0"
          />
        </div>

        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label="Topics to focus on"
          placeholder="React, Node.js, MongoDB"
          type="text"
        />

        <div>
          <label className="premium-label">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={({ target }) => handleChange("description", target.value)}
            placeholder="Add goals, target companies, or preferences..."
            className="min-h-[112px] w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.25)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {/* Error Notification Block */}
        {error && (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {/* Action Button Strip */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="premium-button-secondary w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="premium-button w-full sm:w-auto sm:min-w-[180px]"
          >
            {isLoading ? (
              <SpinnerLoader size={22} />
            ) : (
              "Create session"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSessionForm;