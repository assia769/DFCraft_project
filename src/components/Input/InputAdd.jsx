import { useEffect, useState } from "react";

const InputAdd = ({ value, setValue, addElement }) => {
    return (
        <input 
             value={value}
             onChange={(e) => setValue(e.target.value)}
             onKeyDown={(e) => {
                if(e.key === "Enter"){
                    console.log("Le key est Enter est presse");
                    addElement(value);
                }
             }}
             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
    );
};

export default InputAdd;
