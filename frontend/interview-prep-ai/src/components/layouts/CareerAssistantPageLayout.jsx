import React from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

const CareerAssistantPageLayout = ({ title, subtitle, children, rightSlot }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-transparent">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-7xl">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => navigate("/career-assistant")}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
              >
                <LuArrowLeft className="text-base" />
                <span>Back to Career Assistant</span>
              </button>

              <div className="mt-3 space-y-2">
                {title ? (
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 break-words">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="text-xs leading-5 text-slate-500 max-w-2xl font-medium break-words">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CareerAssistantPageLayout;

