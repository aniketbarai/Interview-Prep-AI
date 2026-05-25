import React from "react";

// =====================================================
// SPINNER LOADER COMPONENT
//
// FEATURES:
// - Reusable
// - Responsive size
// - Fullscreen overlay mode
// - Accessible
// - Smooth animation
// =====================================================

const SpinnerLoader = ({
  fullscreen = false,
  size = 20,
  text = "",
}) => {

  // ===================================================
  // DYNAMIC SIZE
  // Example:
  // size={30}
  // width = 30px
  // height = 30px
  // ===================================================
  const spinnerSize = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (

    // =================================================
    // WRAPPER
    //
    // fullscreen:
    // Creates a blurred fullscreen overlay
    //
    // normal:
    // Centers spinner normally
    // =================================================
    <div
      className={`

        ${
          fullscreen

            ? `
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/30 backdrop-blur-sm
            `

            : `
              flex items-center justify-center
            `
        }

      `}

      // Accessibility
      role="status"

      aria-live="polite"
    >

      {/* ===============================================
          LOADER CONTAINER
      =============================================== */}
      <div className="flex flex-col items-center gap-3">

        {/* =============================================
            SVG SPINNER
        ============================================= */}
        <svg
          aria-hidden="true"

          style={spinnerSize}

          className="
            animate-spin
            text-orange-200
            fill-orange-500
            drop-shadow-sm
          "

          viewBox="0 0 100 101"

          xmlns="http://www.w3.org/2000/svg"
        >

          {/* ===========================================
              BACKGROUND CIRCLE
          =========================================== */}
          <path
            d="
              M100 50.5908
              C100 78.2051 77.6142 100.591
              50 100.591
              C22.3858 100.591 0 78.2051
              0 50.5908
              C0 22.9766 22.3858 0.59082
              50 0.59082
              C77.6142 0.59082 100 22.9766
              100 50.5908Z
            "

            fill="currentColor"
          />

          {/* ===========================================
              ACTIVE SPINNER PART
          =========================================== */}
          <path
            d="
              M93.9676 39.0409
              C96.203 38.4038 97.0079 35.904
              95.7905 33.7559

              C94.1311 30.8201 91.9548 28.1404
              89.3404 25.7977

              C85.5478 22.3861 80.9324 19.9579
              75.8906 18.7296
            "

            fill="currentFill"
          />

        </svg>

        {/* =============================================
            OPTIONAL LOADING TEXT
        ============================================= */}
        {text && (
          <p className="text-sm font-medium text-gray-600 animate-pulse">

            {text}

          </p>
        )}

      </div>

      {/* ===============================================
          SCREEN READER TEXT
          Hidden visually but useful for accessibility
      =============================================== */}
      <span className="sr-only">

        Loading...

      </span>

    </div>
  );
};

export default SpinnerLoader;