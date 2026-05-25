import React from "react";

// =====================================================
// ROLE INFO HEADER COMPONENT
// Shows:
// - Role
// - Topics
// - Experience
// - Total Questions
// - Last Updated Date
// =====================================================

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {

  // =====================================================
  // CONVERT EXPERIENCE INTO NUMBER
  // Prevents issues like:
  // "1" == 1
  // =====================================================
  const exp = Number(experience);

  return (

    // =====================================================
    // MAIN WRAPPER
    // relative -> needed for absolute animated blobs
    // overflow-hidden -> prevents blobs overflow
    // =====================================================
    <div className="bg-white relative overflow-hidden border-b border-gray-100 px-10">

      <div className="container mx-auto px-6 md:px-0">

        {/* =================================================
            CONTENT SECTION
        ================================================= */}
        <div className="min-h-[220px] flex flex-col justify-center relative z-10 py-10">

          {/* ===============================================
              ROLE & TOPICS
          =============================================== */}
          <div className="flex items-start justify-between">

            <div className="max-w-2xl">

              {/* ROLE */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">

                {role || "Frontend Developer"}

              </h2>

              {/* TOPICS */}
              <p className="text-sm md:text-base font-medium text-gray-600 mt-3 leading-relaxed">

                {topicsToFocus || "React, Node.js, MongoDB"}

              </p>

              {/* DESCRIPTION */}
              {description && (
                <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-xl">

                  {description}

                </p>
              )}

            </div>

          </div>

          {/* ===============================================
              INFO BADGES
          =============================================== */}
          <div className="flex flex-wrap items-center gap-3 mt-6">

            {/* EXPERIENCE */}
            <div className="text-xs font-semibold text-white bg-black px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform">

              Experience :
              {" "}
              {experience}
              {" "}
              {exp === 1 ? "Year" : "Years"}

            </div>

            {/* QUESTIONS */}
            <div className="text-xs font-semibold text-white bg-black px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform">

              {questions}
              {" "}
              Q&A

            </div>

            {/* LAST UPDATED */}
            <div className="text-xs font-semibold text-white bg-black px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform">

              Last Updated:
              {" "}
              {lastUpdated}

            </div>

          </div>
        </div>

        {/* =================================================
            ANIMATED BACKGROUND BLOBS
            absolute -> floats in background
            blur -> glowing effect
        ================================================= */}
        <div className="w-[45vw] md:w-[28vw] h-[220px] flex items-center justify-center absolute top-0 right-0 opacity-80">

          {/* LIME BLOB */}
          <div className="w-20 h-20 bg-lime-400 blur-[75px] animate-blob1"></div>

          {/* TEAL BLOB */}
          <div className="w-20 h-20 bg-teal-400 blur-[75px] animate-blob2"></div>

          {/* CYAN BLOB */}
          <div className="w-20 h-20 bg-cyan-300 blur-[60px] animate-blob3"></div>

          {/* PINK BLOB */}
          <div className="w-20 h-20 bg-fuchsia-400 blur-[60px] animate-blob1"></div>

        </div>

      </div>
    </div>
  );
};

export default RoleInfoHeader;