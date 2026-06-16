import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from '@vercel/speed-insights/react';

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import CareerAssistantHub from "./pages/CareerAssistant/CareerAssistantHub";
import InterviewCoachPage from "./pages/CareerAssistant/pages/InterviewCoachPage";
import ResumeReviewerPage from "./pages/CareerAssistant/pages/ResumeReviewerPage";
import ProjectReviewerPage from "./pages/CareerAssistant/pages/ProjectReviewerPage";
import CareerAdvisorPage from "./pages/CareerAssistant/pages/CareerAdvisorPage";
import HRInterviewerPage from "./pages/CareerAssistant/pages/HRInterviewerPage";
import UserProvider, { UserContext } from "./context/userContext";


import SpinnerLoader from "./components/Loader/SpinnerLoader";

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path="/interview-prep/:sessionId"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <InterviewPrep />
            </motion.div>
          }
        />
        <Route
          path="/career-assistant"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <CareerAssistantHub />
            </motion.div>
          }
        />
        <Route
          path="/career-assistant/interview"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <InterviewCoachPage />
            </motion.div>
          }
        />
        <Route
          path="/career-assistant/resume"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ResumeReviewerPage />
            </motion.div>
          }
        />
        <Route
          path="/career-assistant/project"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ProjectReviewerPage />
            </motion.div>
          }
        />
        <Route
          path="/career-assistant/roadmap"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <CareerAdvisorPage />
            </motion.div>
          }
        />
        <Route
          path="/career-assistant/hr"
          element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <HRInterviewerPage />
            </motion.div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />


      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { loading } = useContext(UserContext);

  if (loading) {
    return <SpinnerLoader fullscreen text="Warming up your workspace..." />;
  }

  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: "13px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.96)",
            color: "#0f172a",
            boxShadow: "0 18px 50px -26px rgba(15,23,42,0.38)",
            border: "1px solid rgba(148,163,184,0.25)",
          },
        }}
      />
      <SpeedInsights />
    </UserProvider>
  );
};

export default App;
