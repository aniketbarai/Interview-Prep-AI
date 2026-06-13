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

const ContextInputs = ({ role, setRole, experience, setExperience, subject, setSubject, subjectLabel = "Focus Area" }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Role</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-colors"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="e.g., HR Generalist"
      />
    </div>
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-colors"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="e.g., 3"
      />
    </div>
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{subjectLabel}</label>
      <input
        className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-colors"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="e.g., Behavioral / Leadership"
      />
    </div>
  </div>
);

const FunLoader = ({ text }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center py-10"
  >
    <span className="inline-block animate-pulse bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold text-sm">
      {text}
    </span>
  </motion.div>
);

const HRInterviewerPage = () => {
  // HR round now starts without extra input fields.
  const [role] = useState("");
  const [experience] = useState("");
  const [subject] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [technicalRequirements, setTechnicalRequirements] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [improvedAnswerExample, setImprovedAnswerExample] = useState("");
  const [answer, setAnswer] = useState("");

  const start = async () => {
    setLoading(true);
    setErrorMsg("");
    setEvaluation(null);
    setTechnicalRequirements([]);
    setImprovedAnswerExample("");
    setAnswer("");

    try {
      const res = await CAREER_ASSISTANT_API.hrStart({ role, experience, subject });
      const data = res.data?.data || res.data;
      setConversationId(res.data?.conversationId || data.conversationId);
      setQuestion({ text: data.question, category: data.questionCategory });
      setCurrentIndex(data.currentQuestionIndex || 0);
      setTechnicalRequirements(data.technicalRequirements || []);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Couldn't start the mock round. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!conversationId) return;
    if (!answer.trim()) {
      toast.error("Please write an answer first.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await CAREER_ASSISTANT_API.hrAnswer({ conversationId, userAnswer: answer });
      const data = res.data?.data || res.data;

      setEvaluation(data?.evaluation || null);
      setTechnicalRequirements(data?.evaluation?.technicalRequirements || []);
      setImprovedAnswerExample(data?.evaluation?.improvedAnswerExample || "");

      const next = data?.nextQuestion;
      if (next?.question) {
        setQuestion({ text: next.question, category: next.questionCategory });
        setCurrentIndex(data?.currentQuestionIndex ?? currentIndex + 1);
      }
      setAnswer("");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Couldn't evaluate your answer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <CareerAssistantPageLayout title="HR Round" subtitle="Answer real HR questions one by one and get instant, honest feedback.">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              {!question ? (
                <>
                  <button
                    type="button"
                    onClick={start}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? "Starting..." : "Start Mock HR Round"}
                  </button>
                  {loading && <FunLoader text="Getting your first question..." />}
                </>
              ) : (

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded border border-slate-200 uppercase tracking-wider">
                      {question.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-6 break-words whitespace-normal">
                    {question.text}
                  </h4>
                  {technicalRequirements?.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keep in Mind</h5>
                      <ul className="space-y-1">
                        {technicalRequirements.map((r, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                            <span>•</span>
                            <span className="break-words">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <ErrorBox message={errorMsg} />
            </div>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
              {question ? (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Your Answer</label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 min-h-[140px] resize-none transition-all break-words"
                      placeholder="Type your answer as you would say it in an interview..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? "Evaluating..." : "Submit Answer"}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                  Start the round on the left to get your first question.
                </p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {loading && question && (
                <div className="mt-5">
                  <FunLoader text="Evaluating your answer..." />
                </div>
              )}

              {!loading && evaluation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-5 space-y-4">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feedback</h4>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        ["confidence", "Confidence"],
                        ["clarity", "Clarity"],
                        ["professionalism", "Professionalism"],
                        ["communication", "Comms"],
                        ["overallImpression", "Overall"],
                      ].map(([k, label]) => (
                        <div key={k} className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 text-center">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{label}</div>
                          <div className="mt-1 text-base font-bold text-slate-900">
                            {evaluation?.scores?.[k] ?? 0}
                            <span className="text-[10px] text-slate-400 font-medium">/10</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">What we noticed</h5>
                      <p className="text-sm text-slate-700 leading-6 break-words">{evaluation?.feedback}</p>
                    </div>

                    {improvedAnswerExample && (
                      <div className="space-y-1.5">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">A Stronger Answer</h5>
                        <div className="text-xs leading-6 text-slate-800 bg-white border border-slate-100 p-4 rounded-xl whitespace-pre-wrap break-words shadow-inner">
                          {improvedAnswerExample}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CareerAssistantPageLayout>
    </DashboardLayout>
  );
};

export default HRInterviewerPage;

