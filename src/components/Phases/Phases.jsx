import { useTimer } from "../../shared/hooks/useTimer";
import { useTranslation } from "../../shared/i18n/translations";

export default function Phases() {
  const { sessionCount, phaseType } = useTimer();
  const { t } = useTranslation('home');
  
  return (
    <>
      <div className="bg-light dark:bg-dark p-3 mx-5 rounded-full flex flex-col gap-3 items-center">
        <p className="text-lightElements dark:text-darkElements text-2xl">
          {phaseType === "work" ? t("work") : phaseType === "break" ? t("break") : t("longBreak")}
        </p>
        <div className="p-2 mx-5 rounded-full flex flex-row justify-center gap-6 items-center">
          <div className={`${sessionCount >= 1 ? 'shadow-inner shadow-black dark:shadow-white' : ''} bg-lightElements dark:bg-darkElements w-[0.60rem] h-[0.60rem] rounded-full`}>
          </div>
          <div className={`${sessionCount >= 2 ? 'shadow-inner shadow-black dark:shadow-white' : ''} bg-lightElements dark:bg-darkElements w-[0.60rem] h-[0.60rem] rounded-full`}>
          </div>
          <div className={`${sessionCount >= 3 ? 'shadow-inner shadow-black dark:shadow-white' : ''} bg-lightElements dark:bg-darkElements w-[0.60rem] h-[0.60rem] rounded-full`}>
          </div>
          <div className={`${sessionCount >= 4 ? 'shadow-inner shadow-black dark:shadow-white' : ''} bg-lightElements dark:bg-darkElements w-[0.60rem] h-[0.60rem] rounded-full`}>
          </div>
        </div>
      </div>
    </>
  );
}
