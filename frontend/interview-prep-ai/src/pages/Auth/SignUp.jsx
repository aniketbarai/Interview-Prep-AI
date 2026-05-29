import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCircleAlert } from "react-icons/lu";

import Input from "../../components/Input/Input";
import ProfilePhoto from "../../components/Input/ProfilePhoto";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import GoogleButton from "./GoogleButton";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      let profileImageUrl = "";

      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes?.imageUrl || "";
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: fullName,
          email,
          password,
          profileImageUrl,
        }
      );

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (signupError) {
      setError(
        signupError?.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed from motion.div to a clean structural wrapper for layout stability
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="premium-badge mb-4 w-fit">
          Create your account
        </div>

        <h3 className="text-2xl font-semibold text-slate-950 tracking-tight">
          Start your interview prep
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Build your profile, save sessions, and unlock role-specific AI practice.
        </p>
      </div>

      {/* Google Signup */}
      <div className="flex flex-col items-center gap-4">
        <GoogleButton />

        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          or sign up with email
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="mt-6">
        {/* Profile */}
        <div className="mb-6 flex justify-center">
          <ProfilePhoto image={profilePic} setImage={setProfilePic} />
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full name"
              placeholder="John Doe"
              type="text"
              autoComplete="name"
            />
          </div>

          <div>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email address"
              placeholder="john@example.com"
              type="email"
              autoComplete="email"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
              autoComplete="new-password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="md:col-span-2 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <LuCircleAlert className="mt-0.5 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action System */}
          <div className="md:col-span-2 space-y-3 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="premium-button w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && (
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              )}
              {isLoading ? "Creating account..." : "Sign up"}
            </button>

            {/* Loading Text */}
            {isLoading && (
              <p className="text-center text-xs text-slate-500 animate-pulse">
                Creating your account securely...
              </p>
            )}

            {/* Link back to login */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setCurrentPage("login")}
                className="font-semibold text-orange-600 underline decoration-orange-200 underline-offset-4 transition hover:text-orange-700"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;