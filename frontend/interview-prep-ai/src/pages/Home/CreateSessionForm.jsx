import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Input from "../../components/Input/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

// API
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Create Session Form
const CreateSessionForm = ({ onClose }) => {

  // Form State
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });

  // Loading State
  const [isLoading, setIsLoading] =
    useState(false);

  // Error State
  const [error, setError] =
    useState("");

  // Navigation
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (
    key,
    value
  ) => {

    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Create Session
  const handleCreateSession =
    async (e) => {

      e.preventDefault();

      const {
        role,
        experience,
        topicsToFocus,
      } = formData;

      // Validation
      if (
        !role ||
        !experience ||
        !topicsToFocus
      ) {

        setError(
          "Please fill all required fields"
        );

        return;
      }

      setError("");
      setIsLoading(true);

      try {

        // Generate AI Questions
        const aiResponse =
          await axiosInstance.post(
            API_PATHS.AI.GENERATE_QUESTIONS,
            {
              role,
              experience,
              topicsToFocus,
              numberOfQuestions: 10,
            }
          );

        // Questions Array
        const generatedQuestions =
          Array.isArray(aiResponse.data)
            ? aiResponse.data
            : [];

        // Create Session
        const response =
          await axiosInstance.post(
            API_PATHS.SESSION.CREATE,
            {
              ...formData,
              questions:
                generatedQuestions,
              numberOfQuestions: 10,
            }
          );

        // Success
        if (
          response.data?.session?._id
        ) {

          // Close Modal
          onClose();

          // Navigate
          navigate(
            `/interview-prep/${response.data.session._id}`
          );
        }

      } catch (error) {

        if (
          error.response &&
          error.response.data.message
        ) {

          setError(
            error.response.data.message
          );

        } else {

          setError(
            "Something went wrong. Please try again."
          );
        }

      } finally {

        setIsLoading(false);
      }
    };

  return (

    // Main Wrapper
    <div
      className="
        w-full
        sm:w-[92vw]
        md:w-[700px]
        lg:w-[850px]
        max-h-[90vh]
        overflow-y-hidden
        bg-white
        rounded-2xl
        p-5 sm:p-7 md:p-8
      "
    >

      {/* Heading */}
      <div className="mb-6">

        <h3 className="text-2xl font-bold text-gray-900">

          Start New Interview Session

        </h3>

        <p className="text-sm text-gray-500 mt-2 leading-6 max-w-2xl">

          Generate AI-powered interview questions
          tailored to your experience, role,
          and preferred topics.

        </p>

      </div>

      {/* Form */}
      <form
        onSubmit={handleCreateSession}
        className="space-y-5"
      >

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Role */}
          <Input
            value={formData.role}

            onChange={({ target }) =>
              handleChange(
                "role",
                target.value
              )
            }

            label="Target Role"

            placeholder="Frontend Developer"

            type="text"
          />

          {/* Experience */}
          <Input
            value={formData.experience}

            onChange={({ target }) =>
              handleChange(
                "experience",
                target.value
              )
            }

            label="Years of Experience"

            placeholder="2"

            type="number"
          />

        </div>

        {/* Topics */}
        <Input
          value={formData.topicsToFocus}

          onChange={({ target }) =>
            handleChange(
              "topicsToFocus",
              target.value
            )
          }

          label="Topics to Focus On"

          placeholder="React, Node.js, MongoDB"

          type="text"
        />

        {/* Description */}
        <div>

          <label className="text-sm font-medium text-gray-700">

            Description

          </label>

          <textarea
            rows={2}

            value={formData.description}

            onChange={({ target }) =>
              handleChange(
                "description",
                target.value
              )
            }

            placeholder="Add any specific goals, notes or interview preferences..."

            className="
              w-full
              mt-2
              px-4 py-3
              border border-gray-200
              rounded-xl
              outline-none
              resize-none
              focus:border-orange-400
              focus:ring-2
              focus:ring-orange-100
              transition-all
            "
          />

        </div>

        {/* Error */}
        {error && (

          <p className="text-sm text-red-500">

            {error}

          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">

          {/* Cancel */}
          <button
            type="button"

            onClick={onClose}

            className="
              w-full sm:w-auto
              px-6 py-3
              rounded-xl
              border border-gray-200
              text-gray-700
              font-medium
              hover:bg-gray-50
              transition-all
            "
          >

            Cancel

          </button>

          {/* Submit */}
          <button
            type="submit"

            disabled={isLoading}

            className="
              w-full sm:w-auto
              min-w-[180px]
              h-12
              flex items-center justify-center
              rounded-xl
              bg-gradient-to-r
              from-[#FF9324]
              to-[#f0a456]
              text-white
              font-semibold
              hover:scale-[1.01]
              transition-all
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >

            {isLoading ? (

              <SpinnerLoader size={22} />

            ) : (

              "Create Session"

            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default CreateSessionForm;