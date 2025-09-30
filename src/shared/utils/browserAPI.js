// Detect which API is available and normalize it
export const browserAPI = (() => {
  // Firefox uses 'browser', Chrome uses 'chrome'
  if (typeof browser !== 'undefined' && browser.runtime) {
    return browser; // Firefox (already Promise-based)
  }
  
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    // Chrome - wrap in Promises for consistency
    return {
      runtime: {
        sendMessage: (message) => {
          return new Promise((resolve, reject) => {
            try {
              chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                  reject(chrome.runtime.lastError);
                } else {
                  resolve(response);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        },
        onMessage: {
          addListener: (callback) => {
            chrome.runtime.onMessage.addListener(callback);
          },
          removeListener: (callback) => {
            chrome.runtime.onMessage.removeListener(callback);
          }
        }
      },
      storage: {
        local: {
          get: (keys) => {
            return new Promise((resolve, reject) => {
              try {
                chrome.storage.local.get(keys, (result) => {
                  if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                  } else {
                    resolve(result);
                  }
                });
              } catch (error) {
                reject(error);
              }
            });
          },
          set: (items) => {
            return new Promise((resolve, reject) => {
              try {
                chrome.storage.local.set(items, () => {
                  if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              } catch (error) {
                reject(error);
              }
            });
          }
        }
      },
      action: chrome.action || chrome.browserAction, // Chrome compatibility
      notifications: chrome.notifications
    };
  }
  
  // Fallback for testing in non-extension environment
  console.warn('No browser extension API found - using mock');
  return {
    runtime: {
      sendMessage: () => Promise.resolve(null),
      onMessage: {
        addListener: () => {},
        removeListener: () => {}
      }
    },
    storage: {
      local: {
        get: () => Promise.resolve({}),
        set: () => Promise.resolve()
      }
    }
  };
})();