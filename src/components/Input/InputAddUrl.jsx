import { use, useEffect, useRef, useState } from "react";

const InputAddUrl = ({
  elements,
  setElement,
  setShowAddInput,
  showAddInput,
}) => {
  const [value, setValue] = useState("");
  function addElement(value) {
    const existe = elements.some((el) => el.url === value);
    if (!existe) {
      setElement((prv) => [
        ...prv,
        {
          url: value,
          sowndBlocked: false,
          urlBlocked: false,
        },
      ]);
      setValue("");
    }
  }

  function handleBlur() {
    setShowAddInput(false);
  }

  return (
    <input
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          console.log("Le key est Enter est presse");
          addElement(value);
        }
      }}
      onBlur={handleBlur}
      placeholder="Search for a link"
      className="p-2 mr-2 rounded-lg bg-lightList dark:bg-darkList placeholder:text-lightPlaceHolder dark:text-darkPlaceHolder w-full focus:outline-none ml-6"
    />
  );
};

export default InputAddUrl;
