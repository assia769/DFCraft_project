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
        <div className="flex flex-row items-center">
          <Skeleton variant="rounded" width={40} height={40} />
          <div className="ml-2">
            <Skeleton width={100}/>
            <Skeleton width={40}/>
          </div>
        </div>
      </div>
    );
  }

  // ✅ RETURN EARLY IF NO SOUNDS PROPERTY
  if (!soundsByCat.sounds) {
    return <div className="p-4">No sounds data</div>;
  }

  const { sounds } = soundsByCat;

  const filteredSounds = category === "all" ? sounds : sounds.filter((s) => s.category === category);

  if (filteredSounds.length === 0) {
    return <div className="p-4">No sounds in "{category}"</div>;
  }

  const soundslist = filteredSounds.map((s) => {
    return (
      <>
        <div
          className="flex flex-row item-center justify-start w-full p-2 hover:bg-blue-200 transition-all"
          key={s.id}
          onClick={() => handleListenSound(s)}
        >
          <img src={s.coverImage} alt={s.title} className="w-10 h-10 rounded-md"></img>
          <div className="ml-1">
            <div className="text-sm font-medium">{s.title}</div>
            <div className="text-sm text-gray-600">{s.duration / 60}</div>
          </div>
        </div>
      </>
    );
  });

  return (
    <div>
      {soundslist}
      <div className="flex justify-center">{(listenPage || isPlaying) && <DisplaySound sound={listenSound} />}</div>
    </div>
  );
}
