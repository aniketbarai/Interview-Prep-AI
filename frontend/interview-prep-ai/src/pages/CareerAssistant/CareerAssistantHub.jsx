import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuBriefcase,
  LuCode,
  LuFileText,
  LuGraduationCap,
  LuSparkles,
  LuUsers,
} from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import { CAREER_ASSISTANT_API } from "../../services/careerAssistantServices";

const modeCards = [
  {
    key: "Interview Coach",
    title: "Interview Coach",
    icon: LuCode,
    description:
      "Explain questions, provide ideal answers, and improve your responses.",
    badge: "Technical",
  },
  {
    key: "Resume Reviewer",
    title: "Resume Reviewer",
    icon: LuFileText,
    description:
      "Upload your resume (PDF/DOCX), get ATS score, strengths, gaps, and fixes.",
    badge: "ATS",
  },
  {
    key: "Project Reviewer",
    title: "Project Reviewer",
    icon: LuUsers,
    description:
      "Simulate project viva and generate architecture, scalability, security questions.",
    badge: "Viva",
  },
  {
    key: "Career Advisor",
    title: "Career Advisor",
    icon: LuGraduationCap,
    description:
      "Get a personalized timeline roadmap, skill gaps, and placement plan.",
    badge: "Roadmap",
  },
  {
    key: "HR Interviewer",
    title: "HR Interviewer",
    icon: LuBriefcase,
    description:
      "Answer HR questions one-by-one and get structured evaluations.",
    badge: "Mock HR",
  },
];

const Card = ({
  selected,
  title,
  description,
  badge,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "premium-card hover-lift p-6 text-left",
        selected ? "ring-4 ring-orange-100 border-orange-200/70" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="premium-badge mb-3 w-fit">
            <Icon className="text-base" />
            <span>{badge}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <LuSparkles className="text-orange-500 text-2xl" />
      </div>
    </button>
  );
};

const ProgressBar = ({ value = 0 }) => {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
        <span>Score</span>
        <span className="font-semibold text-slate-900">{safe}/100</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-[linear-gradient(135deg,#ff9324_0%,#f59e0b_55%,#f97316_100%)]"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
};

const TextListCard = ({ title, items }) => {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <div className="premium-card p-5">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <ul className="mt-3 space-y-2">
        {safeItems.length === 0 ? (
          <li className="text-sm text-slate-500">No items found.</li>
        ) : (
          safeItems.map((it, idx) => (
            <li key={idx} className="text-sm leading-6 text-slate-700">
              • {it}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const ModeHeader = ({ title, subtitle, children }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="premium-section mb-6 p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </motion.section>
  );
};

const InterviewCoach = ({ context, onDone }) => {
  const { role, experience, subject } = context;
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Enter an interview question.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.interviewCoach({
        role,
        experience,
        subject,
        question,
      });
      setResult(res.data?.data || res.data);
      onDone?.();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to explain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5">
        <ModeHeader
          title="Interview Coach"
          subtitle="Explain questions, generate ideal answers, and suggest improvements with follow-ups."
        />

        <form onSubmit={handleGenerate} className="premium-card p-5">
          <label className="premium-label">Your question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Explain time complexity of quicksort..."
            className="premium-input-shell min-h-[110px] resize-y"
          />
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-70"
            >
              {loading ? "Generating..." : "Explain & Improve"}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMsg}
            </div>
          )}
        </form>
      </div>

      <div className="lg:col-span-7">
        {loading && (
          <div className="premium-card p-6">Loading AI response...</div>
        )}

        {!loading && result?.questionExplanations?.length > 0 && (
          <div className="space-y-5">
            <div className="premium-card p-5">
              <h4 className="text-sm font-semibold text-slate-900">Difficulty level</h4>
              <p className="mt-2 text-sm text-slate-700">{result?.difficultyLevel || ""}</p>
              {Array.isArray(result?.interviewTips) && result.interviewTips.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-900">Interview tips</h4>
                  <ul className="mt-2 space-y-2">
                    {result.interviewTips.map((t, i) => (
                      <li key={i} className="text-sm text-slate-700">• {t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {result.questionExplanations.map((item, idx) => (
              <div key={idx} className="premium-card p-5">
                <h3 className="text-base font-semibold text-slate-950">{item.question}</h3>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-900">Why interviewers ask this</h4>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.whyItMatters}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-900">Ideal answer</h4>
                  <div className="mt-2 text-sm leading-7 text-slate-700 whitespace-pre-wrap">{item.idealAnswer}</div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextListCard
                    title="Improvement suggestions"
                    items={item.improvementSuggestions}
                  />
                  <TextListCard
                    title="Follow-up questions"
                    items={item.followUpQuestions}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !result && (
          <div className="premium-card p-6 text-center">
            <p className="text-sm text-slate-600">
              Enter a question to get a structured explanation and improved answers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResumeReviewer = ({ context }) => {
  const { role, experience, subject } = context;
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Upload a resume (PDF or DOCX)." );
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.resumeReview(formData, {
        role,
        experience,
        subject,
      });
      // Note: axiosInstance config above uses only formData; payload is passed using FormData fields
      // Fix: we need to append fields to FormData.
    } catch {}
  };

  const handleUploadFixed = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Upload a resume (PDF or DOCX)." );
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
      setErrorMsg(err?.response?.data?.message || "Failed to review resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5">
        <ModeHeader
          title="Resume Reviewer"
          subtitle="Upload your resume (PDF/DOCX) and get ATS score, strengths, weaknesses, and improvements."
        />

        <form onSubmit={handleUploadFixed} className="premium-card p-5">
          <label className="premium-label">Upload resume (PDF/DOCX)</label>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="premium-input-shell"
          />
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-70"
            >
              {loading ? "Analyzing..." : "Review Resume"}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMsg}
            </div>
          )}
        </form>

        <div className="mt-5 premium-card p-5">
          <h4 className="text-sm font-semibold text-slate-900">What you’ll get</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• ATS score</li>
            <li>• Strengths & weaknesses</li>
            <li>• Missing keywords & skills</li>
            <li>• Improvement suggestions</li>
            <li>• Recommended projects & certifications</li>
          </ul>
        </div>
      </div>

      <div className="lg:col-span-7">
        {loading && <div className="premium-card p-6">Extracting + analyzing resume...</div>}

        {!loading && result && (
          <div className="space-y-5">
            <div className="premium-card p-5">
              <ProgressBar value={result?.atsScore} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextListCard title="Strengths" items={result?.strengths} />
              <TextListCard title="Weaknesses" items={result?.weaknesses} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextListCard
                title="Missing Keywords"
                items={result?.missingKeywords}
              />
              <TextListCard
                title="Missing Skills"
                items={result?.missingSkills}
              />
            </div>

            <div>
              <TextListCard
                title="Resume Improvement Suggestions"
                items={result?.resumeImprovementSuggestions}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextListCard
                title="Recommended Projects"
                items={result?.recommendedProjects}
              />
              <TextListCard
                title="Recommended Certifications"
                items={result?.recommendedCertifications}
              />
            </div>
          </div>
        )}

        {!loading && !result && (
          <div className="premium-card p-6 text-center">
            <p className="text-sm text-slate-600">
              Upload a resume to get ATS insights and actionable improvements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectReviewer = ({ context }) => {
  const { role, experience, subject } = context;
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
      toast.error("Project title, description, and tech stack are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.projectReview({
        role,
        experience,
        subject,
        title,
        description,
        stack,
        githubUrl,
      });
      setResult(res.data?.data || res.data);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to review project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5">
        <ModeHeader
          title="Project Reviewer"
          subtitle="Analyze your project and generate viva questions across architecture, scalability, security, DB, and deployment."
        />

        <form onSubmit={handleGenerate} className="premium-card p-5">
          <label className="premium-label">Project title</label>
          <input
            className="premium-input-shell"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Real-time chat app"
          />

          <div className="mt-4">
            <label className="premium-label">Project description</label>
            <textarea
              className="premium-input-shell min-h-[130px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What it does, key features, and challenges..."
            />
          </div>

          <div className="mt-4">
            <label className="premium-label">Technology stack</label>
            <input
              className="premium-input-shell"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              placeholder="e.g., React, Node, MongoDB, WebSockets"
            />
          </div>

          <div className="mt-4">
            <label className="premium-label">GitHub URL (optional)</label>
            <input
              className="premium-input-shell"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-70"
            >
              {loading ? "Analyzing..." : "Review Project"}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMsg}
            </div>
          )}
        </form>
      </div>

      <div className="lg:col-span-7">
        {loading && <div className="premium-card p-6">Generating project review...</div>}

        {!loading && result && (
          <div className="space-y-5">
            <div className="premium-card p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <ProgressBar value={result?.projectScore} />
                  <p className="mt-2 text-xs font-medium text-slate-500">Project score</p>
                </div>
                <div>
                  <ProgressBar value={result?.complexityScore} />
                  <p className="mt-2 text-xs font-medium text-slate-500">Complexity</p>
                </div>
                <div>
                  <ProgressBar value={result?.portfolioValueScore} />
                  <p className="mt-2 text-xs font-medium text-slate-500">Portfolio value</p>
                </div>
              </div>
              {result?.analysisSummary && (
                <div className="mt-4 text-sm leading-7 text-slate-700">
                  {result.analysisSummary}
                </div>
              )}
              {Array.isArray(result?.improvementSuggestions) && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Improvement suggestions
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {result.improvementSuggestions.map((s, i) => (
                      <li key={i} className="text-sm text-slate-700">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <TextListCard title="Viva Questions" items={result?.vivaQuestions} />
              <TextListCard
                title="Architecture Questions"
                items={result?.architectureQuestions}
              />
              <TextListCard
                title="Scalability Questions"
                items={result?.scalabilityQuestions}
              />
              <TextListCard
                title="Security Questions"
                items={result?.securityQuestions}
              />
              <TextListCard
                title="Database Questions"
                items={result?.databaseQuestions}
              />
              <TextListCard
                title="Deployment Questions"
                items={result?.deploymentQuestions}
              />
            </div>
          </div>
        )}

        {!loading && !result && (
          <div className="premium-card p-6 text-center">
            <p className="text-sm text-slate-600">
              Add your project details to get viva + deep technical questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CareerAdvisor = ({ context }) => {
  const { role, experience } = context;
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!skills.trim()) {
      toast.error("Enter current skills.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await CAREER_ASSISTANT_API.careerAdvisor({
        role,
        experience,
        skills,
      });
      setResult(res.data?.data || res.data);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const timeline = Array.isArray(result?.roadmap) ? result.roadmap : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5">
        <ModeHeader
          title="Career Advisor"
          subtitle="Generate a timeline roadmap, learning path, skill gap analysis, and placement plan."
        />

        <form onSubmit={handleGenerate} className="premium-card p-5">
          <label className="premium-label">Current Skills</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., React, Node.js, MongoDB, Data Structures, System Design..."
            className="premium-input-shell min-h-[110px] resize-y"
          />

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-70"
            >
              {loading ? "Planning..." : "Generate Roadmap"}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMsg}
            </div>
          )}
        </form>
      </div>

      <div className="lg:col-span-7">
        {loading && <div className="premium-card p-6">Generating career plan...</div>}

        {!loading && result && (
          <div className="space-y-5">
            <div className="premium-card p-5">
              <h4 className="text-sm font-semibold text-slate-900">Personalized Roadmap</h4>
              <div className="mt-4 space-y-4">
                {timeline.map((ph, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 h-10 w-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <h5 className="font-semibold text-slate-950">{ph.phase}</h5>
                        <p className="text-xs font-semibold text-slate-500">{ph.timeframe}</p>
                      </div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Goals</p>
                          <ul className="mt-2 space-y-1">
                            {ph.goals?.map((g, i) => (
                              <li key={i} className="text-sm text-slate-700">• {g}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Deliverables</p>
                          <ul className="mt-2 space-y-1">
                            {ph.deliverables?.map((d, i) => (
                              <li key={i} className="text-sm text-slate-700">• {d}</li>
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
              <TextListCard
                title="Learning Path"
                items={result?.learningPath}
              />
              <div className="premium-card p-5">
                <h4 className="text-sm font-semibold text-slate-900">Skill Gap Analysis</h4>
                <div className="mt-4">
                  <h5 className="text-xs font-semibold text-slate-500">Gaps</h5>
                  <ul className="mt-2 space-y-2">
                    {(result?.skillGapAnalysis?.gaps || []).map((g, i) => (
                      <li key={i} className="text-sm text-slate-700">• {g}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h5 className="text-xs font-semibold text-slate-500">What to learn next</h5>
                  <ul className="mt-2 space-y-2">
                    {(result?.skillGapAnalysis?.whatToLearnNext || []).map((g, i) => (
                      <li key={i} className="text-sm text-slate-700">• {g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextListCard
                title="Recommended Technologies"
                items={result?.recommendedTechnologies}
              />
              <TextListCard
                title="Recommended Projects"
                items={result?.recommendedProjects}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextListCard
                title="Placement Preparation Plan"
                items={result?.placementPreparationPlan}
              />
              <TextListCard
                title="Interview Readiness Tips"
                items={result?.interviewReadinessTips}
              />
            </div>
          </div>
        )}

        {!loading && !result && (
          <div className="premium-card p-6 text-center">
            <p className="text-sm text-slate-600">
              Enter current skills to receive a structured, timeline-based career plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const HRInterviewer = ({ context }) => {
  const { role, experience, subject } = context;
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
      setQuestion({
        text: data.question,
        category: data.questionCategory,
      });
      setCurrentIndex(data.currentQuestionIndex || 0);
      setTechnicalRequirements(data.technicalRequirements || []);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to start HR interview.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!conversationId) return;
    if (!answer.trim()) {
      toast.error("Type your answer before submitting.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await CAREER_ASSISTANT_API.hrAnswer({
        conversationId,
        userAnswer: answer,
      });
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
      setErrorMsg(err?.response?.data?.message || "Failed to evaluate answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-5">
        <ModeHeader
          title="HR Interviewer"
          subtitle="Answer HR questions one-by-one. Receive structured evaluation across confidence, clarity, professionalism, communication, and overall impression."
        />

        <div className="premium-card p-5">
          {!question ? (
            <button
              type="button"
              onClick={start}
              disabled={loading}
              className="btn-primary disabled:opacity-70"
            >
              {loading ? "Starting..." : "Start HR Interview"}
            </button>
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Question {currentIndex + 1}
              </p>
              <h4 className="mt-3 text-base font-semibold text-slate-950">{question.text}</h4>
              <div className="mt-2">
                <span className="premium-badge">
                  <span>{question.category}</span>
                </span>
              </div>

              {technicalRequirements?.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-slate-900">Technical requirements</h5>
                  <ul className="mt-2 space-y-2">
                    {technicalRequirements.map((r, i) => (
                      <li key={i} className="text-sm text-slate-700">• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="premium-card p-5">
          {question && (
            <form onSubmit={submit}>
              <label className="premium-label">Your answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="premium-input-shell min-h-[150px] resize-y"
                placeholder="Write a confident, concise HR-style answer..."
              />
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-70"
                >
                  {loading ? "Evaluating..." : "Submit & Get Evaluation"}
                </button>
              </div>
            </form>
          )}

          {!question && (
            <p className="text-sm text-slate-600">
              Click “Start HR Interview” to begin.
            </p>
          )}
        </div>

        <AnimatePresence>
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-5 space-y-4"
            >
              <div className="premium-card p-5">
                <h4 className="text-sm font-semibold text-slate-900">Evaluation</h4>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ["confidence", "Confidence"],
                    ["clarity", "Clarity"],
                    ["professionalism", "Professionalism"],
                    ["communication", "Communication"],
                    ["overallImpression", "Overall Impression"],
                  ].map(([k, label]) => (
                    <div key={k} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                      <div className="text-xs font-semibold text-slate-500">{label}</div>
                      <div className="mt-2 text-2xl font-semibold text-slate-950">
                        {evaluation?.scores?.[k] ?? 0}/10
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-slate-900">Feedback</h5>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {evaluation?.feedback}
                  </p>
                </div>

                {improvedAnswerExample && (
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold text-slate-900">Improved answer example</h5>
                    <div className="mt-2 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
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
  );
};

const CareerAssistantHub = () => {
  const [selectedMode, setSelectedMode] = useState(null);

  // Context inputs (uses the same idea as the existing session inputs)
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [subject, setSubject] = useState("");
  const [skills, setSkills] = useState("");

  const context = useMemo(
    () => ({
      role,
      experience,
      subject,
      skills,
    }),
    [role, experience, subject, skills]
  );

  const selected = modeCards.find((m) => m.key === selectedMode);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-6">
        <div className="premium-section px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="premium-badge mb-3 w-fit">
                  <LuSparkles />
                  <span>AI Career Assistant Hub</span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Pick your AI mode
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  Interview Coach, Resume Reviewer, Project Reviewer, Career Advisor, and HR Interviewer—each one generating structured, actionable outputs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:max-w-lg">
                <div>
                  <label className="premium-label">Target Role</label>
                  <input
                    className="premium-input-shell"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="premium-label">Experience</label>
                  <input
                    className="premium-input-shell"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <label className="premium-label">Target Subject</label>
                  <input
                    className="premium-input-shell"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., React performance"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base md:text-lg font-semibold text-slate-950">
                  AI modes
                </h2>
                {selected && (
                  <span className="premium-badge">
                    <span>Selected: {selected.title}</span>
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modeCards.map((m) => (
                  <Card
                    key={m.key}
                    selected={selectedMode === m.key}
                    title={m.title}
                    description={m.description}
                    badge={m.badge}
                    icon={m.icon}
                    onClick={() => setSelectedMode(m.key)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {selectedMode === "Interview Coach" && (
              <motion.div key="interview-coach" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <InterviewCoach context={context} />
              </motion.div>
            )}

            {selectedMode === "Resume Reviewer" && (
              <motion.div key="resume-reviewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResumeReviewer context={context} />
              </motion.div>
            )}

            {selectedMode === "Project Reviewer" && (
              <motion.div key="project-reviewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProjectReviewer context={context} />
              </motion.div>
            )}

            {selectedMode === "Career Advisor" && (
              <motion.div key="career-advisor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CareerAdvisor context={context} />
              </motion.div>
            )}

            {selectedMode === "HR Interviewer" && (
              <motion.div key="hr-interviewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HRInterviewer context={context} />
              </motion.div>
            )}

            {!selectedMode && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="premium-card p-6 text-center">
                  <p className="text-sm text-slate-600">
                    Select a mode card above to start.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareerAssistantHub;

