import { useEffect } from "react";

export default function useSyncedTimer(socket, setTimeLeft) {

  useEffect(() => {
    if (!socket) return;

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
      const remaining = Number(
        data?.remaining_seconds ?? data?.remaining ?? 0
      );
      setTimeLeft(remaining);
    };

    const handleResumed = (data) => {
      const remaining = Number(
        data?.remaining_seconds ?? data?.remaining ?? 0
      );
      setTimeLeft(remaining);
    };

    socket.on("timer_update", handleTimerUpdate);
    socket.on("auction_paused", handlePaused);
    socket.on("auction_resumed", handleResumed);

    return () => {
      socket.off("timer_update", handleTimerUpdate);
      socket.off("auction_paused", handlePaused);
      socket.off("auction_resumed", handleResumed);
    };

  }, [socket, setTimeLeft]);
}