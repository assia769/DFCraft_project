import { useTimer } from "../../shared/hooks/useTimer";
import { Play, Square, Pause } from "lucide-react";
import { useState, useEffect } from "react";

export default function Timer() {
  const { time, setTime, isRunning, setIsRunning, reset, setReset, originalTime, setOriginalTime } = useTimer();
  const [min, setMin] = useState(Math.floor(time / 60));
  const [sec, setSec] = useState(time % 60);

  useEffect(() => {
    if (!isRunning && time === originalTime) {
      setMin(Math.floor(originalTime / 60));
      setSec(originalTime % 60);
    }
  }, [time, isRunning, originalTime]);

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const percentage = originalTime > 0 ? (time / originalTime) * 100 : 0; // Change this to control completion (0-100)
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  const selectWorkTime = () => {
    const validMin = Math.max(0, Math.floor(min));
    const validSec = Math.max(0, Math.min(59, Math.floor(sec)));
    const validTime = validMin * 60 + validSec;

    if (validTime > 0) {
      setTime(validTime);
      setIsRunning(true);
      setOriginalTime(validTime);
    }
  };

  

  const timerControllers = () => {
    return isRunning ? (
      <>
        <Pause color="blue" onClick={() => setIsRunning(false)} />
      </>
    ) : (
      <>
        <Play color="blue" onClick={() => selectWorkTime()} />
        {time < originalTime && <Square color="blue" onClick={() => setReset(true)} />}
      </>
    );
  };

  useEffect(() => {
    if (reset) {
      setTime(originalTime); // Reset to whatever user set
      setMin(Math.floor(originalTime / 60));
      setSec(originalTime % 60);
      setIsRunning(false);
      setReset(false);
    }
  }, [reset, originalTime]);

  return (
    <div className="flex justify-center bg-blue-200 p-5">
      <div className="relative">
        {/* Background circle */}
        <div className="w-52 h-52 rounded-full flex justify-center items-center">
          {isRunning ? (
            <p className="text-blue-700 text-lg font-semibold">
              {formatTime(time)}
            </p>
          ) : time === originalTime ? (
            <p className="text-blue-700 text-lg font-semibold flex justify-center">
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value) || 0)}
                className="w-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              :
              <input
                type="number"
                value={sec}
                onChange={(e) => setSec(Number(e.target.value) || 0)}
                className="w-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </p>
          ) : (
            <p className="text-blue-700 text-lg font-semibold">
              {formatTime(time)}
            </p>
          )}
        </div>
        <div className="flex justify-center mt-4">{timerControllers()}</div>

        {/* Progress border */}
        <svg className="absolute top-0 left-0 w-52 h-52 -rotate-90 pointer-events-none">
          <circle
            cx="104"
            cy="104"
            r={radius}
            fill="none"
            stroke="blue"
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
      </div>
    </div>
  );
}
