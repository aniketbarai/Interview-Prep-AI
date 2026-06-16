import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import LoadingMessage from "../../components/Loader/LoadingMessage";
import AIResponsePreview from "./components/AIResponsePreview";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading interview session..."
  );

  const fetchSessionDetailsById = async () => {
    try {
      setLoadingMessage("Loading interview session...");
      setIsLoading(true);

      const res = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (res.data?.session) setSessionData(res.data.session);
    } catch (err) {
      toast.error("Failed to fetch session");
    } finally {
      setIsLoading(false);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setLoadingMessage("Preparing explanation...");
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const res = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      if (res.data) setExplanation(res.data);
    } catch (err) {
      setErrorMsg("Failed to generate explanation.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      setSessionData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === questionId
            ? { ...q, isPinned: !q.isPinned }
            : q
        ),
      }));

      const res = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId),
        { sessionId }
      );

      if (res.data?.success) {
        toast.success("Question updated");
        fetchSessionDetailsById();
      }
    } catch (err) {
      toast.error("Failed to update pin");
      fetchSessionDetailsById();
    }
  };

  const uploadMoreQuestions = async () => {
    if (isLoading) return;
    try {
      setLoadingMessage("Generating AI questions...");
      setIsLoading(true);

      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      const questions = aiResponse.data
        .map((q) => ({
          question:
            typeof q.question === "string"
              ? q.question
              : q.questionText || "",
          answer:
            typeof q.answer === "string"
              ? q.answer
              : q.answerText || "",
        }))
        .filter((q) => q.question && q.answer);

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions,
        }
      );

      if (response.data) {
        toast.success("More Questions Added!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      setErrorMsg("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSessionDetailsById();
  }, [sessionId]);

  return (
    <DashboardLayout>
      {/* Header */}
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      {/* Main */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-6">
        <h2 className="text-base md:text-lg font-semibold mb-4">
          Interview Q & A
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Questions */}
          <div className="md:col-span-8 lg:col-span-7">
            {isLoading && !openLearnMoreDrawer && (
              <LoadingMessage message={loadingMessage} />
            )}

            <AnimatePresence>
              {sessionData?.questions?.map((q, index) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <QuestionCard
                    question={q.question}
                    answer={q.answer}
                    isPinned={q.isPinned}
                    onLearnMore={() =>
                      generateConceptExplanation(q.question)
                    }
                    onTogglePin={() =>
                      toggleQuestionPinStatus(q._id)
                    }
                  />

                  {sessionData?.questions?.length ===
                    index + 1 && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={uploadMoreQuestions}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-neutral-800"
                      >
                        {isLoading ? (
                          <SpinnerLoader size={18} />
                        ) : (
                          <LuListCollapse />
                        )}
                        Load More
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        isOpen={openLearnMoreDrawer}
        onClose={() => setOpenLearnMoreDrawer(false)}
        title={!isLoading && explanation?.title}
      >
        {isLoading && <LoadingMessage message={loadingMessage} />}

        {errorMsg && (
          <p className="flex gap-2 text-sm text-amber-600">
            <LuCircleAlert />
            {errorMsg}
          </p>
        )}

        {!isLoading && explanation && (
          <AIResponsePreview
            content={explanation.explanation}
          />
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default InterviewPrep;