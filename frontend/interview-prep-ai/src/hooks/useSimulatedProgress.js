import { useEffect, useMemo, useRef, useState } from "react";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/**
 * Simulated AI progress.
 * - Fast to 60
 * - Medium to 85
 * - Slow to 95
 * - Hold at 95 until API response (caller calls onComplete)
 * - Animate 95->100 after completion
 *
 * Usage:
 * const { progress, status, estimatedTime, success, start, stopWithError, complete } = useSimulatedProgress(...)
 */
export default function useSimulatedProgress({
  messages = [],
  startOnMount = false,
  minIntervalMs = 90,
  maxIntervalMs = 140,
} = {}) {
  const [isRunning, setIsRunning] = useState(startOnMount);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  const statusMap = useMemo(() => {
    const safe = Array.isArray(messages) ? messages : [];
    // Normalize to [{ at:number, text:string }]
    return safe
      .map((m, idx) => ({
        at: typeof m?.at === "number" ? m.at : [0, 25, 50, 75][idx] ?? 0,
        text: m?.text || "",
      }))
      .filter((m) => m.text);
  }, [messages]);


  const timersRef = useRef({});

  const status = useMemo(() => {
    if (!statusMap || statusMap.length === 0) return "Analyzing your request...";
    return statusMap[statusIndex]?.text || statusMap[statusMap.length - 1]?.text;
  }, [statusMap, statusIndex]);


  const setTimer = (key, id) => {
    timersRef.current[key] = id;
  };

  const clearAllTimers = () => {
    const t = timersRef.current;
    Object.keys(t).forEach((k) => {
      try {
        clearInterval(t[k]);
      } catch (e) {}
      try {
        clearTimeout(t[k]);
      } catch (e) {}
    });
    timersRef.current = {};
  };

  useEffect(() => {
    if (!isRunning) return;

    setError(null);
    setSuccess(false);
    setProgress((p) => (Number.isFinite(p) ? clamp(p, 0, 95) : 0));
    setStatusIndex(0);

    const tick = () => {
      setProgress((prev) => {
        const p = clamp(prev, 0, 95);
        // Never exceed 95 while waiting.
        if (p >= 95) return 95;

        // Make movement feel continuous: slightly larger increments near 60,
        // and keep a small drift through 95% so it never feels stuck.
        const inc = (() => {
          if (p < 60) {
            // Fast 0-60
            return 1.1 + Math.random() * 2.2;
          }
          if (p < 85) {
            // Medium 60-85
            return 0.65 + Math.random() * 1.4;
          }
          // Slow 85-95 (keep it moving)
          return 0.35 + Math.random() * 0.85;
        })();

        return clamp(p + inc, 0, 95);
      });
    };

    const intervalMs = Math.round(minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs));
    const id = setInterval(tick, intervalMs);
    setTimer("progressInterval", id);

    // Estimated time: just for UI realism.
    // Reset on start.
    setEstimatedTime("~2m-5min");

    return () => {
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // Drive status based on progress.
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    if (!isRunning && !success) return;

    const p = progress;
    let i = 0;
    for (let k = 0; k < messages.length; k++) {
      if (p >= (messages[k].at ?? 0)) i = k;
    }
    setStatusIndex(i);
  }, [progress, messages, isRunning, success]);

  const start = () => {
    clearAllTimers();
    setSuccess(false);
    setError(null);
    setProgress(0);
    setStatusIndex(0);
    setEstimatedTime("~4s");
    setIsRunning(true);
  };

  const onComplete = async () => {
    // Caller indicates API response received.
    // Stop interval and animate 95->100.
    setError(null);

    clearAllTimers();
    setIsRunning(false);
    setSuccess(false);

    // Ensure we are at 95 (hold state). Then animate.
    setProgress((p) => {
      const base = clamp(p, 0, 95);
      // Nudge forward a tiny bit so the UI doesn't look frozen at exactly 95
      // while we animate to 100.
      return clamp(base + 0.15, 0, 95);
    });


    // Use the latest progress value from closure; caller's UI should keep passing
    // the same hook instance while API request is pending.
    const startFrom = clamp(progress, 0, 95);

    const duration = 420 + Math.random() * 280; // 400-700ms
    const startedAt = Date.now();

    let resolved = false;

    await new Promise((resolve) => {
      // Ensure we always finish even if timers get throttled / tab is backgrounded.
      const hardTimeoutId = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        setProgress(100);
        resolve();
      }, duration + 250);

      setTimer("completeHardTimeout", hardTimeoutId);

      const id = setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const t = clamp(elapsed / duration, 0, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - t, 3);
        const next = clamp(startFrom + (100 - startFrom) * eased, 0, 100);
        setProgress(next);

        if (t >= 1) {
          if (resolved) return;
          resolved = true;
          clearInterval(id);
          try {
            clearTimeout(hardTimeoutId);
          } catch (_) {}
          resolve();
        }
      }, 40);
      setTimer("completeAnimInterval", id);
    });

    setProgress(100);
    setSuccess(true);
  };

  const stopWithError = (msg) => {
    clearAllTimers();
    setIsRunning(false);
    setSuccess(false);
    setError(msg || "Failed to generate response");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return {
    isRunning,
    progress,
    status,
    estimatedTime,
    success,
    error,
    start,
    onComplete,
    stopWithError,
    setEstimatedTime,
    setError,
  };
}

