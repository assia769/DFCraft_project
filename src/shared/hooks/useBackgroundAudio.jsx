import { useEffect, useState } from "react";
import { browserAPI } from "../utils/browserAPI";

export default function useBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const handleMessage = (m, sender, sendResponse) => {
        if(m.type === "AUDIO_STATUS_UPDATE"){
            console.log("Received AUDIO_STATUS_UPDATE:", m);
            setIsPlaying(m.isPlaying);
            setCurrentSound(m.currentSound);

            switch(m.status){
                case "ready":
                    setIsPlaying(true);
                    setLoading(false);
                    setBuffering(false);
                    setError(null);
                    setBufferProgress(m.progress || 0);
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
                    break;

                case "progress": 
                    setBufferProgress(m.progress);
                    break;

                case "loading":
                    setLoading(true);
                    break;
                
                case "error":
                    setLoading(false);
                    setBuffering(false);
                    setError(m.error);
                    break;
                
                default:
                    break;
                
            }
        }
        return true
    };

    browserAPI.runtime.onMessage.addListener(handleMessage);

    const queryStatus = async () => {
        const res = await browserAPI.runtime.sendMessage({type: "GET_AMBIENT_STATUS"});
            if(res){
                setIsPlaying(res.isPlaying);
                setCurrentSound(res.currentSound);
            }
    };

    queryStatus();


    return () => {
        browserAPI.runtime.onMessage.removeListener(handleMessage);
    }
  }, []);

  const play = async (soundUrl) => {
    setLoading(true);
    setError(null);
    setCurrentSound(soundUrl)
    try {
        const response = await browserAPI.runtime.sendMessage(
            { type: "PLAY_AMBIENT_SOUND", soundUrl }
        );
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
    setIsPlaying(false);
    
    try {
        await browserAPI.runtime.sendMessage(
            {type: "PAUSE_AMBIENT_SOUND"}
        );
        // Don't set isPlaying here - let the AUDIO_STATUS_UPDATE message handle it
    } catch (error) {
        console.error("Pause error:", error);
    }
};

  const stop = async () => {
    try {
        const response = await browserAPI.runtime.sendMessage(
            {type: "STOP_AMBIENT_SOUND"}
        );
        if(response?.success){
            setIsPlaying(false);
            setCurrentSound(null);
            setBufferProgress(0);
            setError(null);
        }
    } catch (error) {
        console.error("Stop error:", error);
    }
}

  return {
    isPlaying,
    currentSound,
    loading,
    buffering,
    bufferProgress,
    error,
    play,
    pause,
    stop,
  };
}
