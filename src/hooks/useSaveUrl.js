


const useSaveUrl =(urlElements)=>{
      useEffect(()=>{
           
            function saveUrl(){
                if(urlElements.length !=  0){
                    urlElements.forEach(element => {
                      // sauvgarder  les element
                    });
                }
            }
    
            blockUrl()
    
        },[urlElements])
}


export default  useSaveUrl