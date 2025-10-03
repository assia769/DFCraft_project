import { useEffect , useState } from "react"
import InputAdd from "./InputAdd"




const InputAddUrl = ({elements , setElement})=>{

    const [value , setValue] = useState("")
   
    function addElement(value){
        const existe = elements.some((el) => el.url === value);
        if(existe === false){
            
            setElement((prv)=>[...prv , {
                url : value , 
                sowndBlocked :  false , 
                urlBlocked  : false
            }])
            setValue("")

            
        }
        console.log("Ce url deja exsite ")
    }



    return(
        <InputAdd value ={value}  setValue={setValue} addElement = {addElement}  ></InputAdd>
    )
}

export default  InputAddUrl