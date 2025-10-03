import { useTimer } from "../../shared/hooks/useTimer";
import { Play, Square, Pause } from "lucide-react";
import { useState, useEffect } from "react";
import TimerOptions from "../Common/TimeOptions/TimeOptions.jsx";

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
    phaseType,
    setPhaseType,
  } = useTimer();

  const [min, setMin] = useState(Math.floor(time / 60));
  const [sec, setSec] = useState(time % 60);
  const [bMin, setBMin] = useState(Math.floor(breakTime / 60));
  const [bSec, setBSec] = useState(breakTime % 60);
  const [desable, setDesable] = useState(true);
  const [pause, setPause] = useState(false);


  const color = phaseType === "work" ? "blue" : "green";

  useEffect(() => {
    if (!isRunning) {
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
    setDesable(false)
    // Always start from work phase at beginning
    if (time === originalTime) {
      setPhaseType("work");

      // Read work time from inputs
      const validMin = Math.max(0, Math.floor(min));
      const validSec = Math.max(0, Math.min(59, Math.floor(sec)));
      const validWorkTime = validMin * 60 + validSec;

      // Read break time from inputs
      const validBMin = Math.max(0, Math.floor(bMin));
      const validBSec = Math.max(0, Math.min(59, Math.floor(bSec)));
      const validBreakTime = validBMin * 60 + validBSec;

      if (validWorkTime > 0) {
        setWorkTime(validWorkTime);
        setBreakTime(validBreakTime);
        setTime(validWorkTime);
        setOriginalTime(validWorkTime);
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
          color={isRunning ? color : "gray"}
          onClick={() => {setIsRunning(false);setPause(true)}}
        />
      </>
    ) : (
      <>
        <Play
          color={isRunning ? color : "gray"}
          onClick={() => selectPomodoroTime()}
        />
        {pause && (
          <Square
            color={isRunning ? color : "gray"}
            onClick={() => {
              setReset(true);
              setDesable(true);
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
      setSec(originalTime % 60);
      setIsRunning(false);
      setReset(false);
    }
  }, [reset, originalTime, setTime, setIsRunning, setReset]);

  return (
    <div className="flex flex-col items-center justify-center bg-blue-200 p-5">
      <div className="relative">
        {/* Background circle */}
        <div className="w-52 h-52 rounded-full flex justify-center items-center">
          {isRunning ? (
            <p
              className={`text-[${
                isRunning ? color : "gray"
              }]-700 text-lg font-semibold`}
            >
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
            <p
              className={`text-[${
                isRunning ? color : "gray"
              }]-700 text-lg font-semibold`}
            >
              {formatTime(time)}
            </p>
          )}
        </div>

        {/* Progress border */}
        <svg className="absolute top-0 left- w-52 h-52 rotate-90 pointer-events-none">
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
      <div className="flex justify-center gap-4 mb-4">{timerControllers()}</div>

      {/* Time Options Section */}
      {desable && (
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          <TimerOptions
            workTime={25}
            BreakTime={5}
            setMin={setMin}
            setSec={setSec}
            setBMin={setBMin}
            setBSec={setBSec}
            originalWorkTime={min}
            originalBreakTime={bMin}
          />
          <TimerOptions
            workTime={25}
            BreakTime={10}
            setMin={setMin}
            setSec={setSec}
            setBMin={setBMin}
            setBSec={setBSec}
            originalWorkTime={min}
            originalBreakTime={bMin}
          />
          <TimerOptions
            workTime={30}
            BreakTime={5}
            setMin={setMin}
            setSec={setSec}
            setBMin={setBMin}
            setBSec={setBSec}
            originalWorkTime={min}
            originalBreakTime={bMin}
          />
          <TimerOptions
            workTime={30}
            BreakTime={10}
            setMin={setMin}
            setSec={setSec}
            setBMin={setBMin}
            setBSec={setBSec}
            originalWorkTime={min}
            originalBreakTime={bMin}
          />
          <TimerOptions
            workTime={45}
            BreakTime={5}
            setMin={setMin}
            setSec={setSec}
            setBMin={setBMin}
            setBSec={setBSec}
            originalWorkTime={min}
            originalBreakTime={bMin}
          />
          <TimerOptions
            workTime={45}
            BreakTime={10}
            setMin={setMin}
            setSec={setSec}
            setBMin={setBMin}
            setBSec={setBSec}
            originalWorkTime={min}
            originalBreakTime={bMin}
          />
          <TimerOptions
            workTime={45}
            BreakTime={15}
            setMin={setMin}
            setSec={setSec}
            setBMin={setBMin}
            setBSec={setBSec}
            originalWorkTime={min}
            originalBreakTime={bMin}
          />
        </div>
      )}
    </div>
  );
}
