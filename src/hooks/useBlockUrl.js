import { useEffect } from "react"



const  useBlockUrl = (urlElements)=>{
    useEffect(()=>{
       
        function blockUrl(){
            if(urlElements.length !=  0){
                urlElements.forEach(element => {
                    if(element.sowndBlocked){
                        // bloquer le son
                    }

                    if(element.blockUrl){
                        // bloquer l'acces
                    }
                });
            }
        }

        blockUrl()

    },[urlElements])
}


export default  useBlockUrl