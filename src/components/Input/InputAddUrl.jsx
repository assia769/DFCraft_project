import {  use, useEffect, useRef, useState } from "react";

const InputAddUrl = ({ elements, setElement , setShowAddInput , showAddInput }) => {
    const [value, setValue] = useState("");
    function addElement(value) {
        const existe = elements.some((el) => el.url === value);
        if (!existe) {
            setElement((prv) => [
                ...prv,
                {
                    url: value,
                    sowndBlocked: false,
                    urlBlocked: false
                }
            ]);
            setValue("");
        }
    }

    function handleBlur() {
        setShowAddInput(false);
    }

    return (
        <div className="my-4 w-[100%] mb-[11px] ">
            <input
                value={value}
                onClick={(e)=> e.stopPropagation()}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        console.log("Le key est Enter est presse");
                        addElement(value);
                    }
                }}
                onBlur={handleBlur}
                placeholder="Add url"
                className=" p-2 rounded-xl  text-black text-[11px] w-[100%] focus:outline-none border-[3px]  border-blue-300 dark:border-none h-[30px]  "
            />
        </div>
    );
};

export default InputAddUrl;