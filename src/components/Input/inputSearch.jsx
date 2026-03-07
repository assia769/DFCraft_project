import { useEffect, useState } from "react";

function InputSearch({ Element, setSearchedElement, value, setValue }) {
  useEffect(() => {
    if (value !== "") {
      const filteredElements = Element.filter((element) =>
        element.url.toLowerCase().includes(value.toLowerCase()),
      );
      setSearchedElement(filteredElements);
      return;
    }
    setSearchedElement([]);
  }, [value]);

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
        placeholder="Add url"
        className="p-2 mr-2 rounded-lg bg-lightList dark:bg-darkList placeholder:text-lightPlaceHolder dark:text-darkPlaceHolder w-full focus:outline-none ml-6"
    />
  );
}

export default InputSearch;
