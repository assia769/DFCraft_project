import { browserAPI } from "../shared/utils/browserAPI";
import { updateStats } from "./background";

async function getUrls() {
  try {
    const result = await browserAPI.storage.local.get("urls");
    console.log("result", result);
    return result.urls || [];
  } catch (err) {
    console.error("Erreur lors de la récupération des URLs :", err);
    return [];
  }
}

async function blockAccess(result, tab) {
  if (!tab || typeof tab.url !== "string") return;

  for (const element of result) {
    if (!element.url) continue; // protection ici

    if (element.urlBlocked && tab.url.includes(element.url)) {
      console.error("Incrementing deflection count");
      updateStats("totalDeflectionsAttempted", 1);
      await browserAPI.tabs.update(tab.id, {
        url: browserAPI.runtime.getURL("staticPages/blocked.html"),
      });
    }
  }
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
async function blockSound(result) {
  const tabs = await browserAPI.tabs.query({});

  for (const element of result) {
    if (!element.sowndBlocked) continue;
    if (!element.url) continue; // protection ici

    for (const tab of tabs) {
      if (typeof tab.url !== "string") continue;

      if (tab.url.includes(element.url)) {
        await browserAPI.tabs.update(tab.id, { muted: true });
      }
    }
  }
}

// export function blockWorker() {

//             console.log("C est le browserApi :" , browserAPI )
//              browserAPI.tabs.onUpdated.addListener
// }

export function blockWorker() {
  console.log("C est le browserApi :");
  browserAPI.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log("changeInfo", changeInfo);
    console.log("tab", tab);
    if (changeInfo.status !== "complete" || !tab.url) return;
    try {
      console.log("Listner onUpdated");
      const result = await getUrls();
      console.log("result", result);
      await blockAccess(result, tab);
      await blockSound(result);
    } catch (error) {
      console.error("Erreur dans le blocage :", error);
    }
  });
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
