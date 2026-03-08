import { useState } from "react";

const InputAddUrl = ({
  elements,
  setElement,
  setShowAddSection,
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
      setShowAddSection(false);
    }
  }

  return (
    <div className="text-light dark:text-dark">
      <div
        className="fixed inset-0 bg-light dark:bg-dark opacity-30 backdrop-blur-sm"
        onClick={() => setShowAddSection(false)}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-lightElements dark:bg-darkElements rounded-lg p-4 w-[90%] flex flex-col items-center justify-center">
        <span className="text-light dark:text-dark text-sm mb-1 block">
          Enter the URL you want to block:
        </span>
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
          placeholder="Search for a link"
          className={`m-2 p-3 w-full rounded-lg bg-lightList dark:bg-darkList ${value ? 'text-light dark:text-dark' : 'placeholder:text-lightPlaceHolder dark:placeholder:text-darkPlaceHolder'} focus:outline-none`}
        />
      </div>
    </div>
  );
};

export default InputAddUrl;
