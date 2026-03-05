export const browserAPI = (() => {
  // Firefox uses 'browser', Chrome uses 'chrome'
  if (typeof browser !== 'undefined' && browser.runtime) {
    return browser; // Firefox (already Promise-based)
  }

  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return {
      runtime: {
        sendMessage: (message) =>
          new Promise((resolve, reject) => {
            try {
              chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                else resolve(response);
              });
            } catch (err) {
              reject(err);
            }
          }),
        onMessage: {
          addListener: (cb) => chrome.runtime.onMessage.addListener(cb),
          removeListener: (cb) => chrome.runtime.onMessage.removeListener(cb),
        },
        getURL: (path) => chrome.runtime.getURL(path),
      },
      storage: {
        local: {
          get: (keys) =>
            new Promise((resolve, reject) => {
              try {
                chrome.storage.local.get(keys, (result) => {
                  if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                  else resolve(result);
                });
              } catch (err) {
                reject(err);
              }
            }),
          set: (items) =>
            new Promise((resolve, reject) => {
              try {
                chrome.storage.local.set(items, () => {
                  if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                  else resolve();
                });
              } catch (err) {
                reject(err);
              }
            }),
        },
      },
      tabs: {
        query: (queryInfo) =>
          new Promise((resolve, reject) => {
            try {
              chrome.tabs.query(queryInfo, (tabs) => {
                if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                else resolve(tabs);
              });
            } catch (err) {
              reject(err);

            }
          }),
        update: (tabId, updateProperties) =>
          new Promise((resolve, reject) => {
            try {
              chrome.tabs.update(tabId, updateProperties, (tab) => {
                if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                else resolve(tab);
              });
            } catch (err) {
              reject(err);
            }
          }),
        onCreated: {
          addListener: (cb) => chrome.tabs.onCreated.addListener(cb),
          removeListener: (cb) => chrome.tabs.onCreated.removeListener(cb),
        },
        onUpdated: {
          addListener: (cb) => chrome.tabs.onUpdated.addListener(cb),
          removeListener: (cb) => chrome.tabs.onUpdated.removeListener(cb),
        },
      },
      action: chrome.action || chrome.browserAction,
      notifications: chrome.notifications,
    };
  }

  // fallback for testing in non-extension environment
  console.warn('No browser extension API found - using mock');
  return {
    runtime: {
      sendMessage: () => Promise.resolve(null),
      onMessage: { addListener: () => { }, removeListener: () => { } },
      getURL: (path) => path,
    },
    storage: {
      local: { get: () => Promise.resolve({}), set: () => Promise.resolve() },
    },
    tabs: { query: () => Promise.resolve([]), update: () => Promise.resolve() },
    action: {},
    notifications: {},
  };
})();
