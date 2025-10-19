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
                    setLoading(false);
                    setBuffering(false);
                    setError(null);
                    setBufferProgress(m.progress || 0);
                    break;

                case "playing":
                    setLoading(false);
                    setBuffering(false);
                    setError(null);
                    break;

                case "paused":
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

    browserAPI.runtime.sendMessage({type: "GET_AMBIENT_STATUS"}, (response) => {
        if(response){
            setIsPlaying(response.isPlaying);
            setCurrentSound(response.currentSound);
        }
    });

    return () => {
        browserAPI.runtime.onMessage.removeListener(handleMessage);
    }
  }, []);

  const play = (soundUrl) => {
    setLoading(true);
    setError(null);
    browserAPI.runtime.sendMessage(
      { type: "PLAY_AMBIENT_SOUND", soundUrl },
      (response) => {
        if (response?.success) {
          setIsPlaying(true);
          setCurrentSound(soundUrl);
        }
        setLoading(false);
      }
    );
  };

  const pause = () => {
    browserAPI.runtime.sendMessage(
        {type: "PAUSE_AMBIENT_SOUND"},
        (response) => {
            if( response?.success){
                setIsPlaying(false);
            }
        }
    )
  }

  const stop = () => {
    browserAPI.runtime.sendMessage(
        {type: "STOP_AMBIENT_SOUND"},
        (response) => {
            if( response?.success){
                setIsPlaying(false);
                setCurrentSound(null);
                setBufferProgress(0);
                setError(null);
            }
        }
    )
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
