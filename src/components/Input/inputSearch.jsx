import { useEffect, useState } from "react";



function InputSearch({Element , setSearchedElement , value , setValue}) {

    
    
    useEffect(() => {
        if(value !== ""){
             const filteredElements = Element.filter((element) =>
            element.url.toLowerCase().includes(value.toLowerCase())
        );
        setSearchedElement(filteredElements);
        return  ;
        }
        setSearchedElement([])
       
    }, [value]);

    return (
        <div className="my-4 w-[100%] mb-[15px] ">
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
                placeholder="Add url"
                className=" p-2 rounded-xl w-[100%] focus:outline-none border-[3px]  border-blue-300 dark:border-none h-[30px]  "
            />
        </div>
    ) 
};

export default InputSearch;


