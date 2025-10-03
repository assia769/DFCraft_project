import { CircleCheckBigIcon } from "lucide-react";
import List from "./List";
import { useState } from "react";

const UrlList = ({ urlElements, setUrlElements }) => {
    if (urlElements.length === 0)
        return (<div className="text-center p-4">Aucun url est définie</div>);
    return (
        <div className="my-4">
            <List ItemComponent={UrlItem} items={urlElements} setItems={setUrlElements} />
        </div>
    );
};

function UrlItem({ element, setElements }) {
    function handleChangeSownd(url) {
        setElements((prv) =>
            prv.map(item => item.url === url ? { ...item, sowndBlocked: !item.sowndBlocked } : item)
        );
    }
    function handleChangeBlocked(url) {
        setElements((prv) =>
            prv.map(item => item.url === url ? { ...item, urlBlocked: !item.urlBlocked } : item)
        );
    }
    return (
        <div className="flex items-center space-x-4 p-2 border rounded">
            <input
                type="checkbox"
                checked={element.urlBlocked}
                onChange={() => handleChangeBlocked(element.url)}
                className="w-4 h-4"
            />
            <span className="flex-1">{element.url}</span>
            <button
                onClick={() => handleChangeSownd(element.url)}
                className={`px-3 py-1 rounded ${element.sowndBlocked ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
                {element.sowndBlocked ? "ON" : "OFF"}
            </button>
        </div>
    );
}

export default UrlList;