
import { CircleCheckBigIcon } from "lucide-react"
import List from "./List"
import { useState } from "react"






const UrlList = ({urlElements , setUrlElements}) => {

    if(urlElements.length == 0 ) return (<div>Aucun url est definie</div>)
    return (
        <div>
            <List ItemComponent={UrlItem}  items={urlElements} setItems={setUrlElements} ></List>
        </div>
    )
}









function UrlItem({ element , setElements }) {
    function handleChangeSownd (url){
        setElements((prv)=>
            prv.map(item=> item.url === url ? {...item , sowndBlocked : !item.sowndBlocked} : item)
        )
    }
    function handleChangeBlocked (url){
        setElements((prv)=>
            prv.map(item=> item.url === url ? {...item , urlBlocked : !item.urlBlocked} : item)
        )
    }


    return (
        <div>
            <input
                type="checkbox"
                checked={element.urlBlocked}
                onChange={() => handleChangeBlocked(element.url)}
            />
            <span>{element.url}</span>
            <button
                onClick={() =>handleChangeSownd(element.url)}
            >
                {element.sowndBlocked ? "ON" : "OFF"}
            </button>
        </div>
    )
}

export default UrlList 