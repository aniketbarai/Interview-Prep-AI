import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuBriefcase,
  LuCode,
  LuFileText,
  LuGraduationCap,
  LuSparkles,
  LuUsers,
  LuArrowRight,
  LuInfo,
  LuCheck,
  LuX,
} from "react-icons/lu";
import { toast } from "react-hot-toast";

// Replace this with your actual app routing/layout import if name differs
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { CAREER_ASSISTANT_API } from "../../services/careerAssistantServices";

// --- Mode definitions (simple, catchy names) ---

const modeCards = [
  {
    key: "interview",
    title: "Mock Interview",
    icon: LuCode,
    description: "Get any question explained, see a model answer, and learn how to make yours better.",
    badge: "Practice",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    key: "resume",
    title: "Resume Check",
    icon: LuFileText,
    description: "Upload your resume and get an ATS score plus clear fixes to improve it.",
    badge: "ATS Score",
    gradient: "from-sky-500 to-cyan-400",
  },
  {
    key: "project",
    title: "Project Viva",
    icon: LuUsers,
    description: "Describe your project and get tough viva-style questions on its design and scale.",
    badge: "Viva Prep",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    key: "roadmap",
    title: "Career Roadmap",
    icon: LuGraduationCap,
    description: "Tell us your skills and get a step-by-step plan to reach your dream role.",
    badge: "Plan",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    key: "hr",
    title: "HR Round",
    icon: LuBriefcase,
    description: "Answer real HR questions one by one and get instant, honest feedback.",
    badge: "Mock HR",
    gradient: "from-rose-500 to-pink-500",
  },
];

// --- Fun stuff for the waiting state ---

const WAITING_SNIPPETS = [
  { tag: "Fact", text: "Octopuses have three hearts — two pump blood to the gills, one to the body." },
  { tag: "Joke", text: "Why do programmers prefer dark mode? Because light attracts bugs." },
  { tag: "Motivation", text: "Every expert was once a beginner who didn't quit." },
  { tag: "Fact", text: "Honey never spoils — archaeologists have found 3000-year-old honey that's still edible." },
  { tag: "Joke", text: "I told my computer I needed a break, and it said 'No problem, I'll go to sleep.'" },
  { tag: "Motivation", text: "Small daily improvements compound into massive long-term results." },
  { tag: "Fact", text: "Bananas are berries, but strawberries technically aren't." },
  { tag: "Joke", text: "Why do Java developers wear glasses? Because they don't see sharp." },
  { tag: "Motivation", text: "The best time to plant a tree was 20 years ago. The second best time is now." },
  { tag: "Fact", text: "A single bolt of lightning contains enough energy to toast about 100,000 slices of bread." },
  { tag: "Joke", text: "There are 10 types of people in the world: those who understand binary, and those who don't." },
  { tag: "Motivation", text: "You don't have to be great to start, but you have to start to be great." },
  { tag: "Fact", text: "Sharks existed before trees — they've been around for over 400 million years." },
  { tag: "Joke", text: "Why was the JavaScript developer sad? Because they didn't 'null' their feelings." },
  { tag: "Motivation", text: "Discipline is choosing between what you want now and what you want most." },
];

const tagStyles = {
  Fact: "bg-sky-50 text-sky-700 border-sky-200",
  Joke: "bg-amber-50 text-amber-700 border-amber-200",
  Motivation: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const FunLoader = ({ text }) => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * WAITING_SNIPPETS.length));

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WAITING_SNIPPETS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const current = WAITING_SNIPPETS[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center py-10"
    >
      <span className="inline-block animate-pulse bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-semibold text-sm">
        {text}
      </span>

      <div className="mt-6 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="space-y-2"
          >
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tagStyles[current.tag]}`}>
              {current.tag === "Fact" ? "Did you know?" : current.tag}
            </span>
            <p className="text-sm leading-6 text-slate-600">{current.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// --- Shared UI bits ---

const Card = ({ title, description, badge, icon: Icon, gradient, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -4 }}
    whileTap={{ scale: 0.97 }}
    type="button"
    onClick={onClick}
    className="group relative text-left rounded-2xl p-6 overflow-hidden border border-slate-200/70 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity`} />
    <div className="relative space-y-4">
      <div className={`flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
        <Icon className="text-lg" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{badge}</span>
        </div>
        <p className="text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
        <span>Open</span>
        <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.button>
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
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"
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
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-fuchsia-500 shrink-0" />
              <span className="break-words">{it}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

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

// Small shared "context" inputs (role / experience / topic) used inside modals
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

// --- Modal wrapper ---

const ModeModal = ({ title, gradient, onClose, children }) => {
  // Lock body scroll while modal is open (prevents background scroll/jump on mobile)
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="relative bg-slate-50 w-full sm:max-w-5xl h-[100dvh] sm:h-[90vh] sm:max-h-[850px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className={`flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r ${gradient} text-white shrink-0`}>
          <h2 className="text-base sm:text-lg font-bold truncate">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 transition-colors shrink-0"
            aria-label="Close"
          >
            <LuX className="text-lg" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6" style={{ WebkitOverflowScrolling: "touch" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Functional Modules ---

const InterviewCoach = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <div className="lg:col-span-5 space-y-4">
        <form onSubmit={handleGenerate} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <ContextInputs role={role} setRole={setRole} experience={experience} setExperience={setExperience} subject={subject} setSubject={setSubject} subjectLabel="Topic" />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Explain time complexity of quicksort and how to optimize it..."
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-400 min-h-[120px] resize-none transition-all"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50">
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
                  <span className="px-2.5 py-1 text-xs font-bold bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 rounded-lg">{result?.difficultyLevel || "General"}</span>
                </div>
                {Array.isArray(result?.interviewTips) && result.interviewTips.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-800">Quick Tips</h5>
                    <ul className="space-y-2">
                      {result.interviewTips.map((t, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span>💡</span><span className="break-words">{t}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {result.questionExplanations.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-l-4 border-fuchsia-500 pl-3 break-words">{item.question}</h3>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Why it's asked</h4>
                    <p className="text-sm text-slate-700 leading-6 break-words">{item.whyItMatters}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ideal Answer</h4>
                    <div className="text-sm leading-7 text-slate-800 bg-white border border-slate-100 p-4 rounded-xl shadow-inner whitespace-pre-wrap break-words">{item.idealAnswer}</div>
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
  );
};

const ResumeReviewer = () => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [subject, setSubject] = useState("");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <div className="lg:col-span-5 space-y-4">
        <form onSubmit={handleUpload} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <ContextInputs role={role} setRole={setRole} experience={experience} setExperience={setExperience} subject={subject} setSubject={setSubject} subjectLabel="Target Skill" />
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Upload Resume (PDF / DOCX)</label>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-sky-500 file:to-cyan-400 file:text-white border border-slate-200 p-2.5 rounded-xl bg-slate-50 cursor-pointer"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50">
            {loading ? "Scanning resume..." : "Check My Resume"}
          </button>
          <ErrorBox message={errorMsg} />
        </form>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">What you'll get</h4>
          <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
            <li className="flex items-center gap-2"><LuCheck className="text-cyan-500 shrink-0"/> ATS match score</li>
            <li className="flex items-center gap-2"><LuCheck className="text-cyan-500 shrink-0"/> Strengths & gaps</li>
            <li className="flex items-center gap-2"><LuCheck className="text-cyan-500 shrink-0"/> Missing keywords & skills</li>
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
  );
};

const ProjectReviewer = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <div className="lg:col-span-5 space-y-4">
        <form onSubmit={handleGenerate} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Role</label>
              <input className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-colors" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Backend Developer" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
              <input className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-colors" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 1" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Project Name</label>
            <input className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., E-Commerce Platform" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">What does it do?</label>
            <textarea className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 min-h-[100px] resize-none transition-all" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe the project, its features and architecture..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Tech Stack</label>
            <input className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" value={stack} onChange={(e) => setStack(e.target.value)} placeholder="e.g., React, Node, MongoDB, Redis" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">GitHub Link (optional)</label>
            <input className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50">
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
                {result?.analysisSummary && <p className="text-sm leading-6 text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-xl break-words">{result.analysisSummary}</p>}
                {Array.isArray(result?.improvementSuggestions) && (
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ways to Improve</h5>
                    <ul className="space-y-1.5">
                      {result.improvementSuggestions.map((s, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span>•</span><span className="break-words">{s}</span></li>
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
  );
};

const CareerAdvisor = () => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skills.trim()) {
      toast.error("Please list a few of your current skills.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.careerAdvisor({ role, experience, skills });
      setResult(res.data?.data || res.data);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Couldn't build a roadmap. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const timeline = Array.isArray(result?.roadmap) ? result.roadmap : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <div className="lg:col-span-5 space-y-4">
        <form onSubmit={handleGenerate} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dream Role</label>
              <input className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-colors" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Full Stack Developer" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
              <input className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-colors" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 0" />
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
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50">
            {loading ? "Building roadmap..." : "Build My Roadmap"}
          </button>
          <ErrorBox message={errorMsg} />
        </form>
      </div>

      <div className="lg:col-span-7 min-w-0">
        <AnimatePresence mode="wait">
          {loading && <FunLoader text="Mapping out your path..." />}

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
                          <span className="text-[10px] font-bold bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">{ph.timeframe}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Goals</span>
                            <ul className="space-y-1 text-xs text-slate-600 font-medium">
                              {ph.goals?.map((g, i) => <li key={i} className="flex items-start gap-1"><span>•</span><span className="break-words">{g}</span></li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Deliverables</span>
                            <ul className="space-y-1 text-xs text-slate-600 font-medium">
                              {ph.deliverables?.map((d, i) => <li key={i} className="flex items-start gap-1"><span>•</span><span className="break-words">{d}</span></li>)}
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
                        {(result?.skillGapAnalysis?.gaps || []).map((g, i) => <li key={i} className="flex items-start gap-1.5"><span>•</span><span className="break-words">{g}</span></li>)}
                      </ul>
                    </div>
                    <div className="border-t border-slate-100 pt-2">
                      <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Learn Next</h5>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {(result?.skillGapAnalysis?.whatToLearnNext || []).map((g, i) => <li key={i} className="flex items-start gap-1.5"><span>•</span><span className="break-words">{g}</span></li>)}
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
  );
};

const HRInterviewer = () => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [subject, setSubject] = useState("");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          {!question ? (
            <>
              <ContextInputs role={role} setRole={setRole} experience={experience} setExperience={setExperience} subject={subject} setSubject={setSubject} subjectLabel="Focus Area" />
              <button type="button" onClick={start} disabled={loading} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50">
                {loading ? "Starting..." : "Start Mock HR Round"}
              </button>
              {loading && <FunLoader text="Getting your first question..." />}
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded border border-slate-200 uppercase tracking-wider">{question.category}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-6 break-words">{question.text}</h4>
              {technicalRequirements?.length > 0 && (
                <div className="space-y-1 pt-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keep in Mind</h5>
                  <ul className="space-y-1">
                    {technicalRequirements.map((r, i) => <li key={i} className="text-xs text-slate-600 flex items-start gap-1"><span>•</span><span className="break-words">{r}</span></li>)}
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
                  className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 min-h-[140px] resize-none transition-all"
                  placeholder="Type your answer as you would say it in an interview..."
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50">
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">Start the round on the left to get your first question.</p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading && question && <div className="mt-5"><FunLoader text="Evaluating your answer..." /></div>}

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
                      <div className="mt-1 text-base font-bold text-slate-900">{evaluation?.scores?.[k] ?? 0}<span className="text-[10px] text-slate-400 font-medium">/10</span></div>
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
                    <div className="text-xs leading-6 text-slate-800 bg-white border border-slate-100 p-4 rounded-xl whitespace-pre-wrap break-words shadow-inner">{improvedAnswerExample}</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Parent Container ---

const modeComponents = {
  interview: InterviewCoach,
  resume: ResumeReviewer,
  project: ProjectReviewer,
  roadmap: CareerAdvisor,
  hr: HRInterviewer,
};

const CareerAssistantHub = () => {
  const [openMode, setOpenMode] = useState(null);

  const activeCard = useMemo(() => modeCards.find((m) => m.key === openMode), [openMode]);
  const ActiveComponent = activeCard ? modeComponents[activeCard.key] : null;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg w-fit">
                <LuSparkles />
                <span>AI Career Assistant</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">What do you want to work on today?</h1>
              <p className="text-xs leading-5 text-slate-500 max-w-2xl font-medium">Pick a tool below — each one opens in its own space so you can focus.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {modeCards.map((m) => (
                <Card key={m.key} title={m.title} description={m.description} badge={m.badge} icon={m.icon} gradient={m.gradient} onClick={() => setOpenMode(m.key)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeCard && ActiveComponent && (
          <ModeModal title={activeCard.title} gradient={activeCard.gradient} onClose={() => setOpenMode(null)}>
            <ActiveComponent />
          </ModeModal>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default CareerAssistantHub;