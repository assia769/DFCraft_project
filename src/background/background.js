// background.js
import { blockWorker } from "./blockerWorker.js";
import { loadTimer, startTimerLoop, setupTimerListener } from "./timeWorker.js";

const browserAPI = (() => {
  if (typeof browser !== "undefined" && browser.runtime) {
    return browser;
  }

  if (typeof chrome !== "undefined" && chrome.runtime) {
    return {
      runtime: {
        sendMessage: (message, callback) =>
          new Promise((resolve, reject) => {
            try {
              chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                else {
                  if (callback) callback(response);
                  resolve(response);
                }
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
        getContexts: (filter) => chrome.runtime.getContexts(filter),
      },
      storage: {
        local: {
          get: (keys) =>
            new Promise((resolve, reject) => {
              try {
                chrome.storage.local.get(keys, (result) => {
                  if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
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
                  if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
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
      },
      action: chrome.action || chrome.browserAction,
      action: chrome.action || chrome.browserAction,
      offscreen: chrome.offscreen, // Add this
      notifications: chrome.notifications,
    };
  }

  // fallback for testing in non-extension environment
  console.warn("No browser extension API found - using mock");
  return {
    runtime: {
      sendMessage: () => Promise.resolve(null),
      onMessage: { addListener: () => {}, removeListener: () => {} },
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

async function init() {
  await loadTimer();

  // 2️⃣ Installer le listener spécifique au timer
  setupTimerListener();

  // 3️⃣ Démarrer la boucle du timer

  startTimerLoop();
  blockWorker();

  console.log("C'est le background    .........");
}

init();
let offscreenReady = false;
let offscreenReadyTs = 0;

let timerData = {
  time: 1500,
  isRunning: false,
  lastUpdate: Date.now(),
  originalTime: 1500,
  workTime: 1500,
  breakTime: 300,
  longBreakTime: 900,
  phaseType: "work",
  sessionCount: 0,
};

// Load saved state
browserAPI.storage.local.get(["timerData"]).then((result) => {
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
    console.log(
      `⏩ Calculated elapsed time: ${secondsPassed}s (${oldTime} → ${timerData.time})`,
    );
    saveTimerData();
  }
}

function saveTimerData() {
  browserAPI.storage.local.set({ timerData });
}

let currentAmbientAudio = null;
let isAmbientPlaying = false;
let firefoxAudio = null;
let firefoxListeners = null;
let firefoxTimeInterval = null;

// Message listener
browserAPI.runtime.onMessage.addListener( async (request, sender, sendResponse) => {
  if (request.type === "GET_TIMER") {
    updateTimerFromLastSave();
    sendResponse(timerData);
  } else if (request.type === "UPDATE_TIMER") {
    const oldData = { ...timerData };
    timerData = {
      ...timerData,
      ...request.data,
      lastUpdate: Date.now(),
    };

    console.log("🔄 UPDATE:", {
      before: oldData,
      after: timerData,
      changed: {
        time: oldData.time !== timerData.time,
        isRunning: oldData.isRunning !== timerData.isRunning,
      },
    });

    saveTimerData();
    sendResponse({ success: true });
  }

  if (request.type === "PLAY_AMBIENT_SOUND") {
    currentAmbientAudio = request.soundUrl;
    isAmbientPlaying = true;

    // ✅ Now broadcast with the CORRECT currentSound
    broadcastAudioStatus("loading", {
      progress: 0,
      currentSound: request.soundUrl, // Explicitly pass the new sound
    });

    playAmbientSound(request.soundUrl)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((e) => {
        console.error("[BG] playAmbientSound failed:", e);
        broadcastAudioStatus("error", { error: String(e) });
        sendResponse({ success: false, error: String(e) });
      });
    return true;
  }

  if (request.type === "PAUSE_AMBIENT_SOUND") {
    pauseAmbientSound();
    isAmbientPlaying = false;
    broadcastAudioStatus("paused");
    sendResponse({ success: true });
    return true;
  }

  if (request.type === "STOP_AMBIENT_SOUND") {
    stopAmbientSound();
    isAmbientPlaying = false;
    currentAmbientAudio = null;
    broadcastAudioStatus("stopped"); // Add this broadcast
    sendResponse({ success: true });
    return true;
  }

  if (request.type === "GET_AMBIENT_STATUS") {
    if (browserAPI.offscreen) {
      try {
        browserAPI.runtime.sendMessage(
          { type: "GET_AMBIENT_STATUS_OFFSCREEN" },
          (response) => {
            if (browserAPI.runtime.lastError) {
              sendResponse({
                isPlaying: isAmbientPlaying,
                currentSound: currentAmbientAudio || null,
              });
            } else {
              sendResponse(response);
            }
          },
        );
        return true;
      } catch (e) {
        console.error("GET_AMBIENT_STATUS error:", e);
      }
    }
    if (!browserAPI.offscreen) {
      sendResponse({
        isPlaying: isAmbientPlaying,
        currentSound: currentAmbientAudio || null,
      });
    }
  }

  if (request.type === "AUDIO_STATUS_FROM_OFFSCREEN") {
    console.log("[BG] 📥 Status from offscreen:", request);

    // ✅ Don't let offscreen clear the currentSound unless it's explicitly stopped
    if (request.status === "stopped" || request.status === "error") {
      isAmbientPlaying = false;
      currentAmbientAudio = null;
    } else {
      isAmbientPlaying = request.isPlaying;
      // Only update if offscreen provides a valid URL
      if (request.currentSound) {
        currentAmbientAudio = request.currentSound;
      }
    }

    // Broadcast to popup
    broadcastAudioStatus(request.status, {
      progress: request.progress,
      error: request.error,
      currentSound: currentAmbientAudio,
      currentTime: request.currentTime,
      duration: request.duration,
    });

    sendResponse({ success: true });
    return true; // ✅ Keep channel open
  }

  if (request.type === "OFFSCREEN_READY") {
    offscreenReady = true;
    offscreenReadyTs = Date.now();
    console.log("[BG] received OFFSCREEN_READY from offscreen");
    sendResponse({ ok: true });
    return true;
  }

  if (request.type === "SEEK_TO_POSITION") {
    if (browserAPI.offscreen) {
      // Chrome - forward to offscreen
      browserAPI.runtime.sendMessage(
        { type: "SEEK_TO_POSITION_OFFSCREEN", time: request.time },
        (resp) => {
          if (browserAPI.runtime.lastError) {
            console.error(
              "[BG] Seek failed:",
              browserAPI.runtime.lastError.message,
            );
            sendResponse({ success: false, error: "Seek failed" });
          } else {
            sendResponse(resp);
          }
        },
      );
    } else if (firefoxAudio) {
      // Firefox - seek directly
      try {
        firefoxAudio.currentTime = request.time;
        sendResponse({ success: true });
      } catch (e) {
        sendResponse({ success: false, error: String(e) });
      }
    }
    return true;
  }

  if (request.type === "UPDATE_TASK_STATS") {
    const { subType, priority, amount, isCompleted } = request;

    if (subType === "complete") {
      console.warn(`Updating task stats: ${isCompleted ? "Completing" : "Uncompleting"} a task with priority ${priority} (amount: ${amount})`);
      await updateStats("tasksCompleted", amount);
      await updateStats("tasksCompleted_" + priority, amount);
      await updateStats("tasksPending", -amount);
    }else if (subType === "delete") {
      if (!isCompleted){
        await updateStats("tasksPending", -1);
      }else{
        console.warn("Decrementing completed count for priority", "tasksCompleted_" + priority);
        await updateStats("tasksCompleted", -1);
        await updateStats("tasksCompleted_" + priority, -1);
      }
    }else if (subType === "create") {
      console.warn("Incrementing created and pending task counts");
      await updateStats("tasksCreated", amount);
      await updateStats("tasksPending", amount);
    }else if(subType === "edit") {
      console.warn(`Editing task priority from ${request.prevPriority} to ${request.newPriority}`);
      if (request.isCompleted) {
        await updateStats("tasksCompleted_" + request.prevPriority, -1);
        await updateStats("tasksCompleted_" + request.newPriority, 1);
      }
    }
  }

  return true; // Keep channel open for async response
});

let _audioCtx = null;

function getAudioContext() {
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new AudioContext();
  }
  if (_audioCtx.state === "suspended") {
    _audioCtx.resume();
  }
  return _audioCtx;
}

async function playSound(soundName) {
  try {
    // ── Chrome path (offscreen document) ──────────────────────
    if (browserAPI.offscreen) {
      const existingContexts = await browserAPI.runtime.getContexts({});
      const offscreenDocument = existingContexts.find(
        (c) => c.contextType === "OFFSCREEN_DOCUMENT",
      );

      if (!offscreenDocument) {
        await browserAPI.offscreen.createDocument({
          url: "offscreen.html",
          reasons: ["AUDIO_PLAYBACK"],
          justification: "Play timer completion sound",
        });
      }

      browserAPI.runtime.sendMessage({
        type: "PLAY_SOUND",
        soundUrl: browserAPI.runtime.getURL(`sounds/${soundName}.wav`),
      });

      return; // ← done for Chrome
    }

    const formats = [`sounds/${soundName}.wav`, `sounds/${soundName}.mp3`];

    let arrayBuffer = null;
    let lastError = null;

    for (const fmt of formats) {
      try {
        const url = browserAPI.runtime.getURL(fmt);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} for ${url}`);
        }

        arrayBuffer = await response.arrayBuffer();
        break; // success — stop trying other formats
      } catch (err) {
        lastError = err;
        console.warn(`[BG] Could not load ${fmt}:`, err);
      }
    }

    if (!arrayBuffer) {
      throw lastError ?? new Error("All audio formats failed to load");
    }

    const ctx = getAudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start(0);

    console.log(`[BG] ✅ Firefox notification sound played: ${soundName}`);
  } catch (error) {
    console.error("[BG] playSound failed:", error);

    // ── Last-resort HTML5 Audio fallback ─────────────────────
    // Works in some Firefox configurations; harmless if it fails.
    try {
      const audio = new Audio(
        browserAPI.runtime.getURL(`sounds/${soundName}.wav`),
      );
      await audio.play();
    } catch (fallbackErr) {
      console.error("[BG] HTML5 Audio fallback also failed:", fallbackErr);
    }
  }
}
// Timer loop
// In background.js, inside the timer loop:
setInterval(() => {
  if (timerData.isRunning && timerData.time > 0) {
    timerData.time--;
    timerData.lastUpdate = Date.now();
    saveTimerData();

    const typeMapping = {
      work: "totalWorkTime",
      break: "totalBreakTime",
      longBreak: "totalLongBreakTime",
    };

    updateStats(typeMapping[timerData.phaseType], 1);

    // Update badge
    if (browserAPI.action && browserAPI.action.setBadgeText) {
      browserAPI.action.setBadgeText({ text: String(timerData.time) });
    }

    // Notify open pages
    browserAPI.runtime
      .sendMessage({
        type: "TIMER_TICK",
        data: timerData,
      })
      .catch(() => {});
  } else if (timerData.time === 0 && timerData.isRunning) {
    // Timer hit 0, switch phases
    if (timerData.phaseType === "work") {
      timerData.sessionCount++;
      updateStats("totalSessions", 1);
      if (timerData.sessionCount % 4 === 0 && timerData.longBreakTime > 0) {
        timerData.phaseType = "longBreak";
        timerData.time = timerData.longBreakTime;
        timerData.originalTime = timerData.longBreakTime;
        console.log("Switching to long break phase:", timerData.longBreakTime);
      } else if (timerData.breakTime > 0) {
        timerData.phaseType = "break";
        timerData.time = timerData.breakTime;
        timerData.originalTime = timerData.breakTime;
        console.log("Switching to break phase:", timerData.breakTime);
      }
      timerData.lastUpdate = Date.now();
      playSound("notification");
    } else if (timerData.phaseType === "break" && timerData.workTime > 0) {
      timerData.phaseType = "work";
      timerData.time = timerData.workTime;
      timerData.originalTime = timerData.workTime;
      timerData.lastUpdate = Date.now();
      console.log("Switching to work phase:", timerData.workTime);
      playSound("notification");
    } else if (timerData.phaseType === "longBreak" && timerData.workTime > 0) {
      timerData.sessionCount = 0;
      timerData.phaseType = "work";
      timerData.time = timerData.workTime;
      timerData.originalTime = timerData.workTime;
      timerData.lastUpdate = Date.now();
      console.log("Switching to work phase:", timerData.workTime);
      playSound("notification");
    } else {
      // No break/work time set, just stop
      timerData.isRunning = false;
      console.log("Timer finished, no next phase");
    }

    saveTimerData();

    // Notify popup of phase change
    browserAPI.runtime
      .sendMessage({
        type: "PHASE_CHANGE",
        data: timerData,
      })
      .catch(() => {});
  }

  if (isAmbientPlaying) {
    updateStats("totalListenTime", 1);
  }
}, 1000);

async function playAmbientSound(soundUrl) {
  console.log("🎵 Requesting ambient sound playback:", soundUrl);

  if (
    browserAPI.offscreen &&
    typeof browserAPI.offscreen.createDocument === "function"
  ) {
    await ensureOffscreenDocument();
    await new Promise((r) => setTimeout(r, 50));
    // instruct offscreen to play
    browserAPI.runtime.sendMessage(
      { type: "PLAY_AMBIENT_SOUND_OFFSCREEN", soundUrl },
      (resp) => {
        if (browserAPI.runtime.lastError) {
          console.warn(
            "[BG] sendMessage to offscreen lastError:",
            browserAPI.runtime.lastError.message,
          );
          broadcastAudioStatus("error", {
            error: "Failed to communicate with audio player",
            currentSound: soundUrl, // ✅ Include the sound URL
          });
          isAmbientPlaying = false;
          currentAmbientAudio = null;
        } else {
          console.log("[BG] offscreen play request sent:", resp);
          currentAmbientAudio = soundUrl;
          isAmbientPlaying = true;
        }
      },
    );
    return;
  }

  if (typeof Audio !== "undefined") {
    console.log(
      "[BG] Playing ambient in background (direct Audio) - Firefox fallback",
    );
    // stop existing firefoxAudio
    if (firefoxAudio && firefoxAudio.src === soundUrl && firefoxAudio.paused) {
      console.log("▶️ [FIREFOX] Resuming paused audio");
      firefoxAudio.play().catch((err) => {
        console.error("[BG] firefoxAudio resume failed:", err);
        broadcastAudioStatus("error", { error: "Playback failed" });
      });
      currentAmbientAudio = soundUrl;
      isAmbientPlaying = true;
      return;
    }

    console.log("🆕 [FIREFOX] Loading new audio");

    // Stop existing firefoxAudio
    if (firefoxAudio) {
      try {
        firefoxAudio.pause();
        removeFirefoxListeners();
        firefoxAudio.src = "";
        firefoxAudio = null;
      } catch (e) {
        console.error("[BG] firefoxAudio pause error:", e);
      }
    }

    firefoxAudio = new Audio(soundUrl);
    firefoxAudio.loop = true;
    firefoxAudio.preload = "auto";

    firefoxListeners = {
      loadstart: () => broadcastAudioStatus("loading", { progress: 0 }),
      canplay: () => broadcastAudioStatus("ready", { progress: 100 }),
      playing: () => {
        isAmbientPlaying = true;
        if (firefoxTimeInterval) {
          clearInterval(firefoxTimeInterval);
        }
        firefoxTimeInterval = setInterval(() => {
          if (firefoxAudio && !firefoxAudio.paused) {
            broadcastAudioStatus("timeupdate", {
              currentTime: firefoxAudio.currentTime || 0,
              duration: firefoxAudio.duration || 0,
            });
          }
        }, 500);
        broadcastAudioStatus("playing");
      },
      pause: () => {
        isAmbientPlaying = false;
        if (firefoxTimeInterval) {
          clearInterval(firefoxTimeInterval);
          firefoxTimeInterval = null;
        }
        broadcastAudioStatus("paused");
      },
      waiting: () => broadcastAudioStatus("buffering"),
      error: (e) => {
        isAmbientPlaying = false;
        broadcastAudioStatus("error", {
          error: e?.message || "Playback error",
        });
      },
      progress: () => {
        if (
          firefoxAudio &&
          firefoxAudio.buffered.length > 0 &&
          firefoxAudio.duration
        ) {
          try {
            const bufferedEnd = firefoxAudio.buffered.end(
              firefoxAudio.buffered.length - 1,
            );
            const progress = (bufferedEnd / firefoxAudio.duration) * 100;
            broadcastAudioStatus("progress", { progress });
          } catch (e) {
            console.error("[BG] firefoxAudio progress calculation error:", e);
          }
        }
      },
    };

    // add listeners similar to offscreen
    firefoxAudio.addEventListener("loadstart", firefoxListeners.loadstart);
    firefoxAudio.addEventListener("canplay", firefoxListeners.canplay);
    firefoxAudio.addEventListener("playing", firefoxListeners.playing);
    firefoxAudio.addEventListener("pause", firefoxListeners.pause);
    firefoxAudio.addEventListener("waiting", firefoxListeners.waiting);
    firefoxAudio.addEventListener("error", firefoxListeners.error);
    firefoxAudio.addEventListener("progress", firefoxListeners.progress);

    firefoxAudio.play().catch((err) => {
      console.error("[BG] firefoxAudio play failed:", err);
      broadcastAudioStatus("error", { error: "Playback failed" });
    });

    currentAmbientAudio = soundUrl;
    isAmbientPlaying = true;
    return;
  }

  // otherwise fail
  throw new Error("No offscreen and no Audio fallback available");
}

function removeFirefoxListeners() {
  if (!firefoxAudio || !firefoxListeners) return;

  console.log("[BG] 🧹 Removing Firefox listeners");

  firefoxAudio.removeEventListener("loadstart", firefoxListeners.loadstart);
  firefoxAudio.removeEventListener("canplay", firefoxListeners.canplay);
  firefoxAudio.removeEventListener("playing", firefoxListeners.playing);
  firefoxAudio.removeEventListener("pause", firefoxListeners.pause);
  firefoxAudio.removeEventListener("waiting", firefoxListeners.waiting);
  firefoxAudio.removeEventListener("error", firefoxListeners.error);
  firefoxAudio.removeEventListener("progress", firefoxListeners.progress);

  firefoxListeners = null;
}

async function pauseAmbientSound() {
  console.log("⏸️ Requesting pause");

  if (browserAPI.offscreen) {
    try {
      await ensureOffscreenDocument();
      browserAPI.runtime.sendMessage(
        { type: "PAUSE_AMBIENT_SOUND_OFFSCREEN" },
        (resp) => {
          if (browserAPI.runtime.lastError) {
            console.warn(
              "[BG] pauseOffscreen lastError:",
              browserAPI.runtime.lastError.message,
            );
          } else {
            console.log("[BG] pauseOffscreen resp:", resp);
          }
        },
      );
    } catch (e) {
      console.error(e);
    }
    isAmbientPlaying = false;
  } else if (firefoxAudio) {
    try {
      firefoxAudio.pause();
    } catch (e) {
      console.error("[BG] firefoxAudio pause error:", e);
    }
    isAmbientPlaying = false;
    broadcastAudioStatus("paused");
  }
}

async function stopAmbientSound() {
  console.log("⏹️ Requesting stop");
  if (browserAPI.offscreen) {
    try {
      await ensureOffscreenDocument();
      browserAPI.runtime.sendMessage(
        { type: "STOP_AMBIENT_SOUND_OFFSCREEN" },
        (resp) => {
          if (browserAPI.runtime.lastError) {
            console.warn(
              "[BG] Stop failed:",
              browserAPI.runtime.lastError.message,
            );
          } else {
            console.log("[BG] ✅ Stop confirmed:", resp);
          }
        },
      );
      isAmbientPlaying = false;
      currentAmbientAudio = null;
    } catch (error) {
      console.error("Failed to stop:", error);
    }
  } else if (firefoxAudio) {
    try {
      firefoxAudio.pause();
      firefoxAudio.currentTime = 0;
      removeFirefoxListeners();
      firefoxAudio.src = "";
      firefoxAudio = null;
      isAmbientPlaying = false;
      currentAmbientAudio = null;
      broadcastAudioStatus("stopped");
      console.log("[BG] ✅ Firefox audio stopped");
    } catch (e) {
      console.error("[BG] firefoxAudio stop error:", e);
    }
  }
}

async function ensureOffscreenDocument() {
  if (!browserAPI.offscreen) {
    console.log("⚠️ Offscreen API not available (Firefox)");
    return;
  }

  try {
    const existingContexts = await browserAPI.runtime.getContexts({});
    const offscreenDocument = existingContexts.find(
      (context) => context.contextType === "OFFSCREEN_DOCUMENT",
    );

    if (!offscreenDocument) {
      console.log("📄 Creating offscreen document");
      await browserAPI.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Play ambient and notification sounds",
      });

      const start = Date.now();
      const timeoutMs = 4000;
      while (!offscreenReady && Date.now() - start < timeoutMs) {
        await new Promise((r) => setTimeout(r, 100)); // poll
      }
      if (!offscreenReady) {
        console.warn(
          "[BG] offscreen created but OFFSCREEN_READY not received within timeout",
        );
      } else {
        console.log(
          "[BG] offscreen reported READY at",
          new Date(offscreenReadyTs).toISOString(),
        );
      }
    } else {
      console.log("[BG] offscreen already exists");
      // if it exists but we haven't seen ready, try to ping it once
      if (!offscreenReady) {
        try {
          browserAPI.runtime.sendMessage({ type: "PING_OFFSCREEN" }, (resp) => {
            if (!browserAPI.runtime.lastError && resp && resp.ok) {
              offscreenReady = true;
              offscreenReadyTs = Date.now();
              console.log("[BG] ping to offscreen succeeded");
            } else {
              console.log(
                "[BG] ping_offscreen failed:",
                browserAPI.runtime.lastError?.message,
              );
            }
          });
        } catch (e) {
          console.warn("[BG] ping_offscreen exception:", e);
        }
      }
    }
  } catch (e) {
    console.error("[BG] ensureOffscreenDocument error:", e);
  }
}

firefoxTimeInterval = setInterval(() => {
  if (firefoxAudio && !firefoxAudio.paused) {
    broadcastAudioStatus("timeupdate", {
      currentTime: firefoxAudio.currentTime,
      duration: firefoxAudio.duration || 0,
    });
  }
}, 500);

// When audio stops/pauses, clear it:
if (firefoxTimeInterval) {
  clearInterval(firefoxTimeInterval);
  firefoxTimeInterval = null;
}

function broadcastAudioStatus(status, data = {}) {
  const message = {
    type: "AUDIO_STATUS_UPDATE",
    status,
    isPlaying: isAmbientPlaying,
    currentSound: data.currentSound || currentAmbientAudio,
    ...data,
  };

  console.log("[BG] 📤 Broadcasting:", message);

  try {
    browserAPI.runtime.sendMessage(message, (resp) => {
      if (browserAPI.runtime.lastError) {
        if (
          !browserAPI.runtime.lastError.message.includes(
            "Receiving end does not exist",
          )
        ) {
          console.warn(
            "[BG] sendMessage lastError:",
            browserAPI.runtime.lastError?.message,
          );
        }
      } else {
        // optional debug
        // console.log("[BG] sendMessage resp:", resp);
      }
    });
  } catch (e) {
    console.error("[BG] broadcast send error:", e);
  }
}

// For tracing the user usage of the application
export async function updateStats(type, amount = 1) {
  const today = new Date().toISOString().split("T")[0];
  const result = await browserAPI.storage.local.get(["statistics"]); // getting data if exists

  const stats = result.statistics || {
    totalWorkTime: 0,
    totalBreakTime: 0,
    totalLongBreakTime: 0,
    totalSessions: 0,
    totalListenTime: 0,
    totalDeflectionsAttempted: 0,
    tasksCompleted: 0,
    tasksCreated: 0,
    tasksPending: 0,
    tasksCompleted_high: 0,
    tasksCompleted_medium: 0,
    tasksCompleted_low: 0,
    days: [],
  };

  let todayStats = stats.days.find((d) => d.date === today);
  if (!todayStats) {
    todayStats = {
      date: today,
      totalWorkTime: 0,
      totalBreakTime: 0,
      totalLongBreakTime: 0,
      totalSessions: 0,
      totalListenTime: 0,
      totalDeflectionsAttempted: 0,
      tasksCompleted: 0,
      tasksCreated: 0,
      tasksPending: 0,
      tasksCompleted_high: 0,
      tasksCompleted_medium: 0,
      tasksCompleted_low: 0,
    };
    stats.days.push(todayStats);
  }

  if (stats[type] !== undefined) {
    stats[type] += amount;
  } else {
    console.warn(`Unknown stats type: ${type}`);
  }

  if (todayStats[type] !== undefined) {
    todayStats[type] += amount;
  } else {
    console.warn(`Unknown stats type for today: ${type}`);
  }

  await browserAPI.storage.local.set({ statistics: stats });
}
