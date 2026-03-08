import { useEffect, useMemo, useState } from "react";
import InputAddUrl from "../../components/Input/InputAddUrl";
import UrlList from "../../components/List/UrlList";
import SelectUrlState from "../../components/MultiSelect/SelectUrlState";
import { Shield, Trash, ListFilter } from "lucide-react";
import { X } from "lucide-react";
import useSaveUrl from "../../shared/hooks/useSaveUrl";
import InputSearch from "../../components/Input/inputSearch";
import DisplayBlockTypes from "../../components/DisplayBlockTypes/DisplayBlockTypes";

const DistractionBlockingPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [selectedElement, setSelectedElement] = useState([]);
  const [searchedElement, setsearchedElement] = useState([]);
  const [isDelete, setisDelete] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");
  const [showBlockTypes, setShowBlockTypes] = useState(false);
  const [selectedBlockTypes, setSelectedBlockTypes] = useState("all");
  const { urlElements, setUrlElement } = useSaveUrl();

  const [isShaking, setIsShaking] = useState(false);

  const filteredElement = useMemo(() => {
    const filteredElements =
      searchedValue == ""
        ? urlElements
        : urlElements.filter((element) =>
            element.url.toLowerCase().includes(searchedValue.toLowerCase()),
          );
    if (selectedBlockTypes === "access")
      return filteredElements.filter((element) => element.accessBlocked);
    else if (selectedBlockTypes === "sownd")
      return filteredElements.filter((element) => element.sowndBlocked);
    else if (selectedBlockTypes === "both")
      return filteredElements.filter(
        (element) => element.accessBlocked && element.sowndBlocked,
      );
    else if (selectedBlockTypes === "none")
      return filteredElements.filter(
        (element) => !element.accessBlocked && !element.sowndBlocked,
      );
    return filteredElements;
  }, [searchedValue, selectedBlockTypes, urlElements]);

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
    <div className="relative dark:bg-dark bg-light">
      <div className="flex flex-row justify-between items-center">
        <input
          value={searchedValue}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setSearchedValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("Le key est Enter est presse");
              addElement(searchedValue);
            }
          }}
          placeholder="Add url"
          className="p-2 mr-2 rounded-lg bg-lightList dark:bg-darkList placeholder:text-lightPlaceHolder dark:text-darkPlaceHolder w-full focus:outline-none ml-6"
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
              setShowBlockTypes(true);
            }}
            className="transition-colors relative mr-6"
            aria-label="Menu"
          >
            <ListFilter className="w-6 h-6 text-lightElements dark:text-darkElements" />
          </button>
        )}
      </div>
      <section className="p-4 rounded-xl text-lightElements dark:text-darkElements text-[17px]">
        <UrlList
          urlElements={filteredElement}
          setUrlElements={setUrlElement}
          setSelectedElement={setSelectedElement}
        />
      </section>
      <div className="absolute h-[50%] w-[50%] bottom-[-25%] left-[50%] blur-[50px] dark:bg-darkElements bg-[#A855F7] z-[-1]"></div>
      {showBlockTypes && (
        <DisplayBlockTypes
          showBlockTypes={showBlockTypes}
          setShowBlockTypes={setShowBlockTypes}
          selectedBlockTypes={selectedBlockTypes}
          setSelectedBlockTypes={setSelectedBlockTypes}
        />
      )}
    </div>
  );
};

export default DistractionBlockingPage;
