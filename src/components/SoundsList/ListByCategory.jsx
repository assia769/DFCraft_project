import SoundsList from "./SoundsList";
import { useState } from "react";
import { ListFilter } from "lucide-react";
import DisplayCatigories from "./DisplayCatigories";
import { useTranslation } from "../../shared/i18n/translations";

export default function ListByCategory() {
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showCats, setShowCats] = useState(false);
  const [searchSound, setSearchSound] = useState("");
  const { t } = useTranslation("sound")

  return (
    <div className="bg-light dark:bg-dark">
      <div className="flex flex-row justify-between items-center mb-2">
        <input
          onChange={(e) => setSearchSound(e.target.value)}
          type="text"
          placeholder={t("placeHolderSearch")}
          className="p-2 mr-2 rounded-lg bg-lightList dark:bg-darkList placeholder:text-lightPlaceHolder dark:placeholder:text-darkPlaceHolder focus:outline-none w-full ml-6"
        />
        <button
          onClick={() => {
            setShowCats(true);
          }}
          className="transition-colors relative mr-6"
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
