import { useEffect, useRef } from "react";

/**
 * Keeps timer perfectly in sync with backend's 1s updates.
 * Adjusts for latency, prevents duplicate intervals, and smoothly decrements.
 */
export default function useSyncedTimer(socket, setTimeLeft) {
  const timerRef = useRef(null);

  useEffect(() => {
    const handleTimerUpdate = (data) => {
      const serverRemaining = Number(data.remaining_seconds ?? 0);
      const serverTime = new Date(data.server_time).getTime();
      const clientTime = Date.now();

      // Estimate latency (in seconds)
      const latency = (clientTime - serverTime) / 1000;

      // Adjust timer using latency correction
      const correctedRemaining = Math.max(0, serverRemaining - latency);

      // Clear any previous interval
      if (timerRef.current) clearInterval(timerRef.current);

      // Immediately sync to backend time
      setTimeLeft(correctedRemaining);

      // Start local countdown — ticks every 1s
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    };

    // Listen to backend updates
    socket.on("timer_update", handleTimerUpdate);

    // Cleanup on unmount
    return () => {
      socket.off("timer_update", handleTimerUpdate);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [socket, setTimeLeft]);
}
