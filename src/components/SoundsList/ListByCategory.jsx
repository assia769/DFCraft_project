import SoundsList from "./SoundsList";
import { useState, useEffect } from "react";
import { ListFilter } from "lucide-react";
import DisplayCatigories from "./DisplayCatigories";
import { useTranslation } from "../../shared/i18n/translations";
import { useSettings } from "../../shared/context/SettingsContext";

export default function ListByCategory() {
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showCats, setShowCats] = useState(false);
  const [searchSound, setSearchSound] = useState("");
  const [urlImg, setUrlImg] = useState("");
  const { settings } = useSettings();
  const { t } = useTranslation("sound");

  useEffect(() => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        setUrlImg(chrome.runtime.getURL("icons/lostConnection.png"));
      } else {
        setUrlImg("icons/lostConnection.png");
      }
    } catch (error) {
      console.error("Extension API not available:", error);
      setUrlLogo("icons/LOGO.png");
    }
  }, []);

  if (navigator.onLine === false) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <img
          src={urlImg}
          alt="No Internet Connection"
        />
        <div className="p-2 text-center text-lightElements dark:text-darkElements">{t("noConnection")}</div>
      </div>
    );
  }

  return (
    <div className="bg-light dark:bg-dark">
      <div className="flex flex-row justify-between items-center mb-2">
        <input
          onChange={(e) => setSearchSound(e.target.value)}
          type="text"
          placeholder={t("placeHolderSearch")}
          className={`p-2 ${settings.language === "ar" ? "mr-6 ml-2 " : "ml-6 mr-2"} rounded-lg bg-lightList dark:bg-darkList placeholder:text-lightPlaceHolder dark:placeholder:text-darkPlaceHolder focus:outline-none w-full`}
        />
        <button
          onClick={() => {
            setShowCats(true);
          }}
          className={`transition-colors relative ${settings.language === "ar" ? "ml-6" : "mr-6"}`}
          aria-label="Menu"
        >
          <ListFilter className="w-6 h-6 text-lightElements dark:text-darkElements" />
        </button>
      </div>
      <SoundsList category={category} searchSound={searchSound} />
      {showCats && (
        <DisplayCatigories
          category={category}
          categories={categories}
          setCategory={setCategory}
          setCategories={setCategories}
          setShowCats={setShowCats}
        />
      )}
    </div>
  );
}
