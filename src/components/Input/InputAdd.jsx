import { useEffect, useState } from "react";




const InputAdd= ({value , setValue , addElement})=>{
//  input qui sert ajouter des element dans une state 

  
    return(
        <input 
             value={value}
             onChange={(e)=>{setValue(e.target.value)}}
             onKeyDown={(e)=>{
                if(e.key=="Enter"){
                    console.log("Le key est Enter est presse")
                    addElement(value)
                }
             }}
        />
    ) ;
}

export default InputAdd 
