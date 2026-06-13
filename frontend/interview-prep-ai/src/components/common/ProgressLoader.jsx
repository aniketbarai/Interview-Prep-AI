import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCheck, LuSparkles, LuInfo, LuRefreshCw } from "react-icons/lu";

const DEFAULT_STATUS = "Analyzing your request...";

/**
 * Premium, polished Presentational AI Progress Loader.
 */
const ProgressLoader = ({
  isLoading = false,
  title = "AI Assistant",
  progress = 0,
  status = DEFAULT_STATUS,
  estimatedTime = null,
  type = "default",
  fullscreen = true,
  success = false,
  error = null,
  onRetry = null,
}) => {
  // Constrain progress cleanly between 0 and 100
  const safeProgress = useMemo(() => {
    if (!Number.isFinite(progress)) return 0;
    return Math.max(0, Math.min(100, progress));
  }, [progress]);

  const [displayProgress, setDisplayProgress] = useState(safeProgress);

  // Smooth out rapid number updates for the percentage text ticker
  useEffect(() => {
    if (!isLoading) return;
    if (success) {
      setDisplayProgress(100);
      return;
    }

    let animationFrameId;
    const startValue = displayProgress;
    const endValue = safeProgress;
    const duration = 250; // ms
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      // Ease out quad formula for smooth decelerating number ticking
      const easeOutQuad = progressRatio * (2 - progressRatio);
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuad;
      setDisplayProgress(currentValue);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [safeProgress, isLoading, success]);

  // Unified theme mappings
  const theme = useMemo(() => {
    switch (type) {
      case "resume":
        return {
          bar: "from-sky-500 via-cyan-400 to-teal-400",
          ring: "ring-cyan-500/20",
          badge: "bg-cyan-50/90 border-cyan-200 text-cyan-700 dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-300",
        };
      case "interview":
        return {
          bar: "from-violet-500 via-fuchsia-400 to-pink-400",
          ring: "ring-fuchsia-500/20",
          badge: "bg-fuchsia-50/90 border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:border-fuchsia-800 dark:text-fuchsia-300",
        };
      case "advisor":
        return {
          bar: "from-amber-500 via-orange-400 to-red-400",
          ring: "ring-orange-500/20",
          badge: "bg-orange-50/90 border-orange-200 text-orange-700 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300",
        };
      case "project":
        return {
          bar: "from-emerald-500 via-teal-400 to-cyan-400",
          ring: "ring-emerald-500/25",
          badge: "bg-emerald-50/90 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300",
        };
      default:
        return {
          bar: "from-indigo-500 via-purple-500 to-pink-500",
          ring: "ring-indigo-500/20",
          badge: "bg-indigo-50/90 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300",
        };
    }
  }, [type]);

  // Derived sub-step state to replace redundant secondary progress bar
  const subStatusText = useMemo(() => {
    if (error) return "Execution halted";
    if (success || safeProgress >= 100) return "AI response ready";
    if (safeProgress > 75) return "Refining and formatting...";
    if (safeProgress > 40) return "Synthesizing context...";
    return "AI is thinking...";
  }, [safeProgress, success, error]);

  const overlayClass = fullscreen
    ? "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/50 backdrop-blur-md"
    : "relative w-full my-4";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="ai-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={overlayClass}
          role="status"
          aria-live={error ? "assertive" : "polite"}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-3xl border border-white/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_32px_90px_-20px_rgba(15,23,42,0.25)] dark:shadow-[0_32px_90px_-20px_rgba(0,0,0,0.6)] overflow-hidden relative"
          >
            <div className="p-6 space-y-5">
              
              {/* Header Info Block */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${theme.badge} text-xs font-semibold shadow-sm`}>
                    <LuSparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span className="truncate">{title}</span>
                  </div>
                  <div className="mt-3 min-h-[40px] flex items-center">
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {!error && <span className="inline-block w-2 h-2 rounded-full bg-current motion-safe:animate-ping mr-2 vertical-middle align-middle" />}
                      {status}
                    </p>
                  </div>
                </div>

                {/* Percentage Ticker Card */}
                <div className={`shrink-0 rounded-2xl border border-slate-200/50 bg-white/90 dark:bg-slate-800/90 px-4 py-2.5 text-right shadow-sm ring-4 ${theme.ring}`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Progress</div>
                  <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {success ? 100 : Math.round(displayProgress)}%
                  </div>
                </div>
              </div>

              {/* Progress Track & Details */}
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/50 overflow-hidden p-[2px]">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${success ? 100 : safeProgress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-medium px-0.5">
                  <span className="text-slate-400 dark:text-slate-500">
                    {safeProgress < 100 && !success ? `${Math.round(safeProgress)}% configured` : "Completed"}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {estimatedTime ? (
                      <span>
                        Est. remaining: <strong className="font-semibold text-slate-800 dark:text-white">{typeof estimatedTime === "number" ? `${estimatedTime}s` : estimatedTime}</strong>
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-normal">{success ? "Done" : "Processing"}</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Sub-status contextual bar */}
              <div className="rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between px-4 py-2.5 transition-all duration-300">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {safeProgress < 100 && !success ? "Current Step" : "Status"}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                  {subStatusText}
                </div>
              </div>

              {/* Error Panel Accordion */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 5 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 5 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <LuInfo className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" size={16} />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-rose-800 dark:text-rose-300">Something went wrong</div>
                          <div className="text-xs text-rose-700 dark:text-rose-400 mt-1 break-words leading-relaxed">{error}</div>
                        </div>
                      </div>
                      {typeof onRetry === "function" && (
                        <button
                          type="button"
                          onClick={onRetry}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold py-2 px-4 transition shadow-sm border border-rose-700/20"
                        >
                          <LuRefreshCw size={14} />
                          Retry Operation
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Corner floating success check mark indicator */}
            <AnimatePresence>
              {success && (
                <motion.div
                  key="success-badge"
                  initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute top-4 right-4 z-10"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <LuCheck className="text-white" size={16} strokeWidth={3} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressLoader;