import { CircleCheckBigIcon, Flag } from "lucide-react";
import List from "./List";
import { use, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const UrlList = ({ urlElements, setUrlElements, setSelectedElement }) => {
  if (urlElements.length === 0)
    return <div className="text-center p-4">Aucun url est définie</div>;
  console.log("urlElements", urlElements);
  return (
    <div className="my-4">
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
    if (selected === "acces") {
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
      <div className="flex w-full items-center justify-between p-2 ">
        <div className="h-full flex items-center gap-[10px] ">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            value="item1"
            className=" h-[18px] w-[18px] cursor-pointer appearance-none rounded-md border-2 
                        dark:border-[#ba75fb] border-[#c995fa] checked:bg-[#ba75fb] checked:border-transparent
                        relative after:content-[''] after:absolute after:hidden checked:after:block
                        after:left-[5px] after:top-[1px] after:w-[5px] after:h-[10px] 
                        after:border-white after:border-r-2 after:border-b-2 after:rotate-45
                        transition-all duration-200"
          />
          <span>
            {element.url.length > 30
              ? element.url.slice(0, 30) + "..."
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

  function handleChangeSownd(url) {
    setUrlElement((prv) =>
      prv.map((item) =>
        item.url === url ? { ...item, sowndBlocked: true } : item,
      ),
    );
    setClicked(false);
  }
  function handleChangeBlocked(url) {
    setUrlElement((prv) =>
      prv.map((item) =>
        item.url === url ? { ...item, urlBlocked: true } : item,
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
    if (selected === "acces") {
      handleChangeBlocked(urlElement.url);
    }
    if (selected === "both") {
      handleChangeBlocked(urlElement.url);
      handleChangeSownd(urlElement.url);
    }
    if (selected === "none") {
      handleChangeNselectedone(urlElement.url);
    }
  }, [selected]);

  const handleOnClick = () => {
    setClicked(!clicked);
  };
  return (
    <div className="relative flex text-[10px] w-[57px]  justify-center items-center  ">
      {urlElement.sowndBlocked || urlElement.urlBlocked ? (
        <span
          className={` transform ${clicked ? "rotate-180" : "rotate-0"} 
                        transition-transform p-[3px] rounded-lg 
                         duration-300
                         ${urlElement.sowndBlocked && urlElement.urlBlocked ? "bg-[#ffff00a3]" : urlElement.sowndBlocked ? "bg-[#008000ad]" : "bg-[#ff4747]"}
                         `}
          onClick={handleOnClick}
        >
          {urlElement.sowndBlocked && urlElement.urlBlocked
            ? "Both"
            : urlElement.sowndBlocked
              ? "Sownd"
              : "Acces"}
        </span>
      ) : (
        <span
          className={` transform ${clicked ? "rotate-180" : "rotate-0"} transition-transform duration-300    rounded-xl `}
          onClick={handleOnClick}
        >
          <ChevronDown />
        </span>
      )}

      <div
        className={`${clicked ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"} transition-all duration-300 ease-in-out origin-top flex  dark:bg-darkElements rounded-xl bg-[#C282FF]  p-2 flex-col top-0 left-0 z-10  w-[45px] justify-center items-center absolute`}
      >
        <div
          className={`w-full  flex justify-start items-center transform transition-transform duration-300 ${clicked ? "rotate-180" : "rotate-0"}`}
          onClick={handleOnClick}
        >
          <ChevronDown color="white" />
        </div>
        <div
          onClick={() => setSelected("sownd")}
          className="w-full cursor-pointer  "
        >
          Sownd
        </div>
        <div
          className="w-full cursor-pointer"
          onClick={() => setSelected("acces")}
        >
          Acces
        </div>
        <div
          onClick={() => setSelected("both")}
          className="w-full cursor-pointer"
        >
          Both
        </div>
        <div
          onClick={() => setSelected("none")}
          className="w-full cursor-pointer"
        >
          None
        </div>
      </div>
    </div>
  );
}

function Separator({ className = "" }) {
  return (
    <div
      className={` ${className}   h-[2px] rounded-sm  `}
      style={{ marginRight: "19px" }}
    ></div>
  );
}
export default UrlList;
