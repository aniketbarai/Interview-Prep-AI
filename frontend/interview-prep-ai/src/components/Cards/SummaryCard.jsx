import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className="
        bg-white 
        border border-gray-200 
        rounded-xl 
        shadow-sm 
        hover:shadow-lg 
        transition 
        duration-200 
        overflow-hidden 
        cursor-pointer
      "
    >
      {/* TOP SECTION */}
      <div
        className="relative rounded-t-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4"
        style={{ background: colors.bgcolor }}
      >
        {/* INITIALS */}
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-md flex items-center justify-center">
          <span className="text-base sm:text-lg font-semibold text-black">
            {getInitials(role)}
          </span>
        </div>

        {/* CONTENT */}
        <div className="flex-grow min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-black truncate">
            {role}
          </h2>

          <p className="text-xs sm:text-sm text-gray-800 mt-1 line-clamp-2">
            {topicsToFocus}
          </p>
        </div>

        {/* DELETE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="
            absolute top-3 right-3 
            flex items-center gap-1 
            text-xs font-medium 
            text-rose-600 
            bg-rose-50 
            px-2 py-1 
            rounded 
            border border-rose-200 
            hover:border-rose-300 
            transition
          "
        >
          <LuTrash2 size={14} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          
          <div className="text-xs font-medium text-gray-800 px-3 py-1 border border-gray-300 rounded-full">
            Experience: {experience} {experience == 1 ? "Year" : "Years"}
          </div>

          <div className="text-xs font-medium text-gray-800 px-3 py-1 border border-gray-300 rounded-full">
            {questions} Q&A
          </div>

          <div className="text-xs font-medium text-gray-800 px-3 py-1 border border-gray-300 rounded-full">
            Last Updated: {lastUpdated}
          </div>
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-gray-600 mt-3 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;