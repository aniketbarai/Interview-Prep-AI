import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCheck, LuInfo, LuSparkles } from "react-icons/lu";




const DEFAULT_STATUS = "Analyzing your request...";

/**
 * Presentational AI-style progress loader.
 *
 * Props:
 * - isLoading: boolean
 * - title: string
 * - progress: number (0..100)
 * - status: string
 * - estimatedTime: string | number
 * - type: string (color/theme key)
 * - fullscreen: boolean
 * - success: boolean
 */
const ProgressLoader = ({
  isLoading = false,
  title = "🤖 AI Assistant",
  progress = 0,
  status = DEFAULT_STATUS,
  estimatedTime = null,
  type = "default",
  fullscreen = true,
  success = false,
  error = null,
  onRetry = null,
}) => {
  const safeProgress = useMemo(() => {
    if (!Number.isFinite(progress)) return 0;
    return Math.max(0, Math.min(100, progress));
  }, [progress]);

  const [displayProgress, setDisplayProgress] = useState(safeProgress);

  useEffect(() => {
    // Smoothly animate the displayed number if parent updates rapidly.
    // This avoids sudden jumps.
    if (!isLoading && success) {
      setDisplayProgress(100);
      return;
    }
    setDisplayProgress(safeProgress);
  }, [safeProgress, isLoading, success]);

  const theme = useMemo(() => {
    // Tailwind classes (kept conservative for compatibility)
    switch (type) {
      case "resume":
        return {
          bar: "from-sky-500 via-cyan-400 to-teal-400",
          ring: "ring-cyan-500/30",
          badge: "bg-cyan-50/90 border-cyan-200/80 text-cyan-700",
        };
      case "interview":
        return {
          bar: "from-violet-500 via-fuchsia-400 to-pink-400",
          ring: "ring-fuchsia-500/30",
          badge: "bg-fuchsia-50/90 border-fuchsia-200/80 text-fuchsia-700",
        };
      case "advisor":
        return {
          bar: "from-amber-500 via-orange-400 to-red-400",
          ring: "ring-orange-500/30",
          badge: "bg-orange-50/90 border-orange-200/80 text-orange-700",
        };
      case "project":
        return {
          bar: "from-emerald-500 via-teal-400 to-cyan-400",
          ring: "ring-emerald-500/25",
          badge: "bg-emerald-50/90 border-emerald-200/80 text-emerald-700",
        };
      default:
        return {
          bar: "from-sky-500 via-cyan-400 to-teal-400",
          ring: "ring-cyan-500/30",
          badge: "bg-orange-50/90 border-orange-200/80 text-orange-700",
        };
    }
  }, [type]);

  const overlayClass = fullscreen
    ? "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-md"
    : "relative w-full";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="ai-progress"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={overlayClass}
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={
              "w-full max-w-lg rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_32px_90px_-20px_rgba(15,23,42,0.35)] overflow-hidden"
            }
          >
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${theme.badge} text-xs font-semibold shadow-sm backdrop-blur-sm`}>
                    <LuSparkles className="text-current" />
                    <span className="truncate">{title}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-slate-700 font-medium">
                      <span className={"inline-block animate-pulse"}>•</span> {status}
                    </p>
                  </div>
                </div>

                <div className={`shrink-0 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-right ${theme.ring}`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Progress</div>
                  <motion.div
                    key={Math.round(displayProgress)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl font-extrabold text-slate-900"
                  >
                    {success ? 100 : Math.round(displayProgress)}%
                  </motion.div>

                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2.5 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${success ? 100 : safeProgress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{safeProgress < 100 ? `${safeProgress}%` : "Completed"}</span>
                  <span className="font-semibold text-slate-700">
                    {estimatedTime ? (
                      <span>
                        Estimated: {typeof estimatedTime === "number" ? `${estimatedTime}s` : estimatedTime}
                      </span>
                    ) : (
                      <span className="text-slate-500">{success ? "Done" : "Working"}</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="h-[32px] rounded-xl bg-white/60 border border-slate-200/50 flex items-center px-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-600">
                        {safeProgress < 100 ? "In progress" : "Finalizing"}
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        {safeProgress < 100 ? "AI is thinking..." : "AI response ready"}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div
                        className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50"
                        aria-hidden="true"
                      >
                        <motion.div
                          className={`h-full bg-gradient-to-r ${theme.bar}`}
                          initial={{ width: 0, opacity: 0.8 }}
                          animate={{
                            width: `${success ? 100 : safeProgress}%`,
                            opacity: success ? 1 : 0.95,
                          }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      key="success-check"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.22 }}
                      className="absolute -top-3 -right-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-200 flex items-center justify-center shadow-sm">
                        <motion.div
                          initial={{ rotate: -20, scale: 0.6 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        >
                          <LuCheck className="text-emerald-600" size={18} />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <LuAlertCircle className="text-rose-600" size={18} />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-rose-800">Something went wrong</div>
                        <div className="text-sm text-rose-700 mt-1 break-words">{error}</div>
                      </div>
                    </div>
                    {typeof onRetry === "function" && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={onRetry}
                          className="premium-button-secondary w-full"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressLoader;

