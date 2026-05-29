import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  maxWidth = "max-w-md",
}) => {
  
  // Lock background body scroll when modal is mounted/open
  useEffect(() => {
    if (isOpen) {
      // Save current inline overflow styles if any exist
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Prevent scrolling on the background layout body
      document.body.style.overflow = "hidden";
      
      // Clean up function: Restore original scrolling properties when modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalComponent = (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative 
          w-full 
          ${maxWidth} 
          max-h-[85vh] 
          bg-white
          border border-slate-200/60
          shadow-[0_32px_90px_-20px_rgba(15,23,42,0.35)] 
          rounded-[24px] 
          overflow-hidden 
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()} 
      >
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <h3 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>
        )}

        <button
          type="button"
          className="
            absolute top-4 right-4 z-20
            text-slate-400 
            hover:bg-slate-100 
            hover:text-slate-800 
            rounded-full 
            w-8 h-8 
            flex items-center justify-center
            transition-colors duration-200
          "
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>

        {/* This container can scroll safely if the form contents are long */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(modalComponent, document.body);
};

export default Modal;