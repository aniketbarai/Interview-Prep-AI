import React from "react";

const LoadingMessage = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-6 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.25)] text-center transition-all duration-500 ease-out animate-pulse">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-slate-400 animate-spin" />
        </div>

        <p className="max-w-xs text-sm sm:text-base font-medium text-slate-700 tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingMessage;
