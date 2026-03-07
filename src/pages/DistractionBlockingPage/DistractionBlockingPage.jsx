import { useEffect, useState } from "react";
import InputAddUrl from "../../components/Input/InputAddUrl";
import UrlList from "../../components/List/UrlList";
import SelectUrlState from "../../components/MultiSelect/SelectUrlState";
import { Shield, Trash, ListFilter } from "lucide-react";
import { X } from "lucide-react";
import useSaveUrl from "../../shared/hooks/useSaveUrl";
import InputSearch from "../../components/Input/inputSearch";

const DistractionBlockingPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [selectedElement, setSelectedElement] = useState([]);
  const [searchedElement, setsearchedElement] = useState([]);
  const [isDelete, setisDelete] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");

  const { urlElements, setUrlElement } = useSaveUrl();

  const [isShaking, setIsShaking] = useState(false);

  const handleClick = () => {
    setIsShaking(true);
    // On retire la classe après la fin de l'animation (200ms)
    setTimeout(() => setIsShaking(false), 200);
  };
  function handleDelete() {
    setUrlElement((prv) =>
      prv.filter((item) => !selectedElement.includes(item)),
    );
    setSelectedElement([]);
    setisDelete(false);
  }

  useEffect(() => {
    console.log("selectedElement", selectedElement);
    if (selectedElement.length > 0) {
      setisDelete(true);
      setShowAddInput(false);
    } else {
      setisDelete(false);
    }
  }, [selectedElement]);

  return (
    <div className="relative overflow-hidden dark:bg-dark bg-light">
      <div className="flex flex-row justify-between items-center mb-2">
        <InputSearch
          Element={urlElements}
          value={searchedValue}
          setValue={setSearchedValue}
          setSearchedElement={setsearchedElement}
        />
        {isDelete ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="transition-colors relative mr-6"
            aria-label="Menu"
          >
            <Trash className="w-6 h-6 text-lightElements dark:text-darkElements" />
          </button>
        ) : (
          <button
            onClick={() => {
              setShowCats(true);
            }}
            className="transition-colors relative mr-6"
            aria-label="Menu"
          >
            <ListFilter className="w-6 h-6 text-lightElements dark:text-darkElements" />
          </button>
        )}
      </div>
      <section className="p-4 rounded-xl text-darkFontText text-[17px] dark:text-white mt-3 dark:text-lightFontText dark:shadow-[inset_10px_10px_37px_-16px_rgba(127,45,191,0.27)] z-10">
        {searchedValue !== "" ? (
          searchedElement.length > 0 ? (
            <UrlList
              urlElements={searchedElement}
              setUrlElements={setUrlElement}
              setSelectedElement={setSelectedElement}
            />
          ) : (
            <div className="text-center p-4">Cette url n'existe pas </div>
          )
        ) : (
          <UrlList
            urlElements={urlElements}
            setUrlElements={setUrlElement}
            setSelectedElement={setSelectedElement}
          />
        )}
      </section>

      <div className="absolute h-[50%] w-[50%]  bottom-[-25%] left-[50%]  blur-[50px]     dark:bg-darkElements bg-[#A855F7] z-[-1]"></div>
    </div>
  );
};

export default DistractionBlockingPage;
