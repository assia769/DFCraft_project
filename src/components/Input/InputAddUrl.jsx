import {  useState } from "react";
import InputAdd from "./InputAdd";

const InputAddUrl = ({ elements, setElement }) => {
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
        console.log("Ce url deja exsite ");
    }

    return (
        <div className="my-4">
            <InputAdd value={value} setValue={setValue} addElement={addElement} />
        </div>
    );
};

export default InputAddUrl;