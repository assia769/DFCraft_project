const browserAPI = (() => {
  if (typeof browser !== "undefined") return browser;
  if (typeof chrome !== "undefined") {
    return {
      runtime: chrome.runtime,
      storage: {
        local: {
          get: (keys) =>
            new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
          set: (items) =>
            new Promise((resolve) => chrome.storage.local.set(items, resolve)),
        },
      },
      action: chrome.action || chrome.browserAction,
    };
  }
})();


browserAPI.runtime.onMessage.addListener((message) => {
  if (message.type === 'PLAY_SOUND') {
    const audio = new Audio(message.soundUrl);
    audio.play();
  }
});