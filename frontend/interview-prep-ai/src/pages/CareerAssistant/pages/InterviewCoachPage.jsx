import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowRight, LuCheck, LuInfo, LuX } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { CAREER_ASSISTANT_API } from "../../../services/careerAssistantServices";
import CareerAssistantPageLayout from "../../../components/layouts/CareerAssistantPageLayout";

const ContextInputs = ({ role, setRole, experience, setExperience, subject, setSubject, subjectLabel = "Topic / Tech" }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Role</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-400 transition-colors"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="e.g., Frontend Developer"
      />
    </div>
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-400 transition-colors"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="e.g., 2"
      />
    </div>
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{subjectLabel}</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-400 transition-colors"
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
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-fuchsia-500 shrink-0" />
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
    <span className="inline-block animate-pulse bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold text-sm">
      {text}
    </span>
  </motion.div>
);

const InterviewCoachPage = () => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Please enter an interview question.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.interviewCoach({ role, experience, subject, question });
      const payload = res?.data;
      setResult(payload?.data || payload);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <CareerAssistantPageLayout
        title="Mock Interview"
        subtitle="Get any question explained, see a model answer, and learn how to make yours better."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleGenerate} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <ContextInputs
                role={role}
                setRole={setRole}
                experience={experience}
                setExperience={setExperience}
                subject={subject}
                setSubject={setSubject}
                subjectLabel="Topic"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Your Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Explain time complexity of quicksort and how to optimize it..."
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-400 min-h-[120px] resize-none transition-all break-words"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Explain & Improve"}
              </button>
              <ErrorBox message={errorMsg} />
            </form>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <AnimatePresence mode="wait">
              {loading && <FunLoader text="Working on it..." />}

              {!loading && result?.questionExplanations?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</h4>
                      <span className="px-2.5 py-1 text-xs font-bold bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 rounded-lg">
                        {result?.difficultyLevel || "General"}
                      </span>
                    </div>

                    {Array.isArray(result?.interviewTips) && result.interviewTips.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-800">Quick Tips</h5>
                        <ul className="space-y-2">
                          {result.interviewTips.map((t, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span>💡</span>
                              <span className="break-words">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {result.questionExplanations.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                      <h3 className="text-base font-bold text-slate-900 border-l-4 border-fuchsia-500 pl-3 break-words whitespace-normal">
                        {item.question}
                      </h3>

                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Why it's asked</h4>
                        <p className="text-sm text-slate-700 leading-6 break-words">{item.whyItMatters}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ideal Answer</h4>
                        <div className="text-sm leading-7 text-slate-800 bg-white border border-slate-100 p-4 rounded-xl shadow-inner whitespace-pre-wrap break-words">
                          {item.idealAnswer}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextListCard title="How to Improve" items={item.improvementSuggestions} />
                        <TextListCard title="Possible Follow-ups" items={item.followUpQuestions} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {!loading && !result && <EmptyState text="Type a question to get a full breakdown and a model answer." />}
            </AnimatePresence>
          </div>
        </div>
      </CareerAssistantPageLayout>
    </DashboardLayout>
  );
};

export default InterviewCoachPage;

