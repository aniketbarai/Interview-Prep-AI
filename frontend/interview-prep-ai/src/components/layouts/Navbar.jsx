import React from "react";
import ProfileInfoCard from "../Cards/ProfileInfoCard";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200/60 backdrop-blur-sm sticky top-0 z-30">

      {/* Container */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-full">

        {/* Logo */}
        <Link to="/dashboard">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-black leading-5">
            Interview Prep AI
          </h2>
        </Link>

        {/* Profile */}
        <ProfileInfoCard />

      </div>
    </div>
  );
};

export default Navbar;