import React from "react";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="page-shell pb-16 pt-6 sm:pt-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
