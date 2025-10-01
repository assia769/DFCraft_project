// Use the same wrapper approach
const browserAPI = (() => {
  if (typeof browser !== 'undefined') return browser;
  if (typeof chrome !== 'undefined') {
    return {
      runtime: chrome.runtime,
      storage: {
        local: {
          get: (keys) => new Promise(resolve => 
            chrome.storage.local.get(keys, resolve)
          ),
          set: (items) => new Promise(resolve => 
            chrome.storage.local.set(items, resolve)
          )
        }
      },
      action: chrome.action || chrome.browserAction
    };
  }
})();

let timerData = {
  time: 60,
  isRunning: false,
  lastUpdate: Date.now()
};

// Load saved state
browserAPI.storage.local.get(['timerData']).then((result) => {
  if (result.timerData) {
    timerData = result.timerData;
    updateTimerFromLastSave();
  }
});

function updateTimerFromLastSave() {
  if (timerData.isRunning && timerData.time > 0) {
    const now = Date.now();
    const secondsPassed = Math.floor((now - timerData.lastUpdate) / 1000);
    const oldTime = timerData.time;
    timerData.time = Math.max(0, timerData.time - secondsPassed);
    timerData.lastUpdate = now;
    console.log(`⏩ Calculated elapsed time: ${secondsPassed}s (${oldTime} → ${timerData.time})`);
    saveTimerData();
  }
}

function saveTimerData() {
  browserAPI.storage.local.set({ timerData });
}

// Message listener
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_TIMER') {
    updateTimerFromLastSave();
    sendResponse(timerData);
  } else if (request.type === 'UPDATE_TIMER') {
    const oldData = { ...timerData };
    timerData = { 
      ...timerData, 
      ...request.data, 
      lastUpdate: Date.now() 
    };

    console.log('🔄 UPDATE:', {
      before: oldData,
      after: timerData,
      changed: {
        time: oldData.time !== timerData.time,
        isRunning: oldData.isRunning !== timerData.isRunning
      }
    });
    
    saveTimerData();
    sendResponse({ success: true });
  }
  return true; // Keep channel open for async response
});

// Timer loop
setInterval(() => {
  if (timerData.isRunning && timerData.time > 0) {
    timerData.time--;
    timerData.lastUpdate = Date.now();
    saveTimerData();
    
    // Update badge
    if (browserAPI.action && browserAPI.action.setBadgeText) {
      browserAPI.action.setBadgeText({ text: String(timerData.time) });
    }
    
    // Notify open pages
    browserAPI.runtime.sendMessage({ 
      type: 'TIMER_TICK', 
      data: timerData 
    }).catch(() => {}); // Ignore if no listeners
  }
}, 1000);