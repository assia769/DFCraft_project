import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../shared/constants/config";
import DisplaySound from "./DisplaySound";
import useBackgroundAudio from "../../shared/hooks/useBackgroundAudio";
import { Skeleton } from "@mui/material";


export default function SoundsList({ category }) {
  const catURL = config.SoundLibraryApi;
  const [soundsByCat, setSoundsByCat] = useState(null);
  const [listenPage, setListenPage] = useState(false);
  const [listenSound, setListenSound] = useState(null);

  const { play, isPlaying, currentSound } = useBackgroundAudio();
  
  const handleListenSound = (s) => {
    setListenPage(true);
    setListenSound(s);
    play(s.file);
  };

  // Fetch sounds by category
  useEffect(() => {
    const fetchSoundsByCat = async () => {
      try {
        const res = await axios.get(catURL);
        const data = res.data;
        setSoundsByCat(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSoundsByCat();
  }, []);
  
  
  // Restore the currently playing sound when extension reopens
  useEffect(() => {
    if (currentSound && soundsByCat?.sounds && !listenSound) {
      console.log("🔄 Restoring sound display for:", currentSound);
      
      // Normalize URL for comparison
      const normalizeUrl = (url) => {
        if (!url) return "";
        return url.split("/").pop() || url;
      };
      
      const currentFile = normalizeUrl(currentSound);
      
      // Find the sound that matches the currently playing sound
      const playingSound = soundsByCat.sounds.find(s => {
        const soundFile = normalizeUrl(s.file);
        return soundFile === currentFile;
      });
      
      if (playingSound) {
        console.log("✅ Found playing sound:", playingSound.title);
        setListenSound(playingSound);
        setListenPage(true);
      }
    }
  }, [currentSound, soundsByCat, listenSound]);

  if (!soundsByCat) {
    return (
      <div className="ml-2">
        <div className="flex flex-row items-center">
          <Skeleton variant="rounded" width={40} height={40} />
          <div className="ml-2">
            <Skeleton width={100}/>
            <Skeleton width={40}/>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <Skeleton variant="rounded" width={40} height={40} />
          <div className="ml-2">
            <Skeleton width={100}/>
            <Skeleton width={40}/>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <Skeleton variant="rounded" width={40} height={40} />
          <div className="ml-2">
            <Skeleton width={100}/>
            <Skeleton width={40}/>
          </div>
        </div>
        <div className="flex flex-row items-center ">
          <Skeleton variant="rounded" width={40} height={40} />
          <div className="ml-2">
            <Skeleton width={100}/>
            <Skeleton width={40}/>
          </div>
        </div>
      </div>
    );
  }

  if (!soundsByCat.sounds) {
    return <div className="p-4">No sounds data</div>;
  }

  const { sounds } = soundsByCat;

  const filteredSounds = category === "all" ? sounds : sounds.filter((s) => s.category === category);

  if (filteredSounds.length === 0) {
    return <div className="p-4">No sounds in "{category}"</div>;
  }
  
  const formatTime = (s) => {
    const min = Math.floor(s / 60) || 0;
    const sec = Math.floor(s % 60) || 0;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const soundslist = filteredSounds.map((s) => {
    return (
        <div
          className="group flex flex-row justify-between items-center w-ful px-4 py-1 rounded-md m-2  bg-light dark:bg-dark hover:bg-lightElements  dark:hover:bg-darkElements transition-all"
          key={s.id}
          onClick={() => handleListenSound(s)}
        >
          <div className="flex flex-row">
            <img src={s.coverImage} alt={s.title} className="w-10 h-10 rounded-md flex flex-row justify-between items-center"></img>
            <div className="ml-1">
              <div className="text-md font-medium text-lightList dark:text-darkElements group-hover:text-light dark:group-hover:text-dark">{s.title}</div>
              <div className="text-xs text-lightElements dark:text-darkList group-hover:text-light dark:group-hover:text-dark">{s.author}</div>
            </div>
          </div>
          <div className="ml-2">
            <div className="text-xs font-medium text-lightElements dark:text-darkList group-hover:text-light dark:group-hover:text-dark">{formatTime(s.duration)}</div>
          </div>
        </div>
    );
  });

  return (
    <div>
      {soundslist}
      <div className="flex justify-center">{(listenPage || isPlaying) && <DisplaySound sound={listenSound} />}</div>
    </div>
  );
}
