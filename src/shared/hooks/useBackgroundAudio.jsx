import { useEffect, useState } from "react";
import { browserAPI } from "../utils/browserAPI";

export default function useBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    const handleMessage = (m, sender, sendResponse) => {
      if (m.type === "AUDIO_STATUS_UPDATE") {
        console.log("Received AUDIO_STATUS_UPDATE:", m);
        if (m.currentSound) {
          setCurrentSound(m.currentSound);
        }

        switch (m.status) {
          case "ready":
            setIsPlaying(true);
            setLoading(false);
            setBuffering(false);
            setError(null);
            if (m.progress !== undefined) {
              setBufferProgress(m.progress);
            }
            break;

          case "playing":
            setIsPlaying(true);
            setLoading(false);
            setBuffering(false);
            setError(null);
            break;

          case "paused":
            setIsPlaying(false);
            setLoading(false);
            setBuffering(false);
            setError(null);
            break;

          case "buffering":
            setBuffering(true);
            setIsPlaying(m.isPlaying);
            break;

          case "progress":
            setLoading(false);
            setBuffering(false);
            setIsPlaying(true);
            setError(null);
            if (m.progress !== undefined) {
              setBufferProgress(m.progress);
            }
            break;

          case "loading":
            setLoading(true);
            setBuffering(false);
            setError(null);
            setIsPlaying(m.isPlaying);
            if (m.progress !== undefined) {
              setBufferProgress(m.progress);
            }
            break;

          case "error":
            setLoading(false);
            setBuffering(false);
            setError(m.error || "Unknown error");
            setIsPlaying(false);
            break;

          case "stopped":
            setIsPlaying(false);
            setCurrentSound(null);
            setLoading(false);
            setBuffering(false);
            setBufferProgress(0);
            setError(null);
            break;

          case "timeupdate":
            if (!seeking) {
              setCurrentTime(m.currentTime);
              setDuration(m.duration);
              setSeeking(false);
            }
            break;

          default:
            break;
        }
      }
      return true;
    };

    browserAPI.runtime.onMessage.addListener(handleMessage);

    const queryStatus = async () => {
      try {
        const res = await browserAPI.runtime.sendMessage({
          type: "GET_AMBIENT_STATUS",
        });
        if (res) {
          setIsPlaying(res.isPlaying);
          setCurrentSound(res.currentSound);
        }
      } catch (err) {
        console.error("Failed to query status:", err);
      }
    };

    queryStatus();

    return () => {
      browserAPI.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const seek = async (time) => {
    setSeeking(true);
    try {
      await browserAPI.runtime.sendMessage({
        type: "SEEK_TO_POSITION",
        time: time,
      });
    } catch (err) {
      console.error("Failed to seek:", err);
    } finally {
      setSeeking(false);
    }
  };

  const play = async (soundUrl) => {
    console.log("▶️ [HOOK] Playing:", soundUrl);
    setLoading(true);
    setError(null);
    setCurrentSound(soundUrl);
    
    setCurrentTime(0);
    setDuration(0);
      
    
    try {
      const response = await browserAPI.runtime.sendMessage({
        type: "PLAY_AMBIENT_SOUND",
        soundUrl,
      });
      if (!response?.success) {
        setLoading(false);
        setError(response?.error || "Failed to play");
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to play");
      console.error("Play error:", error);
    }
  };

  const pause = async () => {
    try {
      await browserAPI.runtime.sendMessage({ type: "PAUSE_AMBIENT_SOUND" });
    } catch (error) {
      console.error("Pause error:", error);
    }
  };

  const stop = async () => {
    try {
      const response = await browserAPI.runtime.sendMessage({
        type: "STOP_AMBIENT_SOUND",
      });
      if (response?.success) {
        setIsPlaying(false);
        setCurrentSound(null);
        setBufferProgress(0);
        setError(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Stop error:", error);
    }
  };

  return {
    isPlaying,
    currentSound,
    loading,
    buffering,
    bufferProgress,
    error,
    currentTime,
    duration,
    seeking,
    play,
    pause,
    stop,
    seek,
  };
}
