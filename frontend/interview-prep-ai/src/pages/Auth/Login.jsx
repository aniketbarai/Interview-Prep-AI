import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCircleAlert } from "react-icons/lu";

import Input from "../../components/Input/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import GoogleButton from "./GoogleButton";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        {
          email,
          password,
        }
      );

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (loginError) {
      setError(
        loginError?.response?.data?.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed to a clean structural block so it relies perfectly on the Modal animations
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="premium-badge mb-4 w-fit">
          Welcome back
        </div>

        <h3 className="text-2xl font-semibold text-slate-950 tracking-tight">
          Sign in to continue
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Access your sessions, notes, and AI-powered interview practice.
        </p>
      </div>

      {/* Google Login */}
      <div className="flex flex-col items-center gap-4">
        <GoogleButton />

        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          or continue with email
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email address"
          placeholder="john@example.com"
          type="email"
          autoComplete="email"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
          autoComplete="current-password"
        />

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <LuCircleAlert className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="premium-button w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading && (
            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
          )}
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Loading Text */}
        {isLoading && (
          <p className="text-center text-xs text-slate-500 animate-pulse">
            Verifying your credentials...
          </p>
        )}

        {/* Toggle to Signup */}
        <p className="pt-2 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => setCurrentPage("signup")}
            className="font-semibold text-orange-600 underline decoration-orange-200 underline-offset-4 transition hover:text-orange-700"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;