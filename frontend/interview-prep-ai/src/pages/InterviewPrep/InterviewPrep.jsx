import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

// Framer motion for smooth animations
import { AnimatePresence, motion } from "framer-motion";

// Icons
import {
  LuCircleAlert,
  LuListCollapse,
} from "react-icons/lu";

// Toast notification
import { toast } from "react-hot-toast";

// Layout & Components
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import AIResponsePreview from "./components/AIResponsePreview";

// API & Axios
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const InterviewPrep = () => {

  // -----------------------------
  // GET SESSION ID FROM URL
  // Example:
  // /interview-prep/12345
  // sessionId = 12345
  // -----------------------------
  const { sessionId } = useParams();

  // -----------------------------
  // STORE COMPLETE SESSION DATA
  // -----------------------------
  const [sessionData, setSessionData] = useState(null);

  // -----------------------------
  // STORE ERROR MESSAGE
  // -----------------------------
  const [errorMsg, setErrorMsg] = useState("");

  // -----------------------------
  // DRAWER OPEN/CLOSE STATE
  // -----------------------------
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] =
    useState(false);

  // -----------------------------
  // STORE AI GENERATED EXPLANATION
  // -----------------------------
  const [explanation, setExplanation] = useState(null);

  // -----------------------------
  // GLOBAL LOADING STATE
  // -----------------------------
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // FETCH SESSION DETAILS
  // =========================================================
  const fetchSessionDetailsById = async () => {

    try {

      // API CALL
      const res = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      // SAVE SESSION DATA
      if (res.data?.session) {
        setSessionData(res.data.session);
      }

    } catch (err) {

      console.error(
        "Fetch session error:",
        err
      );

      toast.error("Failed to fetch session");

    }
  };

  // =========================================================
  // GENERATE AI EXPLANATION
  // =========================================================
  const generateConceptExplanation = async (
    question
  ) => {

    try {

      // RESET STATES
      setErrorMsg("");
      setExplanation(null);

      // START LOADING
      setIsLoading(true);

      // OPEN DRAWER
      setOpenLearnMoreDrawer(true);

      // API CALL
      const res = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      // SAVE EXPLANATION
      if (res.data) {
        setExplanation(res.data);
      }

    } catch (err) {

      setErrorMsg(
        "Failed to generate explanation."
      );

      console.error(err);

    } finally {

      // STOP LOADING
      setIsLoading(false);
    }
  };

  // =========================================================
  // PIN / UNPIN QUESTION
  // =========================================================
  const toggleQuestionPinStatus = async (
    questionId
  ) => {

    try {

      // ---------------------------------------
      // OPTIMISTIC UI UPDATE
      // Instantly updates UI before API success
      // ---------------------------------------
      setSessionData((prev) => ({
        ...prev,

        questions: prev.questions.map((q) =>

          q._id === questionId
            ? {
              ...q,
              isPinned: !q.isPinned,
            }
            : q
        ),
      }));

      // API CALL
      const res = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId),
        { sessionId }
      );

      if (res.data?.success) {

        toast.success(
          "Question pin updated"
        );

        // REFRESH DATA
        fetchSessionDetailsById();
      }

    } catch (err) {

      toast.error(
        "Failed to update pin"
      );

      console.error(
        "Pin error:",
        err
      );

      // ROLLBACK DATA
      fetchSessionDetailsById();
    }
  };

  // =========================================================
  // LOAD MORE QUESTIONS
  // =========================================================
  const uploadMoreQuestions = async () => {

    try {

      setIsLoading(true);

      // ---------------------------------------
      // GENERATE QUESTIONS USING AI
      // ---------------------------------------
      const aiResponse =
        await axiosInstance.post(
          API_PATHS.AI.GENERATE_QUESTIONS,
          {
            role: sessionData?.role,
            experience:
              sessionData?.experience,
            topicsToFocus:
              sessionData?.topicsToFocus,
            numberOfQuestions: 10,
          }
        );

      const generatedQuestions =
        aiResponse.data;

      // ---------------------------------------
      // FORMAT QUESTIONS
      // Ensures backend gets correct structure
      // ---------------------------------------
      const questions =
        generatedQuestions
          .map((q) => ({
            question:
              typeof q.question ===
                "string"
                ? q.question
                : q.questionText || "",

            answer:
              typeof q.answer ===
                "string"
                ? q.answer
                : q.answerText || "",
          }))

          // REMOVE INVALID QUESTIONS
          .filter(
            (q) =>
              q.question &&
              q.answer
          );

      // ---------------------------------------
      // ADD QUESTIONS TO SESSION
      // ---------------------------------------
      const response =
        await axiosInstance.post(
          API_PATHS.QUESTION.ADD_TO_SESSION,
          {
            sessionId,
            questions,
          }
        );

      // SUCCESS
      if (response.data) {

        toast.success(
          "More Questions Added!"
        );

        fetchSessionDetailsById();
      }

    } catch (error) {

      if (
        error.response &&
        error.response.data.message
      ) {

        setErrorMsg(
          error.response.data.message
        );

      } else {

        setErrorMsg(
          "Something went wrong"
        );
      }

    } finally {

      setIsLoading(false);
    }
  };

  // =========================================================
  // FETCH SESSION ON COMPONENT LOAD
  // =========================================================
  useEffect(() => {

    if (sessionId) {
      fetchSessionDetailsById();
    }

  }, [sessionId]);

  // =========================================================
  // UI
  // =========================================================
  return (

    <DashboardLayout>

      {/* =======================================
          TOP ROLE INFORMATION
      ======================================= */}
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={
          sessionData?.topicsToFocus || ""
        }
        experience={
          sessionData?.experience || "-"
        }
        questions={
          sessionData?.questions?.length || "-"
        }
        description={
          sessionData?.description || ""
        }
        lastUpdated={
          sessionData?.updatedAt
            ? moment(
              sessionData.updatedAt
            ).format("Do MMM YYYY")
            : ""
        }
      />

      {/* =======================================
          MAIN CONTENT
      ======================================= */}
      <div className="container mx-auto pb-6 pt-6 px-6">

        <h2 className="text-lg font-semibold">
          Interview Q & A
        </h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">

          {/* ===================================
              QUESTION LIST
          =================================== */}
          <div
            className={`col-span-12 ${openLearnMoreDrawer
                ? "md:col-span-7"
                : "md:col-span-8"
              }`}
          >

            <AnimatePresence>

              {sessionData?.questions?.map(
                (q, index) => (

                  <motion.div
                    key={q._id}

                    className="group"

                    // ENTRY ANIMATION
                    initial={{
                      opacity: 0,
                      y: -20,
                    }}

                    // ACTIVE ANIMATION
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    // EXIT ANIMATION
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}

                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.05,
                    }}

                    layout
                  >

                    <>
                      {/* =========================
                          QUESTION CARD
                      ========================= */}
                      <QuestionCard
                        question={q.question}
                        answer={q.answer}
                        isPinned={q.isPinned}

                        onLearnMore={() =>
                          generateConceptExplanation(
                            q.question
                          )
                        }

                        onTogglePin={() =>
                          toggleQuestionPinStatus(
                            q._id
                          )
                        }
                      />

                      {/* =========================
                          LOAD MORE BUTTON
                      ========================= */}
                      {!isLoading &&
                        sessionData?.questions
                          ?.length ===
                        index + 1 && (

                          <div className="flex items-center justify-center mt-5">

                            <button
                              className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 rounded cursor-pointer hover:bg-neutral-800 transition-all"

                              disabled={isLoading}

                              onClick={
                                uploadMoreQuestions
                              }
                            >

                              {isLoading ? (
                                <SpinnerLoader />
                              ) : (
                                <LuListCollapse className="text-lg" />
                              )}

                              Load More

                            </button>

                          </div>
                        )}
                    </>

                  </motion.div>
                )
              )}

            </AnimatePresence>

          </div>
        </div>

        {/* =======================================
            AI EXPLANATION DRAWER
        ======================================= */}
        <Drawer
          isOpen={openLearnMoreDrawer}

          onClose={() =>
            setOpenLearnMoreDrawer(false)
          }

          title={
            !isLoading &&
            explanation?.title
          }
        >

          {/* LOADER */}
          {isLoading && (
            <SpinnerLoader />
          )}

          {/* ERROR */}
          {errorMsg && (
            <p className="flex gap-2 text-sm text-amber-600 font-medium">

              <LuCircleAlert className="mt-1" />

              {errorMsg}

            </p>
          )}

          {/* AI RESPONSE */}
          {!isLoading &&
            explanation && (
              <AIResponsePreview
                content={
                  explanation.explanation
                }
              />
            )}

        </Drawer>

      </div>

    </DashboardLayout>
  );
};

export default InterviewPrep;