import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  const exp = Number(experience);

  return (
    <div className="bg-white relative overflow-hidden border-b border-gray-100 px-4 md:px-10">

      <div className="container mx-auto">

        {/* Content */}
        <div className="min-h-[200px] flex flex-col justify-center relative z-10 py-8 md:py-10">

          {/* Title Section */}
          <div className="max-w-3xl">

            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
              {role || "Frontend Developer"}
            </h2>

            <p className="text-sm md:text-base font-medium text-gray-600 mt-3">
              {topicsToFocus || "React, Node.js, MongoDB"}
            </p>

            {description && (
              <p className="text-xs md:text-sm text-gray-500 mt-4 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 md:gap-3 mt-6">

            <div className="text-[11px] md:text-xs font-semibold text-white bg-black px-3 md:px-4 py-1.5 rounded-full">
              Experience: {experience} {exp === 1 ? "Year" : "Years"}
            </div>

            <div className="text-[11px] md:text-xs font-semibold text-white bg-black px-3 md:px-4 py-1.5 rounded-full">
              {questions} Q&A
            </div>

            <div className="text-[11px] md:text-xs font-semibold text-white bg-black px-3 md:px-4 py-1.5 rounded-full">
              Updated: {lastUpdated}
            </div>

          </div>
        </div>

        {/* Background blobs (hidden on small screens to avoid overlap) */}
        <div className="hidden md:flex w-[30vw] h-[200px] absolute top-0 right-0 items-center justify-center opacity-70">

          <div className="w-16 h-16 bg-lime-400 blur-[70px] animate-blob1"></div>
          <div className="w-16 h-16 bg-teal-400 blur-[70px] animate-blob2"></div>
          <div className="w-16 h-16 bg-cyan-300 blur-[60px] animate-blob3"></div>
          <div className="w-16 h-16 bg-fuchsia-400 blur-[60px] animate-blob1"></div>

        </div>

      </div>
    </div>
  );
};

export default RoleInfoHeader;