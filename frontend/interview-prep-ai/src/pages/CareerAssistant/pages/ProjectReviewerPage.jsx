import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { LuInfo } from "react-icons/lu";

import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { CAREER_ASSISTANT_API } from "../../../services/careerAssistantServices";
import CareerAssistantPageLayout from "../../../components/layouts/CareerAssistantPageLayout";

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
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
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
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
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
    <span className="inline-block animate-pulse bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent font-semibold text-sm">
      {text}
    </span>
  </motion.div>
);

const ProjectReviewerPage = () => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stack, setStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !stack.trim()) {
      toast.error("Please fill in title, description and tech stack.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.projectReview({ role, experience, title, description, stack, githubUrl });
      setResult(res.data?.data || res.data);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Couldn't analyze this project. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <CareerAssistantPageLayout title="Project Viva" subtitle="Describe your project and get tough viva-style questions on its design and scale.">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleGenerate} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Role</label>
                  <input
                    className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-colors"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Backend Developer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
                  <input
                    className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-colors"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Project Name</label>
                <input
                  className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., E-Commerce Platform"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">What does it do?</label>
                <textarea
                  className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 min-h-[100px] resize-none transition-all"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the project, its features and architecture..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Tech Stack</label>
                <input
                  className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  placeholder="e.g., React, Node, MongoDB, Redis"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">GitHub Link (optional)</label>
                <input
                  className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? "Analyzing project..." : "Get Viva Questions"}
              </button>
              <ErrorBox message={errorMsg} />
            </form>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <AnimatePresence mode="wait">
              {loading && <FunLoader text="Reviewing your project..." />}

              {!loading && result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <ProgressBar value={result?.projectScore} label="Overall Score" />
                      <ProgressBar value={result?.complexityScore} label="Complexity" />
                      <ProgressBar value={result?.portfolioValueScore} label="Portfolio Value" />
                    </div>
                    {result?.analysisSummary && (
                      <p className="text-sm leading-6 text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl break-words">{result.analysisSummary}</p>
                    )}

                    {Array.isArray(result?.improvementSuggestions) && (
                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ways to Improve</h5>
                        <ul className="space-y-1.5">
                          {result.improvementSuggestions.map((s, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span>•</span>
                              <span className="break-words">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <TextListCard title="Viva Questions" items={result?.vivaQuestions} />
                    <TextListCard title="Architecture Questions" items={result?.architectureQuestions} />
                    <TextListCard title="Scalability Questions" items={result?.scalabilityQuestions} />
                    <TextListCard title="Security Questions" items={result?.securityQuestions} />
                    <TextListCard title="Database Questions" items={result?.databaseQuestions} />
                    <TextListCard title="Deployment Questions" items={result?.deploymentQuestions} />
                  </div>
                </motion.div>
              )}

              {!loading && !result && <EmptyState text="Describe your project to get likely viva questions." />}
            </AnimatePresence>
          </div>
        </div>
      </CareerAssistantPageLayout>
    </DashboardLayout>
  );
};

export default ProjectReviewerPage;

