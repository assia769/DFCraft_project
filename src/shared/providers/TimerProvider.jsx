import { useEffect, useState, useRef } from "react";
import { TimerContext } from "../context/TimerContext";
import { browserAPI } from "../utils/browserAPI";

export function TimerProvider({ children }) {
  const [time, setTime] = useState(1500);
  const [originalTime, setOriginalTime] = useState(1500); // Add this
  const [workTime, setWorkTime] = useState(1500);
  const [breakTime, setBreakTime] = useState(300);
  const [longBreakTime, setLongBreakTime] = useState(900);
  const [phaseType, setPhaseType] = useState("work");
  const [isRunning, setIsRunning] = useState(false);
  const [reset, setReset] = useState(false);
  const [sessionCount, setSessionCount] = useState(0)

  const isInitialized = useRef(false); // ✅ Prevent initial sync
  const isMounted = useRef(true);

  // Load from background ONCE on mount
  useEffect(() => {
    console.log("🔵 TimerProvider mounting...");

    const loadTimer = async () => {
      try {
        console.log("📞 Requesting timer data...");
        const res = await browserAPI.runtime.sendMessage({ type: "GET_TIMER" });
        console.log("📥 Received:", res);

        if (res && isMounted.current) {
          setTime(res.time);
          setOriginalTime(res.originalTime);
          setWorkTime(res.workTime);
          setBreakTime(res.breakTime);
          setLongBreakTime(res.longBreakTime);
          setPhaseType(res.phaseType);
          setIsRunning(res.isRunning);
          setSessionCount(res.sessionCount);
          isInitialized.current = true; // ✅ Now safe to sync
          console.log("✅ State initialized:", res);
        }
      } catch (error) {
        console.error("❌ Failed to load timer:", error);
      }
    };

    loadTimer();

    // Listen for updates
    const listener = (message) => {
      if (message.type === "TIMER_TICK") {
        setTime(message.data.time);
        setIsRunning(message.data.isRunning);
      } else if (message.type === "PHASE_CHANGE") {
        // Phase switched in background
        setTime(message.data.time);
        setOriginalTime(message.data.originalTime);
        setPhaseType(message.data.phaseType);
        setIsRunning(message.data.isRunning);
        setSessionCount(message.data.sessionCount);
      }
    };

    browserAPI.runtime.onMessage.addListener(listener);

    return () => {
      isMounted.current = false;
      browserAPI.runtime.onMessage.removeListener(listener);
      console.log("🔴 TimerProvider unmounting");
    };
  }, []); // ✅ Only run once on mount

  // Sync to background (ONLY after initialization and when user changes state)
  useEffect(() => {
    if (!isInitialized.current) {
      console.log("⏭️ Skipping sync - not initialized yet");
      return;
    }

    const syncTimer = async () => {
      try {
        console.log("🔄 SYNCING to background:", {
          time,
          isRunning,
          originalTime,
          workTime,
          breakTime,
          longBreakTime,
          phaseType,
          sessionCount
        });
        await browserAPI.runtime.sendMessage({
          type: "UPDATE_TIMER",
          data: {
            time,
            originalTime,
            workTime,
            breakTime,
            longBreakTime,
            phaseType,
            isRunning,
            sessionCount
          },
        });
        console.log("✅ Sync complete");
      } catch (error) {
        console.error("❌ Failed to sync timer:", error);
      }
    };

    syncTimer();
  }, [time, originalTime, workTime, breakTime, longBreakTime, phaseType, isRunning, sessionCount]);

  // Handle reset
  useEffect(() => {
    if (reset) {
      console.log("🔄 RESET triggered");
      setTime(originalTime);
      setSessionCount(0);
      setIsRunning(false);
    }
  }, [reset, originalTime]);

  return (
    <TimerContext.Provider
      value={{
        time,
        setTime,
        isRunning,
        setIsRunning,
        reset,
        setReset,
        originalTime,
        setOriginalTime,
        workTime,
        setWorkTime,
        breakTime,
        setBreakTime,
        longBreakTime,
        setLongBreakTime,
        phaseType,
        setPhaseType,
        sessionCount,
        setSessionCount,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
