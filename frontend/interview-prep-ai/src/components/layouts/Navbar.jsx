import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuMenu, LuPanelTopClose, LuSparkles } from "react-icons/lu";

import ProfileInfoCard from "../Cards/ProfileInfoCard";

// Cleaned up core classes to work reliably across viewports and active state transitions
const navLinkClass = ({ isActive }) => {
  const baseClasses = "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 block text-center md:inline-block";
  
  // 📱 Mobile styles are the baseline, 💻 Desktop overrides happen at md: breakpoints
  const activeClasses = "bg-black text-white md:bg-slate-900 md:text-white md:shadow-lg md:shadow-slate-900/20";
  const inactiveClasses = "text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 md:bg-transparent md:text-slate-600 md:hover:bg-slate-100 md:hover:text-slate-900";
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 8);
      setIsVisible(currentScrollY < 20 || currentScrollY < lastScrollY || currentScrollY < 120);
      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const shellClass = useMemo(
    () =>
      [
        "sticky top-0 z-40 transition-all duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full",
      ].join(" "),
    [isVisible]
  );

  return (
    <motion.header
      className={shellClass}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div
        className={[
          "border-b",
          isScrolled
            ? "glass-surface border-white/60 bg-white/80"
            : "border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="page-shell flex h-16 items-center justify-between gap-3">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-transform duration-200 group-hover:scale-105">
              <LuSparkles className="text-lg" />
            </div>
            <div className="leading-tight">
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Interview Prep AI
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Interview workspace
              </p>
            </div>
          </Link>

          {/* 💻 Desktop Navigation Menu */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/dashboard" className={navLinkClass} end>
              Dashboard
            </NavLink>
          </nav>

          {/* 💻 Desktop Action System Profile Card */}
          <div className="hidden items-center gap-4 md:flex">
            <ProfileInfoCard compact />
          </div>

          {/* 📱 Mobile Drawer Menu Hamburger/X Button */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-900 shadow-sm transition-transform duration-200 hover:scale-105 md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <LuPanelTopClose className="text-xl" /> : <LuMenu className="text-xl" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              // Changed background completely to solid pure black (bg-slate-950)
              className="border-zinc-80 px-4 py-5 backdrop-blur-xl md:hidden shadow-xl"
            >
              <div className="flex flex-col gap-4">
                <NavLink to="/dashboard" className={navLinkClass} end>
                  Dashboard
                </NavLink>
                
                {/* Embedded Profile Area customized for premium presentation inside the dark mobile theme */}
                <div className="rounded-2xl border border-zinc-800 p-3 text-white">
                  <ProfileInfoCard compact />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;