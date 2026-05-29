import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowRight, LuLayoutGrid, LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import LoadingMessage from "../../components/Loader/LoadingMessage";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CARD_BG } from "../../utils/data";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const stats = useMemo(
    () => [
      {
        label: "Total sessions",
        value: sessions.length,
        accent: "from-orange-50 to-amber-50",
      },
      {
        label: "Pinned workflow",
        value: sessions.reduce(
          (count, session) =>
            count + (session?.questions?.filter((q) => q?.isPinned)?.length || 0),
          0
        ),
        accent: "from-sky-50 to-cyan-50",
      },
      {
        label: "Practice depth",
        value: `${sessions.reduce(
          (count, session) => count + (session?.questions?.length || 0),
          0
        )} Qs`,
        accent: "from-emerald-50 to-teal-50",
      },
    ],
    [sessions]
  );

  const fetchAllSession = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions || []);
    } catch (error) {
      toast.error("Failed to fetch sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionData) => {
    if (!sessionData?._id) return;

    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData._id));

      setSessions((prev) => prev.filter((item) => item._id !== sessionData._id));
      setOpenDeleteAlert({ open: false, data: null });
      toast.success("Session deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchAllSession();
  }, []);

  return (
    <DashboardLayout>
      <div className="pb-24">
        {/* Dashboard Title Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="premium-section mb-8 overflow-hidden px-5 py-6 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="premium-badge mb-4 w-fit">
                <LuLayoutGrid />
                <span>Interview session dashboard</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Build, revisit, and refine every interview prep session.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Keep your sessions organized in one premium workspace. Open a card to continue practicing, pin the questions that matter, or launch a fresh prep flow in seconds.
              </p>
            </div>

            {/* Performance Stats Cards Group */}
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border border-white/80 bg-gradient-to-br ${stat.accent} px-4 py-4 shadow-sm`}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Dynamic Context Processing Area */}
        {isLoading && (
          <div className="py-14">
            <LoadingMessage message="Loading interview sessions..." />
          </div>
        )}

        {!isLoading && sessions.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="premium-card mx-auto max-w-3xl p-6 text-center sm:p-10"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] text-orange-600 shadow-sm">
              <LuPlus className="text-3xl" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-950">
              No sessions yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Create your first interview session to generate role-specific questions, save your progress, and start practicing in a polished workflow.
            </p>

            <button
              type="button"
              onClick={() => setOpenCreateModal(true)}
              className="premium-button mt-6"
            >
              Create session
              <LuArrowRight />
            </button>
          </motion.section>
        )}

        {!isLoading && sessions.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {sessions.map((data, index) => (
                <motion.div
                  key={data?._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
                >
                  <SummaryCard
                    colors={CARD_BG[index % CARD_BG.length]}
                    role={data?.role}
                    topicsToFocus={data?.topicsToFocus}
                    experience={data?.experience}
                    questions={data?.questions?.length}
                    description={data?.description}
                    lastUpdated={
                      data?.updatedAt
                        ? moment(data.updatedAt).format("Do MMM YYYY")
                        : ""
                    }
                    onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                    onDelete={() => setOpenDeleteAlert({ open: true, data })}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Global Fixed Creation Action Floating Trigger */}
        <button
          type="button"
          onClick={() => setOpenCreateModal(true)}
          className="fixed bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-22px_rgba(15,23,42,0.8)] transition-all duration-200 hover:-translate-y-1 hover:bg-slate-900 sm:right-8"
        >
          <LuPlus className="text-lg" />
          <span className="hidden sm:inline">Add new</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* GLOBAL MODAL ISOLATION ARCHITECTURE LAYER                 */}
      {/* ========================================================= */}
      <AnimatePresence>
        {/* A. Session Creation Flow Sheet Form Window */}
        {openCreateModal && (
          <Modal
            isOpen={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            hideHeader
            maxWidth="max-w-2xl"
          >
            <CreateSessionForm onClose={() => setOpenCreateModal(false)} />
          </Modal>
        )}

        {/* B. Destructive Alert Deletion Dialog Block Box */}
        {openDeleteAlert.open && (
          <Modal
            isOpen={openDeleteAlert.open}
            onClose={() => setOpenDeleteAlert({ open: false, data: null })}
            hideHeader
            maxWidth="max-w-md"
          >
            <DeleteAlertContent
              content="Are you sure you want to delete this session?"
              onDelete={() => deleteSession(openDeleteAlert.data)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;