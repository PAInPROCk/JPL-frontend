import { useEffect, useRef } from "react";

/**
 * useSyncedTimer
 * Keeps local timer synchronized with server time updates from Socket.IO.
 * 
 * ✅ Works with both raw numbers and structured objects ({ remaining_seconds }).
 * ✅ Auto-pauses and resumes with "auction_paused"/"auction_resumed" events.
 * ✅ Smoothly decrements client-side between server updates.
 */
export default function useSyncedTimer(socket, setTimeLeft, isPaused = false) {
  const lastUpdateRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleTimerUpdate = (payload) => {
      if (!payload) return;
      const remaining = Number(
        payload.remaining_seconds ?? payload.time_left ?? payload.remaining ?? payload ?? 0
      );

      if (Number.isNaN(remaining)) return;

      setTimeLeft(remaining);
      lastUpdateRef.current = Date.now();
    };

    const handlePaused = (data) => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      const remaining = Number(data?.remaining ?? data?.remaining_seconds ?? 0);
      setTimeLeft(remaining);
    };

    const handleResumed = (data) => {
      const remaining = Number(data?.remaining ?? data?.remaining_seconds ?? 0);
      setTimeLeft(remaining);
    };

    // Register events
    socket.on("timer_update", handleTimerUpdate);
    socket.on("auction_paused", handlePaused);
    socket.on("auction_resumed", handleResumed);

    // Smooth client-side countdown to prevent flicker between server updates
    if (!isPaused && !timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    // Cleanup
    return () => {
      socket.off("timer_update", handleTimerUpdate);
      socket.off("auction_paused", handlePaused);
      socket.off("auction_resumed", handleResumed);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [socket, isPaused, setTimeLeft]);
}
