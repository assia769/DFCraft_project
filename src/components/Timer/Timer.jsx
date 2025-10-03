import { useTimer } from "../../shared/hooks/useTimer";
import { Play, Square, Pause } from "lucide-react";
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
    workTime,
    setWorkTime,
    breakTime,
    setBreakTime,
    phaseType,
    setPhaseType,
  } = useTimer();


  const [min, setMin] = useState(Math.floor(time / 60));
  const [sec, setSec] = useState(time % 60);
  const [bMin, setBMin] = useState(Math.floor(breakTime / 60));
  const [bSec, setBSec] = useState(breakTime % 60);


  const color = phaseType === "work" ? "blue" : "green";

  useEffect(() => {
    if (!isRunning){
      setMin(Math.floor(originalTime / 60));
      setSec(originalTime % 60);
      setBMin(Math.floor(breakTime / 60));
      setBSec(breakTime % 60);
    }
  }, [time, isRunning, originalTime, breakTime]);

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

  const selectPomodoroTime = () => {
    // Only read inputs if we're at the original start position
    setPhaseType("work")
    console.log("Phase Type:", phaseType);
    setWorkTime(workTime);
    setBreakTime(breakTime);
    if( phaseType === "work"){
      if (time === originalTime) {
      // User is editing the timer, use input values
      const validMin = Math.max(0, Math.floor(min));
      const validSec = Math.max(0, Math.min(59, Math.floor(sec)));
      const validTime = validMin * 60 + validSec;

      if (validTime > 0) {
        setTime(validTime);
        setOriginalTime(validTime);
      }
    }
    // else: we're resuming from a pause, don't touch time or originalTime

    // Always start regardless
    setIsRunning(true);
    }else if(phaseType === "break"){
      if (time === originalTime) {
      // User is editing the timer, use input values
      const validMin = Math.max(0, Math.floor(bMin));
      const validSec = Math.max(0, Math.min(59, Math.floor(bSec)));
      const validTime = validMin * 60 + validSec;

      if (validTime > 0) {
        setBreakTime(validTime);
        setTime(validTime);
        setOriginalTime(validTime);
      }
    }
    // else: we're resuming from a pause, don't touch time or originalTime

    // Always start regardless
    setIsRunning(true);
    }
  };

  const timerControllers = () => {
    return isRunning ? (
      <>
        <Pause color={isRunning ? color : "gray"} onClick={() => setIsRunning(false)} />
      </>
    ) : (
      <>
        <Play color={isRunning ? color : "gray"} onClick={() => selectPomodoroTime()} />
        {time < originalTime && (
          <Square color={isRunning ? color : "gray"} onClick={() => setReset(true)} />
        )}
        
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
  }, [reset, originalTime, setTime, setIsRunning, setReset]);

  return (
    <div className="flex justify-center bg-blue-200 p-5">
      <div className="relative">
        {/* Background circle */}
        <div className="w-52 h-52 rounded-full flex justify-center items-center">
          {isRunning ? (
            <p className={`text-[${isRunning ? color : "gray"}]-700 text-lg font-semibold`}>
              {formatTime(time)}
            </p>
          ) : time === originalTime ? (
            <div className="flex flex-col items-center">
            <p className="text-gray-700 text-lg font-semibold flex justify-center p-1">
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value) || 0)}
                className="w-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-[#BFDBFE]"
              />
              :
              <input
                type="number"
                value={sec}
                onChange={(e) => setSec(Number(e.target.value) || 0)}
                className="w-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-[#BFDBFE]"
              />
            </p>
            <p className="text-gray-700 text-lg font-semibold flex justify-center p-1">
              <input
                type="number"
                value={bMin}
                onChange={(e) => setBMin(Number(e.target.value) || 0)}
                className="w-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-[#BFDBFE]"
              />
              :
              <input
                type="number"
                value={bSec}
                onChange={(e) => setBSec(Number(e.target.value) || 0)}
                className="w-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-[#BFDBFE]"
              />
            </p>
            </div>
            
            
          ) : (
            <p className={`text-[${isRunning ? color : "gray"}]-700 text-lg font-semibold`}>
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
            stroke={isRunning ? color : "gray"}
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
