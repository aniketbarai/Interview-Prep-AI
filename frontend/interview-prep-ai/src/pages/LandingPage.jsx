import React, { useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuBadgeCheck, LuSparkles, LuShieldCheck, LuZap } from "react-icons/lu";

import HERO_IMG from "../assets/HERO_IMG.jpg";
import { APP_FEATURES } from "../utils/data";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const heroStats = [
  { value: "10x", label: "Faster prep cycles" },
  { value: "24/7", label: "AI interview support" },
  { value: "90%", label: "Answer clarity boost" },
];

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("signup");

  const featuredStats = useMemo(
    () => [
      { icon: LuZap, text: "Instant question generation" },
      { icon: LuShieldCheck, text: "Secure, role-based prep" },
      { icon: LuBadgeCheck, text: "Built for real interviews" },
    ],
    []
  );

  const handleCTA = () => {
    if (!user) {
      setCurrentPage("signup");
      setOpenAuthModal(true);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <>
    {/* MODAL WRAPPER LAYER */}
      <AnimatePresence mode="wait">
        {openAuthModal && (
          <Modal
            isOpen={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
            hideHeader
            maxWidth={currentPage === "login" ? "max-w-md" : "max-w-xl"} 
          >
            {/* The individual layout switch transitions are handled cleanly inside */}
            <div className="w-full">
              {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
              {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <div className="relative min-h-screen overflow-x-hidden bg-transparent">
        <div className="absolute inset-0 soft-grid opacity-35" />
        <div className="pointer-events-none absolute left-[-10rem] top-[-6rem] h-72 w-72 rounded-full bg-orange-300/20 blur-3xl animate-float-y" />
        <div className="pointer-events-none absolute right-[-8rem] top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl animate-float-y" />

        <div className="page-shell relative z-10 pt-6">
          <header className="glass-surface sticky top-4 z-20 mx-auto flex items-center justify-between rounded-full px-4 py-3 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                <LuSparkles className="text-lg" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Interview Prep AI
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Interview practice platform
                </p>
              </div>
            </div>

            {user ? (
              <div className="hidden sm:block">
                <ProfileInfoCard compact />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage("login");
                  setOpenAuthModal(true);
                }}
                className="premium-button-secondary"
              >
                Login / Sign Up
              </button>
            )}
          </header>
          <main>
            
            <section className="section-spacing pb-12 sm:pb-16 lg:pb-20">
              <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="max-w-2xl"
                >
                  <div className="premium-badge mb-5 w-fit">
                    <LuSparkles />
                    <span>AI-powered interview prep</span>
                  </div>

                  <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 text-balance sm:text-5xl lg:text-7xl">
                    Ace interviews with{" "}
                    <span className="bg-[linear-gradient(135deg,#ff9324_0%,#f59e0b_45%,#f97316_100%)] bg-clip-text text-transparent animate-text-shine">
                      AI-crafted
                    </span>{" "}
                    prep that feels built for a modern startup.
                  </h2>

                  <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                    Generate role-specific questions, learn through expanded answers, pin important concepts, and keep every session organized in a clean, premium workspace.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={handleCTA} className="premium-button">
                      Get started
                      <LuArrowRight />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          setCurrentPage("signup");
                          setOpenAuthModal(true);
                          return;
                        }
                        navigate("/career-assistant");
                      }}
                      className="premium-button-secondary"
                    >
                      AI Career Assistant Hub
                      <LuArrowRight />
                    </button>

                    <a href="#features" className="premium-button-secondary">
                      Explore features
                    </a>
                  </div>
                  
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {featuredStats.map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                          <Icon className="text-lg" />
                        </span>
                        <p className="text-sm font-medium text-slate-700">{text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
                  className="relative"
                >
                  <div className="absolute -left-6 top-10 hidden rounded-full border border-white/60 bg-white/80 px-4 py-2 shadow-lg shadow-slate-900/10 backdrop-blur-md lg:block">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Live session overview
                    </p>
                  </div>

                  <div className="premium-section overflow-hidden p-3 sm:p-4">
                    <div className="relative overflow-hidden rounded-[24px] bg-slate-950">
                      <img
                        src={HERO_IMG}
                        alt="Interview Prep AI dashboard preview"
                        className="h-[320px] w-full object-cover opacity-90 sm:h-[420px] lg:h-[520px]"
                      />

                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.55)_100%)]" />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          Smooth motion
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          Responsive layout
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
                        {heroStats.map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 text-white backdrop-blur-md"
                          >
                            <div className="text-xl font-semibold">{stat.value}</div>
                            <div className="mt-1 text-xs text-white/80">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="section-spacing pt-4" id="features">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="premium-badge mb-3 w-fit">
                    <LuBadgeCheck />
                    <span>Designed for premium productivity</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    A polished prep system, not just a question generator
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  Built to feel like a modern SaaS product with clean hierarchy, consistent cards, subtle motion, and strong visual feedback.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence>
                  {APP_FEATURES.map((feature, index) => (
                    <motion.article
                      key={feature.id}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.45, delay: index * 0.05 }}
                      className="premium-card hover-lift group p-6"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] text-orange-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <span className="text-sm font-bold">{feature.id}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-950">
                        {feature.title}
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {feature.description}
                      </p>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            <section className="section-spacing">
              <div className="premium-section grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-12">
                <div>
                  <div className="premium-badge mb-4 w-fit">
                    <LuShieldCheck />
                    <span>Accessible, fast, and responsive</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Built to feel calm, premium, and ready for production.
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    The interface now uses consistent cards, soft surfaces, glass effects where appropriate, stronger spacing, and motion that guides attention without overwhelming the user.
                  </p>
                </div>

                <div className="grid gap-3">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-sm"
                    >
                      <div>
                        <div className="text-lg font-semibold text-slate-950">{stat.value}</div>
                        <div className="text-sm text-slate-500">{stat.label}</div>
                      </div>
                      <LuBadgeCheck className="text-xl text-orange-500" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <footer className="pb-8 pt-2 text-center text-sm text-slate-500">
            Made with precision for interview prep teams and solo learners.
            Crafted by <a href="https://www.linkedin.com/in/aniketbarai">Aniket Barai</a>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LandingPage;