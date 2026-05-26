import React, { useEffect, useState } from "react";

// Icons
import { LuPlus } from "react-icons/lu";

// Navigation
import { useNavigate } from "react-router-dom";

// Date
import moment from "moment";

// Toast
import { toast } from "react-hot-toast";

// Layout & Components
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import LoadingMessage from "../../components/Loader/LoadingMessage";

// API
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Colors
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

  // fetch sessions
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

  // delete session
  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(
        API_PATHS.SESSION.DELETE(sessionData._id)
      );

      setSessions((prev) =>
        prev.filter((item) => item._id !== sessionData._id)
      );

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
      {/* PAGE WRAPPER */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 pb-24">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">

          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Interview Sessions
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your AI interview practice sessions
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm w-fit">
            Total: {sessions.length}
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <LoadingMessage message="Loading interview session..." />
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && sessions.length === 0 && (
          <div className="text-center py-16 border border-dashed rounded-xl bg-white">
            <div className="w-14 h-14 mx-auto bg-orange-100 flex items-center justify-center rounded-full mb-4">
              <LuPlus className="text-2xl text-orange-500" />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold">
              No Sessions Yet
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Create your first interview session to start practicing
            </p>

            <button
              onClick={() => setOpenCreateModal(true)}
              className="mt-5 bg-orange-500 text-white px-5 py-2 rounded-lg hover:scale-105 transition"
            >
              Create Session
            </button>
          </div>
        )}

        {/* GRID */}
        {!isLoading && sessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {sessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
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
                onSelect={() =>
                  navigate(`/interview-prep/${data?._id}`)
                }
                onDelete={() =>
                  setOpenDeleteAlert({ open: true, data })
                }
              />
            ))}
          </div>
        )}

        {/* FLOAT BUTTON */}
        <button
          onClick={() => setOpenCreateModal(true)}
          className="fixed bottom-5 right-5 sm:right-10 flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          <LuPlus className="text-xl" />
          <span className="hidden sm:block">Add New</span>
        </button>
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <CreateSessionForm onClose={() => setOpenCreateModal(false)} />
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        hideHeader
      >
        <DeleteAlertContent
          content="Are you sure you want to delete this session?"
          onDelete={() => deleteSession(openDeleteAlert.data)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;