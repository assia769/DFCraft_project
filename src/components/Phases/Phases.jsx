import { useTimer } from "../../shared/hooks/useTimer";

export default function Phases() {
  const { sessionCount, phaseType } = useTimer();
  
  return (
    <>
      <div className="bg-light dark:bg-dark p-3 mt-2 mx-5 rounded-full flex flex-col gap-6 items-center">
        <p className="text-lightElements dark:text-darkElements text-2xl">
          {phaseType === "work" ? "Work" : phaseType === "break" ? "Break" : "Long Break"}
        </p>
        <div className="p-2 mx-5 rounded-full flex flex-row justify-center gap-6 items-center">
          <div className={`bg-${sessionCount >= 1 ? 'darkPoints' : 'lightElements'} dark:bg-darkElements w-2 h-2 rounded-full`}>
          </div>
          <div className={`bg-${sessionCount >= 2 ? 'darkElements' : 'lightElements'} dark:bg-darkElements w-2 h-2 rounded-full`}>
          </div>
          <div className={`bg-${sessionCount >= 3 ? 'darkElements' : 'lightElements'} dark:bg-darkElements w-2 h-2 rounded-full`}>
          </div>
          <div className={`bg-${sessionCount >= 4 ? 'darkElements' : 'lightElements'} dark:bg-darkElements w-2 h-2 rounded-full`}>
          </div>
        </div>
      </div>
    </>
  );
}
