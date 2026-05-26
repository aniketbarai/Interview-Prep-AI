import React, { useState, useEffect, useRef } from "react";
import {
  LuChevronDown,
  LuPin,
  LuPinOff,
  LuSparkles,
} from "react-icons/lu";
import AIResponsePreview from "../../pages/InterviewPrep/components/AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  // adjust height dynamically
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="group bg-white rounded-lg mb-4 overflow-hidden py-5 px-4 sm:px-5 shadow-sm border border-gray-100">
      
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 cursor-pointer">
        
        {/* QUESTION */}
        <div className="flex items-start gap-3">
          <span className="text-xs md:text-sm font-semibold text-gray-400">
            Q
          </span>

          <h3
            onClick={toggleExpand}
            className="text-sm md:text-[15px] font-medium text-gray-800 leading-snug"
          >
            {question}
          </h3>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3 ml-2">

          {/* PIN BUTTON */}
          <button
            onClick={onTogglePin}
            className="
              flex items-center gap-1
              text-xs font-medium
              px-2 sm:px-3 py-1
              rounded
              text-indigo-700 bg-indigo-50
              border border-indigo-100
              hover:border-indigo-300
              transition
            "
          >
            {isPinned ? (
              <LuPinOff className="text-xs" />
            ) : (
              <LuPin className="text-xs" />
            )}
          </button>

          {/* LEARN MORE BUTTON (FIXED RESPONSIVE) */}
          <button
            onClick={() => {
              setIsExpanded(true);
              onLearnMore();
            }}
            className="
              flex items-center gap-1
              text-xs font-medium
              px-2 sm:px-3 py-1
              rounded
              text-cyan-700 bg-cyan-50
              border border-cyan-100
              hover:border-cyan-300
              transition
            "
          >
            <LuSparkles />

            {/* text only on desktop */}
            <span className="hidden sm:inline">Learn</span>
          </button>

          {/* TOGGLE */}
          <button
            onClick={toggleExpand}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <LuChevronDown
              size={20}
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ANSWER SECTION */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${height}px` }}
      >
        <div
          ref={contentRef}
          className="mt-4 text-gray-700 bg-gray-50 px-4 sm:px-5 py-3 rounded-lg"
        >
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;