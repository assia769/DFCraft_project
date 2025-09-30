import { useTimer } from "../../shared/hooks/useTimer";
import { Play, Square, Pause } from "lucide-react";

export default function Timer() {
  const { time, isRunning, setIsRunning, setReset } = useTimer();

  const percentage = (time / 60) * 100; // Change this to control completion (0-100)
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  const timerControllers = () => {
    return isRunning ? (
      <>
        <Pause color="blue" onClick={() => setIsRunning(false)} />
        <Square color="blue" onClick={() => setReset(true)} />
      </>
    ) : (
      <Play color="blue" onClick={() => setIsRunning(true)} />
    );
  };

  return (
    <div className="flex justify-center bg-blue-200 p-5">
      <div className="relative">
        {/* Background circle */}
        <div className="w-52 h-52 rounded-full flex justify-center items-center">
          <p className="text-blue-700 text-lg font-semibold">{time}</p>
        </div>
        <div className="flex justify-center mt-4">{timerControllers()}</div>

        {/* Progress border */}
        <svg className="absolute top-0 left-0 w-52 h-52 -rotate-90">
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
