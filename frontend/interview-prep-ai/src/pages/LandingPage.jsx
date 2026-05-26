import React, { useContext, useState } from "react";
import HERO_IMG from "../assets/HERO_IMG.jpg";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";

import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // auth modal state
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("signup");

  // CTA button handler
  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* MAIN PAGE */}
      <div className="w-full min-h-screen bg-[#fffcef] relative overflow-x-hidden">

        {/* background blur effect */}
        <div className="w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />

        {/* container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-5 pt-6 pb-[120px] relative z-10">

          {/* HEADER */}
          <header className="flex justify-between items-center mb-10 md:mb-16">
            <div className="text-lg md:text-xl font-bold text-black">
              Interview Prep AI
            </div>

            {/* login/profile button */}
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-[#ff9324] to-[#e99a4b] text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* HERO SECTION */}
          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* LEFT CONTENT */}
            <div className="w-full md:w-1/2">

              {/* badge */}
              <div className="flex items-center gap-2 text-[12px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300 w-fit mb-4">
                <LuSparkles /> AI Powered
              </div>

              {/* heading */}
              <h1 className="text-3xl md:text-5xl text-black font-medium leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)]">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            {/* RIGHT CONTENT */}
            <div className="w-full md:w-1/2">

              <p className="text-base md:text-[17px] text-gray-900 mb-6">
                Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparation to mastery — your ultimate interview toolkit is here.
              </p>

              <button
                className="bg-black text-sm font-semibold text-white px-6 md:px-7 py-2.5 rounded-full hover:bg-yellow-100 hover:text-black transition"
                onClick={handleCTA}
              >
                Get Started
              </button>

            </div>
          </div>
        </div>

        {/* HERO IMAGE */}
        <section className="flex justify-center md:mt-0 px-4">
          <img
            src={HERO_IMG}
            alt="Hero"
            className="w-full md:w-[80vw] rounded-lg shadow-lg"
          />
        </section>

        {/* FEATURES SECTION */}
        <div className="bg-[#fffcef] mt-10">

          <div className="container mx-auto px-4 py-12 md:py-20">

            <h2 className="text-xl md:text-2xl font-medium text-center mb-10 md:mb-12">
              Features That Make You Shine
            </h2>

            {/* FEATURES GRID */}
            <div className="flex flex-col items-center gap-8">

              {/* top 3 features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#fffef8] p-5 md:p-6 rounded-xl border border-amber-100 shadow-sm hover:shadow-lg transition"
                  >
                    <h3 className="text-base font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* remaining features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#fffef8] p-5 md:p-6 rounded-xl border border-amber-100 shadow-sm hover:shadow-lg transition"
                  >
                    <h3 className="text-base font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-sm text-center p-5 bg-gray-50 text-gray-600">
          Made with 💘 • Happy Coding
        </div>
      </div>

      {/* AUTH MODAL */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;