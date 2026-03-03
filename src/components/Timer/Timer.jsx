import { useTimer } from "../../shared/hooks/useTimer";
import { CirclePlay, Square, Pause } from "lucide-react";
import { useState, useEffect } from "react";

export default function Timer() {
  const {
    time,
    setTime,
    isRunning,
    setIsRunning,
    reset,
    setReset,
    originalTime,
    setOriginalTime,
    setWorkTime,
    breakTime,
    setBreakTime,
    longBreakTime,
    setLBTime,
    setPhaseType,
  } = useTimer();

  const [min, setMin] = useState(Math.floor(time / 60));
  const [bMin, setBMin] = useState(Math.floor(breakTime / 60));
  const [lbMin, setLBMin] = useState(Math.floor(longBreakTime / 60));
  const [desable, setDesable] = useState(true);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      setMin(Math.floor(originalTime / 60));
      setBMin(Math.floor(breakTime / 60));
      setLBMin(Math.floor(breakTime / 60));
    }
  }, [time, isRunning, originalTime, breakTime]);

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const percentage = originalTime > 0 ? (time / originalTime) * 67 : 0; // Change this to control completion (0-100)
  const radius = 115;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  const selectPomodoroTime = () => {
    setDesable(false);
    // Always start from work phase at beginning
    if (time === originalTime) {
      setPhaseType("work");

      // Read work time from inputs
      const validMin = Math.max(0, Math.floor(min));
      const validWorkTime = validMin * 60;

      // Read break time from inputs
      const validBMin = Math.max(0, Math.floor(bMin));
      const validBreakTime = validBMin * 60;
      
      // Read long break time from inputs
      const validLBMin = Math.max(0, Math.floor(lbMin));
      const validLongBreakTime = validLBMin * 60;

      if (validWorkTime > 0) {
        setWorkTime(validWorkTime);
        setBreakTime(validBreakTime);
        setTime(validWorkTime);
        setOriginalTime(validWorkTime);
        setLBTime(validLongBreakTime);
        setLBTime(validLongBreakTime);
      } else {
        alert("Work time must be greater than 0 seconds.");
      }
    }

    // Start timer (whether fresh start or resume)
    setIsRunning(true);
  };

  const timerControllers = () => {
    return isRunning ? (
      <>
        <Pause
          className="text-lightElements dark:text-darkElements"
          onClick={() => {
            setIsRunning(false);
            setPause(true);
          }}
        />
      </>
    ) : (
      <>
        <CirclePlay
          className="text-lightElements dark:text-darkElements w-14 h-14"
          onClick={() => selectPomodoroTime()}
        />
        {pause && (
          <Square
            className="text-lightElements dark:text-darkElements"
            onClick={() => {
              setReset(true);
              setDesable(true);
              setPause(false);
            }}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    if (reset) {
      setTime(originalTime); // Reset to whatever user set
      setMin(Math.floor(originalTime / 60));
      setIsRunning(false);
      setReset(false);
    }
  }, [reset, originalTime, setTime, setIsRunning, setReset]);

  return (
    <div className="flex flex-col items-center justify-center bg-light dark:bg-dark">
      <div className="relative">
        {/* Background circle */}
        {/* Background circle */}
        <div className="w-80 h-32 rounded-full flex justify-center items-center mt-[108px]">
          {isRunning ? (
            <p
              className={`text-lightElements dark:bg-darkElements text-lg font-semibold`}
            >
              {formatTime(time)}
            </p>
          ) : time === originalTime ? (
            <div className="flex flex-col items-center">
              <p className="text-lightElements dark:text-darkElements text-5xl font-semibold flex justify-center p-1">
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value) || 0)}
                  className="w-[52px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-light dark:bg-dark"
                />
                :
                <input
                  type="number"
                  value={bMin}
                  onChange={(e) => setBMin(Number(e.target.value) || 0)}
                  className="w-[52px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-light dark:bg-dark"
                />
                :
                <input
                  type="number"
                  value={lbMin}
                  onChange={(e) => setLBMin(Number(e.target.value) || 0)}
                  className="w-[52px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-light dark:bg-dark"
                />
              </p>
            </div>
          ) : (
            <p
              className={`text-lightElements dark:bg-darkElements text-lg font-semibold`}
            >
              {formatTime(time)}
            </p>
          )}
        </div>

        {/* Progress border */}
        <svg className="absolute top-4 left-0 w-80 h-80 rotate-[149.5deg] pointer-events-none">
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            strokeWidth="17"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500 stroke-lightElements dark:stroke-darkElements"
          />
        </svg>
      </div>
      <div className="flex justify-center gap-4">{timerControllers()}</div>
    </div>
  );
}
