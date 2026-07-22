import { useEffect, useRef } from "react";

export default function useSyncedTimer(socket, setTimeLeft) {
  const isPausedRef = useRef(false);

  useEffect(() => {
    // ⏱️ Smooth 1-second local countdown interval on the client
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    if (!socket) {
      return () => clearInterval(interval);
    }

    const handleTimerUpdate = (payload) => {
      if (!payload) return;

      const remaining = Number(
        payload.remaining_seconds ??
        payload.time_left ??
        payload.remaining ??
        0
      );

      if (!Number.isNaN(remaining)) {
        setTimeLeft(remaining);
      }
    };

    const handlePaused = (data) => {
      isPausedRef.current = true;
      const remaining = Number(
        data?.remaining_seconds ?? data?.remaining ?? 0
      );
      setTimeLeft(remaining);
    };

    const handleResumed = (data) => {
      isPausedRef.current = false;
      const remaining = Number(
        data?.remaining_seconds ?? data?.remaining ?? 0
      );
      setTimeLeft(remaining);
    };

    socket.on("timer_update", handleTimerUpdate);
    socket.on("auction_paused", handlePaused);
    socket.on("auction_resumed", handleResumed);

    return () => {
      clearInterval(interval);
      socket.off("timer_update", handleTimerUpdate);
      socket.off("auction_paused", handlePaused);
      socket.off("auction_resumed", handleResumed);
    };

  }, [socket, setTimeLeft]);
}