import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuInfo } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { CAREER_ASSISTANT_API } from "../../../services/careerAssistantServices";
import CareerAssistantPageLayout from "../../../components/layouts/CareerAssistantPageLayout";
import ProgressLoader from "../../../components/common/ProgressLoader";
import useSimulatedProgress from "../../../hooks/useSimulatedProgress";


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
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
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
    <span className="inline-block animate-pulse bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-semibold text-sm">
      {text}
    </span>
  </motion.div>
);

const CareerAdvisorPage = () => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const { progress, status, estimatedTime, success: progressSuccess, start, onComplete, stopWithError } = useSimulatedProgress({
    startOnMount: false,
    messages: [
      { at: 0, text: "Analyzing your request..." },
      { at: 40, text: "Building your roadmap structure..." },
      { at: 70, text: "Identifying skill gaps & recommendations..." },
      { at: 90, text: "Finalizing your plan..." },
    ],
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skills.trim()) {
      toast.error("Please list a few of your current skills.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);
    start();

    try {
      const res = await CAREER_ASSISTANT_API.careerAdvisor({ role, experience, skills });
      // backend returns: { success: true, report, data }
      const payload = res?.data;
      setResult(payload?.data ?? payload);
      await onComplete();

    } catch (err) {
      const msg = err?.response?.data?.message || "Couldn't build a roadmap. Try again.";
      setErrorMsg(msg);
      stopWithError(msg);
    } finally {
      setLoading(false);
    }
  };


  const timeline = Array.isArray(result?.roadmap) ? result.roadmap : [];

  return (
    <DashboardLayout>
      <CareerAssistantPageLayout title="Career Roadmap" subtitle="Tell us your skills and get a step-by-step plan to reach your dream role.">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleGenerate} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dream Role</label>
                  <input
                    className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-colors"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
                  <input
                    className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-colors"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Your Current Skills</label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., React, Node.js, Git, basic DSA..."
                  className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 min-h-[120px] resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? "Building roadmap..." : "Build My Roadmap"}
              </button>
              <ErrorBox message={errorMsg} />
            </form>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <AnimatePresence mode="wait">
              {loading && (
                <ProgressLoader
                  fullscreen
                  isLoading={true}
                  title="🤖 AI Assistant"
                  progress={progress}
                  status={status}
                  estimatedTime={estimatedTime}
                  type="advisor"
                  success={progressSuccess}
                />
              )}

              {!loading && result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Your Roadmap</h4>
                    <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6">
                      {timeline.map((ph, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[35px] top-0 h-6 w-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 border-4 border-white shadow-sm" />
                          <div className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-xl space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-200/40 pb-2">
                              <h5 className="font-bold text-slate-900 text-sm break-words">{ph.phase}</h5>
                              <span className="text-[10px] font-bold bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">
                                {ph.timeframe}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Goals</span>
                                <ul className="space-y-1 text-xs text-slate-600 font-medium">
                                  {ph.goals?.map((g, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span>•</span>
                                      <span className="break-words">{g}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Deliverables</span>
                                <ul className="space-y-1 text-xs text-slate-600 font-medium">
                                  {ph.deliverables?.map((d, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                      <span>•</span>
                                      <span className="break-words">{d}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextListCard title="What to Learn" items={result?.learningPath} />

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Gaps</h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Gaps</h5>
                          <ul className="space-y-1 text-sm text-slate-600">
                            {(result?.skillGapAnalysis?.gaps || []).map((g, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span>•</span>
                                <span className="break-words">{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t border-slate-100 pt-2">
                          <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Learn Next</h5>
                          <ul className="space-y-1 text-sm text-slate-600">
                            {(result?.skillGapAnalysis?.whatToLearnNext || []).map((g, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span>•</span>
                                <span className="break-words">{g}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextListCard title="Tech to Learn" items={result?.recommendedTechnologies} />
                    <TextListCard title="Projects to Build" items={result?.recommendedProjects} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextListCard title="Placement Prep Plan" items={result?.placementPreparationPlan} />
                    <TextListCard title="Interview Readiness Tips" items={result?.interviewReadinessTips} />
                  </div>
                </motion.div>
              )}

              {!loading && !result && <EmptyState text="Add your skills to get a personalized roadmap." />}
            </AnimatePresence>
          </div>
        </div>
      </CareerAssistantPageLayout>
    </DashboardLayout>
  );
};

export default CareerAdvisorPage;

