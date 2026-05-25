import React, { useEffect, useState } from "react";

// Icons
import { LuPlus } from "react-icons/lu";

// Navigation
import { useNavigate } from "react-router-dom";

// Date Formatter
import moment from "moment";

// Toast
import { toast } from "react-hot-toast";

// Layout & Components
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

// API
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Card Colors
import { CARD_BG } from "../../utils/data";

// Dashboard Component
const Dashboard = () => {

  // Navigation
  const navigate = useNavigate();

  // Create Modal State
  const [openCreateModal, setOpenCreateModal] =
    useState(false);

  // Sessions State
  const [sessions, setSessions] =
    useState([]);

  // Loading State
  const [isLoading, setIsLoading] =
    useState(false);

  // Delete Modal State
  const [
    openDeleteAlert,
    setOpenDeleteAlert,
  ] = useState({
    open: false,
    data: null,
  });

  // Fetch All Sessions
  const fetchAllSession = async () => {

    try {

      setIsLoading(true);

      const response =
        await axiosInstance.get(
          API_PATHS.SESSION.GET_ALL
        );

      setSessions(
        response.data.sessions || []
      );

    } catch (error) {

      console.error(
        "Error fetching sessions:",
        error
      );

      toast.error(
        "Failed to fetch sessions"
      );

    } finally {

      setIsLoading(false);
    }
  };

  // Delete Session
  const deleteSession = async (
    sessionData
  ) => {

    try {

      await axiosInstance.delete(
        API_PATHS.SESSION.DELETE(
          sessionData._id
        )
      );

      // Remove deleted session from UI
      setSessions((prev) =>
        prev.filter(
          (item) =>
            item._id !== sessionData._id
        )
      );

      // Close modal
      setOpenDeleteAlert({
        open: false,
        data: null,
      });

      toast.success(
        "Session deleted"
      );

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      toast.error(
        "Failed to delete session"
      );
    }
  };

  // Fetch on Mount
  useEffect(() => {

    fetchAllSession();

  }, []);

  return (

    <DashboardLayout>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">

              Interview Sessions

            </h1>

            <p className="text-sm text-gray-500 mt-2">

              Track and manage your AI interview practice sessions.

            </p>

          </div>

          {/* Total Sessions */}
          <div className="bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2.5 rounded-xl text-sm font-semibold w-fit">

            Total Sessions :
            {" "}
            {sessions.length}

          </div>

        </div>

        {/* Loader */}
        {isLoading && (

          <div className="flex justify-center py-20">

            <SpinnerLoader
              size={40}
              text="Loading sessions..."
            />

          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          sessions.length === 0 && (

            <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-white">

              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-5">

                <LuPlus className="text-3xl text-orange-500" />

              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-800">

                No Sessions Found

              </h2>

              <p className="text-sm text-gray-500 mt-3 max-w-sm">

                Create your first interview preparation session.

              </p>

              <button
                onClick={() =>
                  setOpenCreateModal(true)
                }

                className="mt-6 bg-gradient-to-r from-[#FF9324] to-[#f0a456] text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
              >

                Create Session

              </button>

            </div>
          )}

        {/* Sessions Grid */}
        {!isLoading &&
          sessions.length > 0 && (

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

              {sessions.map((data, index) => (

                <SummaryCard
                  key={data?._id}

                  colors={
                    CARD_BG[
                    index %
                    CARD_BG.length
                    ]
                  }

                  role={data?.role || ""}

                  topicsToFocus={
                    data?.topicsToFocus || ""
                  }

                  experience={
                    data?.experience || "-"
                  }

                  questions={
                    data?.questions?.length || "-"
                  }

                  description={
                    data?.description || ""
                  }

                  lastUpdated={
                    data?.updatedAt
                      ? moment(
                        data.updatedAt
                      ).format(
                        "Do MMM YYYY"
                      )
                      : ""
                  }

                  // Open Session
                  onSelect={() =>
                    navigate(
                      `/interview-prep/${data?._id}`
                    )
                  }

                  // Open Delete Modal
                  onDelete={() =>
                    setOpenDeleteAlert({
                      open: true,
                      data,
                    })
                  }
                />

              ))}

            </div>
          )}

        {/* Floating Add Button */}
        <button

          onClick={() =>
            setOpenCreateModal(true)
          }

          className="
            fixed bottom-6 right-5 md:right-10
            flex items-center gap-2
            bg-gradient-to-r
            from-[#FF9324]
            to-[#f0a456]
            text-white
            font-semibold
            px-5 py-3
            rounded-full
            shadow-lg
            hover:scale-105
            transition-all
            z-40
          "
        >

          <LuPlus className="text-xl" />

          <span className="hidden sm:block">

            Add New

          </span>

        </button>

      </div>

      {/* Create Session Modal */}
      <Modal
        isOpen={openCreateModal}

        onClose={() =>
          setOpenCreateModal(false)
        }

        hideHeader
      >

        <CreateSessionForm
          onClose={() =>
            setOpenCreateModal(false)
          }
        />

      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={openDeleteAlert.open}

        onClose={() =>
          setOpenDeleteAlert({
            open: false,
            data: null,
          })
        }

        hideHeader
      >

        <DeleteAlertContent

          content="Are you sure you want to delete this interview session?"

          onDelete={() =>
            deleteSession(
              openDeleteAlert.data
            )
          }
        />

      </Modal>

    </DashboardLayout>
  );
};

export default Dashboard;