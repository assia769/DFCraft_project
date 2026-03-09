import List from "./List";
import {useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "../../shared/i18n/translations";

const UrlList = ({ urlElements, setUrlElements, setSelectedElement }) => {

  const { t } = useTranslation("blockPages");

  if (urlElements.length === 0)
    return <div className="text-start text-lightElements dark:text-darkElements p-4">{t("existance")}</div>;
  console.log("urlElements", urlElements);
  return (
    <div>
      <List
        ItemComponent={UrlItem}
        items={urlElements}
        setItems={setUrlElements}
        setSelectedElement={setSelectedElement}
      />
    </div>
  );
};

function UrlItem({ element, setElements, setDeletingElement }) {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);

  console.log("element", element);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
    console.log("event.target.checked", event.target.checked);
    if (event.target.checked) {
      setDeletingElement((prv) => [...prv, element]);
    } else {
      setDeletingElement((prv) =>
        prv.filter((item) => item.url !== element.url),
      );
    }
  };

  function handleChange(value) {
    setSelected(value);
  }
  useEffect(() => {
    if (selected === "sownd") {
      handleChangeSownd(element);
    }
    if (selected === "access") {
      handleChangeBlocked(element);
    }
    if (selected === "both") {
      handleChangeBlocked(element);
      handleChangeSownd(element);
    }
    if (selected === "none") {
      handleChangeNone(element);
    }
  }, [selected]);
  function handleChangeSownd(url) {
    setElements((prv) =>
      prv.map((item) =>
        item.url === url ? { ...item, sowndBlocked: true } : item,
      ),
    );
  }
  function handleChangeBlocked(url) {
    setElements((prv) =>
      prv.map((item) =>
        item.url === url ? { ...item, urlBlocked: true } : item,
      ),
    );
  }
  function handleChangeNone(url) {
    setElements((prv) =>
      prv.map((item) =>
        item.url === url
          ? { ...item, urlBlocked: false, sowndBlocked: false }
          : item,
      ),
    );
  }
  return (
    <div
      className={`flex flex-col w-full justify-center items-end space-x-4 p-2`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="h-full flex items-center gap-[10px] ">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            value="item1"
            className=" h-[18px] w-[18px] cursor-pointer appearance-none rounded-md border-2 
                        border-lightElements dark:border-darkElements checked:bg-lightElements dark:checked:bg-darkElements checked:border-transparent
                        relative after:content-[''] after:absolute after:hidden checked:after:block
                        after:left-[5px] after:top-[1px] after:w-[5px] after:h-[10px] 
                        after:border-r-2 after:border-b-2 after:rotate-45
                        transition-all duration-200"
          />
          <span>
            {element.url.length > 35
              ? element.url.slice(0, 35) + "..."
              : element.url}
          </span>
        </div>
        <MultiSelect urlElement={element} setUrlElement={setElements} />
      </div>
    </div>
  );
}

function MultiSelect({ urlElement, setUrlElement }) {
  const [clicked, setClicked] = useState(false);
  const [selected, setSelected] = useState("");
  const { t } = useTranslation("blockPages");

  function handleChangeSownd(url) {
    setUrlElement((prv) =>
      prv.map((item) =>
        item.url === url ? { ...item, sowndBlocked: true, urlBlocked: false } : item,
      ),
    );
    setClicked(false);
  }
  function handleChangeBlocked(url) {
    setUrlElement((prv) =>
      prv.map((item) =>
        item.url === url ? { ...item, urlBlocked: true, sowndBlocked: false } : item,
      ),
    );
    setClicked(false);
  }

  function handleChangeBoth(url) {
    setUrlElement((prv) =>
      prv.map((item) =>
        item.url === url
          ? { ...item, urlBlocked: true, sowndBlocked: true }
          : item,
      ),
    );
    setClicked(false);
  }

  function handleChangeNselectedone(url) {
    setUrlElement((prv) =>
      prv.map((item) =>
        item.url === url
          ? { ...item, urlBlocked: false, sowndBlocked: false }
          : item,
      ),
    );
    setClicked(false);
  }

  useEffect(() => {
    if (selected === "sownd") {
      handleChangeSownd(urlElement.url);
    }
    if (selected === "access") {
      handleChangeBlocked(urlElement.url);
    }
    if (selected === "both") {
      handleChangeBoth(urlElement.url);
    }
    if (selected === "none") {
      handleChangeNselectedone(urlElement.url);
    }
  }, [selected]);

  const handleOnClick = () => {
    setClicked(!clicked);
  };
  return (
    <div className="relative text-light dark:text-dark flex text-[10px] justify-center items-center z-1">
      {urlElement.sowndBlocked || urlElement.urlBlocked ? (
        <span
          className={`transform ${clicked ? "rotate-180" : "rotate-0"} 
                        transition-transform p-[3px] rounded-lg 
                        duration-300
                        ${urlElement.sowndBlocked && urlElement.urlBlocked ? "bg-[#ffff00a3]" : urlElement.sowndBlocked ? "bg-[#008000ad]" : "bg-[#ff4747]"}`}
          onClick={handleOnClick}
        >
          {urlElement.sowndBlocked && urlElement.urlBlocked
            ? t("both")
            : urlElement.sowndBlocked
              ? t("sound")
              : t("access")}
        </span>
      ) : (
        <span
          className={`transform ${clicked ? "rotate-180" : "rotate-0"} transition-transform duration-300 rounded-xl text-lightElements dark:text-darkElements`}
          onClick={handleOnClick}
        >
          <ChevronDown />
        </span>
      )}

      <div
        className={`${clicked ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"} transition-all duration-300 ease-in-out origin-top flex  dark:bg-darkElements rounded-xl bg-[#C282FF]  p-2 flex-col top-0 left-0 z-10  w-[55px] justify-center items-center absolute`}
      >
        <div
          className={`w-full flex justify-start items-center transform transition-transform duration-300 ${clicked ? "rotate-180" : "rotate-0"}`}
          onClick={handleOnClick}
        >
          <ChevronDown color="white" />
        </div>
        <div
          onClick={() => setSelected("sownd")}
          className="w-full cursor-pointer hover:bg-[#cc95fe80] rounded-[9px]   flex justify-center items-center gap-1"
        >
          {t("sound")}
        </div>
        <div
          className="w-full cursor-pointer hover:bg-[#cc95fe80] rounded-[9px]   flex justify-center items-center gap-1"
          onClick={() => setSelected("access")}
        >
          {t("access")}
        </div>
        <div
          onClick={() => setSelected("both")}
          className="w-full cursor-pointer hover:bg-[#cc95fe80] rounded-[9px]   flex justify-center items-center gap-1"
        >
          {t("both")}
        </div>
        <div
          onClick={() => setSelected("none")}
          className="w-full cursor-pointer hover:bg-[#cc95fe80] rounded-[9px]   flex justify-center items-center gap-1"
        >
          {t("none")}
        </div>
      </div>
    </div>
  );
}

export default UrlList;
