
import { browserAPI } from "../shared/utils/browserAPI";


export let timerData = {
  time: 60,
  isRunning: false,
  lastUpdate: Date.now()
};

// Charger l’état sauvegardé
export async function loadTimer() {
  const result = await browserAPI.storage.local.get(['timerData']);
  if (result.timerData) {
    timerData = result.timerData;
    updateTimerFromLastSave();
  }
}

// Calculer le temps écoulé depuis le dernier update
export function updateTimerFromLastSave() {
  if (timerData.isRunning && timerData.time > 0) {
    const now = Date.now();
    const secondsPassed = Math.floor((now - timerData.lastUpdate) / 1000);
    const oldTime = timerData.time;
    timerData.time = Math.max(0, timerData.time - secondsPassed);
    timerData.lastUpdate = now;
    console.log(`⏩ Elapsed: ${secondsPassed}s (${oldTime} → ${timerData.time})`);
    saveTimerData();
  }
}

// Sauvegarder l’état
export function saveTimerData() {
  browserAPI.storage.local.set({ timerData });
}

// Listener spécifique au timer
export function setupTimerListener() {
  browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_TIMER') {
      updateTimerFromLastSave();
      sendResponse(timerData);
    } else if (request.type === 'UPDATE_TIMER') {
      const oldData = { ...timerData };
      Object.assign(timerData, request.data, { lastUpdate: Date.now() });
      console.log('🔄 UPDATE:', { before: oldData, after: timerData });
      saveTimerData();
      sendResponse({ success: true });
    }
    return true; // Keep channel open for async response
  });
}

// Boucle du timer
export function startTimerLoop() {
  setInterval(() => {
    if (timerData.isRunning && timerData.time > 0) {
      timerData.time--;
      timerData.lastUpdate = Date.now();
      saveTimerData();

      // Mettre à jour badge
      if (browserAPI.action && browserAPI.action.setBadgeText) {
        browserAPI.action.setBadgeText({ text: String(timerData.time) });
      }

      // Notifier les pages ouvertes
      browserAPI.runtime.sendMessage({
        type: 'TIMER_TICK',
        data: timerData
      }).catch(() => {});
    }
  }, 1000);
}
