import { useTranslation } from "../../shared/i18n/translations";

export default function DisplayBlockTypes({ showBlockTypes, setShowBlockTypes, selectedBlockTypes, setSelectedBlockTypes }) {
    
    const { t } = useTranslation("blockPages");
    
    const blockTypes = [
        { id: "all", name: t("all") },
        { id: "sound", name: t("sound") },
        { id: "access", name: t("access") },
        { id: "both", name: t("both") },
        { id: "none", name: t("none") },
    ];

    const selectedClass = (type) => {
        return type === selectedBlockTypes ? "text-light dark:text-dark bg-lightElements dark:bg-darkElements rounded-3xl py-1 px-3 min-w-fit" : "text-light dark:text-dark bg-lightList dark:bg-darkList rounded-3xl py-1 px-3 min-w-fit  hover:shadow-lg hover: shadow-black transition-all"
    }

    return (
        <>
            {showBlockTypes && (
                <div
                    className="fixed inset-0 bg-light dark:bg-dark opacity-30 backdrop-blur-sm"
                    onClick={() => setShowBlockTypes(false)}
                />
            )}
            <div className={`fixed bottom-0 rounded-t-3xl w-full bg-lightElements dark:bg-darkElements p-6 BtoT ${showBlockTypes ? "" : "hidden"}`}>
                <h1 className='text-3xl mb-4 text-light dark:text-dark'>{t("bType")}</h1>
                <div className='flex flex-wrap gap-2'>
                    {blockTypes.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => setSelectedBlockTypes(type.id)}
                            className={"flex flex-row justify-start items-center select-none cursor-pointer transition-all " + selectedClass(type.id)}
                        >
                            {type.name}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}