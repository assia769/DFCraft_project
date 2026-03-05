
    import UrlContext from "../context/urlContext";
    import { useState, useEffect } from "react";
    import { browserAPI } from "../utils/browserAPI";


    export const UrlProvider =  ({children})=>{
        
        const [urlElements, setUrlElement] = useState([]);

        useEffect(() => {
            const loadUrls = async () => {
                const saved = await browserAPI.storage.local.get("urls");
                console.log("saved", saved);
                if (saved && saved.urls) {
                    setUrlElement(saved.urls);
                }
                else {
                    setUrlElement([]);
                }
            };
            loadUrls();
        }, []);




        return(
            <>
                <UrlContext.Provider value={{urlElements , setUrlElement}}>
                    {children}
                </UrlContext.Provider>
            </>
        )
    }