import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuCheck, LuInfo } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { CAREER_ASSISTANT_API } from "../../../services/careerAssistantServices";
import CareerAssistantPageLayout from "../../../components/layouts/CareerAssistantPageLayout";

const ContextInputs = ({ role, setRole, experience, setExperience, subject, setSubject, subjectLabel = "Target Skill" }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Role</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="e.g., Frontend Developer"
      />
    </div>
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="e.g., 2"
      />
    </div>
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{subjectLabel}</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="e.g., React"
      />
    </div>
  </div>
);

const ErrorBox = ({ message }) =>
  message ? (
    <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs font-medium text-rose-700 flex items-center gap-2">
      <LuInfo className="shrink-0" />
      <span className="break-words">{message}</span>
    </div>
  ) : null;

const EmptyState = ({ text }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-8 shadow-sm text-center text-slate-400 text-sm py-16"
  >
    {text}
  </motion.div>
);

const ProgressBar = ({ value = 0, label = "Score" }) => {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
        <span>{label}</span>
        <span className="font-bold text-slate-900">{safe}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safe}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400"
        />
      </div>
    </div>
  );
};

const TextListCard = ({ title, items }) => {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>
      <ul className="mt-3 space-y-2.5">
        {safeItems.length === 0 ? (
          <li className="text-sm text-slate-400 italic">Nothing here yet.</li>
        ) : (
          safeItems.map((it, idx) => (
            <li key={idx} className="text-sm leading-6 text-slate-700 flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
              <span className="break-words">{it}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const FunLoader = ({ text }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center py-10"
  >
    <span className="inline-block animate-pulse bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent font-semibold text-sm">
      {text}
    </span>
  </motion.div>
);

const ResumeReviewerPage = () => {
  // Resume check starts without extra input fields.
  const [role] = useState("");
  const [experience] = useState("");
  const [subject] = useState("");

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role || "");
    formData.append("experience", experience || "");
    formData.append("subject", subject || "");



    setLoading(true);

    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.resumeReview(formData);
      setResult(res.data?.data || res.data);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Couldn't process this file. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <CareerAssistantPageLayout
        title="Resume Check"
        subtitle="Upload your resume and get an ATS score plus clear fixes to improve it."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleUpload} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">


              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Upload Resume (PDF / DOCX)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-sky-500 file:to-cyan-400 file:text-white border border-slate-200 p-2.5 rounded-xl bg-slate-50 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? "Scanning resume..." : "Check My Resume"}
              </button>
              <ErrorBox message={errorMsg} />
            </form>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">What you'll get</h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <LuCheck className="text-cyan-500 shrink-0" /> ATS match score
                </li>
                <li className="flex items-center gap-2">
                  <LuCheck className="text-cyan-500 shrink-0" /> Strengths & gaps
                </li>
                <li className="flex items-center gap-2">
                  <LuCheck className="text-cyan-500 shrink-0" /> Missing keywords & skills
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <AnimatePresence mode="wait">
              {loading && <FunLoader text="Reading your resume..." />}

              {!loading && result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <ProgressBar value={result?.atsScore} label="ATS Score" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextListCard title="Strengths" items={result?.strengths} />
                    <TextListCard title="Weaknesses" items={result?.weaknesses} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextListCard title="Missing Keywords" items={result?.missingKeywords} />
                    <TextListCard title="Missing Skills" items={result?.missingSkills} />
                  </div>

                  <TextListCard title="How to Improve" items={result?.resumeImprovementSuggestions} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextListCard title="Project Ideas" items={result?.recommendedProjects} />
                    <TextListCard title="Certifications to Add" items={result?.recommendedCertifications} />
                  </div>
                </motion.div>
              )}

              {!loading && !result && <EmptyState text="Upload your resume to get an instant ATS score and feedback." />}
            </AnimatePresence>
          </div>
        </div>
      </CareerAssistantPageLayout>
    </DashboardLayout>
  );
};

export default ResumeReviewerPage;

