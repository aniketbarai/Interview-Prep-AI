import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { signInWithGoogle } from "../../services/authServices";

const GoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const userData = await signInWithGoogle();
      if (userData?.token) {
        updateUser(userData);
        toast.success("Logged in with Google");
        navigate("/dashboard");
      } else {
        toast.error("Google login succeeded but no token was returned.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      type="button"
      disabled={isLoading}
      onClick={handleGoogleLogin}
      className="
        w-full h-12 mt-4 px-4
        rounded-xl border border-gray-200
        bg-white flex items-center justify-center gap-3
        text-sm font-medium text-gray-700
        shadow-sm
        hover:bg-gray-50 hover:border-gray-300
        transition-all
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          <span>Signing you in...</span>
        </>
      ) : (
        <>
          <GoogleIcon />
          <span>Continue with Google</span>
        </>
      )}
    </motion.button>
  );
};

// Separate component (cleaner + reusable)
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-5 h-5"
  >
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5.2C29.1 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.5 16.3 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.3-6.1 6.8l6.1 5.2C39.9 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

export default GoogleButton;