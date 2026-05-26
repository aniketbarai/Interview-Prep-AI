import React from "react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      
      {/* Modal Box */}
      <div className="
        relative 
        w-full 
        max-w-[95vw] 
        sm:max-w-[90vw] 
        md:max-w-[700px] 
        lg:max-w-[850px]
        max-h-[90vh] 
        bg-white 
        shadow-lg 
        rounded-2xl 
        overflow-hidden 
        flex flex-col
      ">

        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <h3 className="text-base md:text-lg font-medium text-gray-900">
              {title}
            </h3>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          className="
            absolute top-3 right-3 
            text-gray-400 
            hover:bg-orange-100 
            hover:text-gray-900 
            rounded-lg 
            w-8 h-8 
            flex items-center justify-center
            transition
          "
          onClick={onClose}
        >
          <svg
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;