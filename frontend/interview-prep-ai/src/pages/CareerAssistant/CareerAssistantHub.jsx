import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuBriefcase, LuCode, LuFileText, LuGraduationCap, LuSparkles, LuUsers } from "react-icons/lu";

import DashboardLayout from "../../components/layouts/DashboardLayout";

const modeCards = [
  {
    key: "interview",
    title: "Mock Interview",
    icon: LuCode,
    description: "Get any question explained, see a model answer, and learn how to make yours better.",
    badge: "Practice",
    gradient: "from-violet-500 to-fuchsia-500",
    route: "/career-assistant/interview",
  },
  {
    key: "resume",
    title: "Resume Check",
    icon: LuFileText,
    description: "Upload your resume and get an ATS score plus clear fixes to improve it.",
    badge: "ATS Score",
    gradient: "from-sky-500 to-cyan-400",
    route: "/career-assistant/resume",
  },
  {
    key: "project",
    title: "Project Viva",
    icon: LuUsers,
    description: "Describe your project and get tough viva-style questions on its design and scale.",
    badge: "Viva Prep",
    gradient: "from-emerald-500 to-teal-400",
    route: "/career-assistant/project",
  },
  {
    key: "roadmap",
    title: "Career Roadmap",
    icon: LuGraduationCap,
    description: "Tell us your skills and get a step-by-step plan to reach your dream role.",
    badge: "Plan",
    gradient: "from-amber-500 to-orange-500",
    route: "/career-assistant/roadmap",
  },
  {
    key: "hr",
    title: "HR Round",
    icon: LuBriefcase,
    description: "Answer real HR questions one by one and get instant, honest feedback.",
    badge: "Mock HR",
    gradient: "from-rose-500 to-pink-500",
    route: "/career-assistant/hr",
  },
];

const Card = ({ title, description, badge, icon: Icon, gradient, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -4 }}
    whileTap={{ scale: 0.97 }}
    type="button"
    onClick={onClick}
    className="group relative text-left rounded-2xl p-6 overflow-hidden border border-slate-200/70 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div
      className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity`}
    />
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

const CareerAssistantHub = () => {
  const navigate = useNavigate();

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
              <p className="text-xs leading-5 text-slate-500 max-w-2xl font-medium">Pick a tool below — it opens in its own page so you can focus.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {modeCards.map((m) => (
                <Card
                  key={m.key}
                  title={m.title}
                  description={m.description}
                  badge={m.badge}
                  icon={m.icon}
                  gradient={m.gradient}
                  onClick={() => navigate(m.route)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareerAssistantHub;

