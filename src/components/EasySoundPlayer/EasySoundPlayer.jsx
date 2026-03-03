import { useEffect, useState } from "react";
import {
  CirclePlay,
  ChevronDown,
  LoaderCircle,
  CirclePause,
} from "lucide-react";
import useBackgroundAudio from "../../shared/hooks/useBackgroundAudio";
import config from "../../shared/constants/config";
import axios from "axios";

export default function EasySoundPlayer() {
  const soundsURL = config.SoundLibraryApi;
  const [sounds, setSounds] = useState([]);
  const [sound, setSound] = useState(null);
  const [expend, setExpent] = useState(false);
  const { currentSound, buffering, loading, isPlaying, play, pause } =
    useBackgroundAudio();

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const res = await axios.get(soundsURL);
        console.log(res);
        setSounds(res.data.sounds);
        if (!res.data || res.data.sounds.length === 0) {
          throw new Error("No sounds found in the easy access to response");
        }
        console.log("Fetched sounds data 2:", sounds);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSounds();
  }, [soundsURL]);

  useEffect(() => {
    if (currentSound && sounds.length > 0 && !sound) {
      console.log("🔄 Restoring sound display for:", currentSound);

      // Normalize URL for comparison
      const normalizeUrl = (url) => {
        if (!url) return "";
        return url.split("/").pop() || url;
      };

      const currentFile = normalizeUrl(currentSound);

      // Find the sound that matches the currently playing sound
      const playingSound = sounds.find((s) => {
        const soundFile = normalizeUrl(s.file);
        return soundFile === currentFile;
      });

      if (playingSound) {
        setSound(playingSound);
        console.log("✅ Found playing sound:", sound);
      } else {
        console.warn(
          "⚠️ No matching sound found for currentSound:",
          currentSound,
        );
      }
    } else if (sound) {
      console.log("Current sound already set, skipping restore:", sound);
    } else {
      console.warn("⚠️ Cannot restore sound display - missing dependencies:", {
        currentSound,
        sounds,
      });
    }
  }, [currentSound, sound, sounds]);

  const togglePlay = () => {
    console.log("🎵 TOGGLE PLAY");
    console.log("  sound.file:", sound.file);
    console.log("  currentSound:", currentSound);
    console.log("  isPlaying:", isPlaying);

    // ✅ Use normalized comparison
    if (isPlaying && currentSound && sound && sound.file === currentSound) {
      console.log("  → PAUSING");
      pause();
    } else {
      console.log("  → PLAYING");
      play(sound.file);
    }
  };

  const soundplayicon = () => {
    return loading || buffering ? (
      <LoaderCircle className="animate-spin w-10 h-10 text-light dark:text-dark" />
    ) : isPlaying ? (
      <CirclePause className="w-10 h-10 text-light dark:text-dark" />
    ) : (
      <CirclePlay className="w-10 h-10 text-light dark:text-dark" />
    );
  };

  if (!sound) return null;

  return (
    <div className="bg-lightElements dark:bg-darkElements px-6 py-3 my-5 mx-14 rounded-3xl transition-all duration-300 ease-in-out overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-center items-center">
          <img src={sound?.coverImage} className="w-10 h-10 rounded-lg mr-2" />
          <div className="mb-1">
            <div className="text-light dark:text-dark text-lg">
              {sound.title.length > 14
                ? sound.title.slice(0, 14) + "..."
                : sound.title}
            </div>
            <div className="text-gray-300 dark:text-gray-800 text-xs">
              {sound.author}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <button disabled={buffering} onClick={togglePlay}>
            {soundplayicon()}
          </button>
        </div>
      </div>
    </div>
  );
}
