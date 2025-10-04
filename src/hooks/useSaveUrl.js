import { useEffect } from "react";


const useSaveUrl =(urlElements)=>{
      useEffect(()=>{
           
            function saveUrl(){
                if(urlElements.length !=  0){
                    urlElements.forEach(element => {
                      // sauvgarder  les element
                    });
                }
            }
    
            saveUrl()
    
        },[urlElements])
}


export default  useSaveUrl