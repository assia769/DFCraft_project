import { ConciergeBell, Rss } from "lucide-react";
import { browserAPI } from "../shared/utils/browserAPI";






async function getUrls() {
    try {
        const result = await browserAPI.storage.local.get('urls');
        console.log('result', result)
        return result.urls || [];
    } catch (err) {
        console.error('Erreur lors de la récupération des URLs :', err);
        return [];
    }
}



async function blockAccess(result , tab  ) {
     
         result.forEach(async (element) => {
            if(element.urlBlocked && tab &&  tab.url.includes(element.url)){
                await browserAPI.tabs.update(tab.id, { url: browserAPI.runtime.getURL("staticPages/blocked.html") });
            }     
         });
}


// // Bloquer ou activer le son sur les onglets
// async function blockSound(element) {
//     const tabs = await browserAPI.tabs.query({});
//     for (const tab of tabs) {
//         if (tab.url && tab.url.includes(element.url)) {
//             await browserAPI.tabs.update(tab.id, { muted: element.soundBlocked });
//         }
//     }
// }


// Bloquer ou activer le son sur les onglets
async function blockSound( result) {
    result.forEach(async (element) => {
        if (element.sowndBlocked) {
            const tabs = await browserAPI.tabs.query({});
            console.log('tabs', tabs)
            for (const tab of tabs) {
                if (tab.url && tab.url.includes(element.url)) {
                    await browserAPI.tabs.update(tab.id, { muted: true });
                }
            }
        }
    });
}




// export function blockWorker() {
    
//             console.log("C est le browserApi :" , browserAPI )
//              browserAPI.tabs.onUpdated.addListener
// }

export function blockWorker() {
           browserAPI.tabs.onUpdated.addListener(async (tabId, changeInfo, tab)=> {
                try {
                    console.log("Listner onUpdated")
                    const result = await getUrls()
                     await blockAccess(result ,tab)
                     await blockSound(result)
                } catch (error) {
                    console.error("Erreur dans le blocage :", error);
                }
            })
}



// export function signalReceiverBlocker() {
//     browserAPI.runtime.onMessage.addListener(async (message, sendResponse) => {
//         try {
//             if (message.type === "BLOC") {
//                 const result = await getUrls
//                 result.forEach(async (element) => {
//                     if (message.sownd) {
//                         await blockSound(element);
//                     }
//                     if (message.acces) {
//                         await blockAccess(element);

//                     }
//                 });


//                 // On peut répondre si on veut
//                 sendResponse({ status: "ok", message: "Timer lancé !" });
//             }
//         } catch (error) {
//             console.error("Erreur dans le blocage :", error);
//             sendResponse({ status: "error", message: err.message });
//         }

//         return true;
//     });
// }