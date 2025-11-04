import useBackgroundAudio from "../../shared/hooks/useBackgroundAudio";
import { CirclePlay, CirclePause, LoaderCircle, RotateCcw, RotateCw } from "lucide-react";
export default function DisplaySound({ sound, onClose }) {
  const {
    isPlaying,
    currentSound,
    loading,
    buffering,
    bufferProgress,
    currentTime,
    duration,
    seeking,
    error,
    play,
    pause,
    seek,
  } = useBackgroundAudio();

  const togglePlay = () => {
    console.log("🎵 TOGGLE PLAY");
    console.log("  sound.file:", sound.file);
    console.log("  currentSound:", currentSound);
    console.log("  isPlaying:", isPlaying);

    // ✅ Use normalized comparison
    if (isPlaying && isCurrentSoundPlaying()) {
      console.log("  → PAUSING");
      pause();
    } else {
      console.log("  → PLAYING");
      play(sound.file);
    }
  };

  const isCurrentSoundPlaying = () => {
    if (!currentSound || !sound.file) return false;

    // Normalize both URLs for comparison
    const normalizeUrl = (url) => {
      if (!url) return "";
      // Extract just the filename
      return url.split("/").pop() || url;
    };

    const currentFile = normalizeUrl(currentSound);
    const soundFile = normalizeUrl(sound.file);

    console.log("  Comparing:", currentFile, "vs", soundFile);

    return currentFile === soundFile;
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60) || 0;
    const sec = Math.floor(s % 60) || 0;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const isThisSoundPlaying = isPlaying && isCurrentSoundPlaying();

  console.log("🎵 DisplaySound render:");
  console.log("  isPlaying:", isPlaying);
  console.log("  isThisSoundPlaying:", isThisSoundPlaying);
  console.log("  loading:", loading);
  console.log("  error:", error);

  const soundplayicon = ()=>{
    return loading || buffering ? <LoaderCircle color="#ffffff" className="animate-spin"/> :
    (
      isThisSoundPlaying ? <CirclePause color="#ffffff" className="w-10 h-10"/> : <CirclePlay color="#ffffff" className="w-10 h-10"/>
    )
  }

  if (!sound)
    return <div className="bg-red-300 text-black">there is no audio</div>;

  return (
    <div className="absolute bottom-0 w-full bg-blue-500 p-5 z-100">
      <div className="flex flex-row items-center">
        <img src={sound.coverImage} alt={sound.title} className="w-16 h-16 rounded-lg mr-2 "></img>
        <div>
          <div className="text-white font-medium">{sound.title}</div>
          <div className="text-gray-200">{sound.author}</div>
        </div>
      </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          disabled={!isPlaying && !seeking}
          className="w-full mt-3"
          style={{
            background: `linear-gradient(to right,
                    #3b82f6 0%,
                    #3b82f6 ${(currentTime / duration) * 100}%,
                    #94a3b8 ${(currentTime / duration) * 100}%,
                    #94a3b8 ${bufferProgress}%,
                    #e2e8f0 ${bufferProgress}%,
                    #e2e8f0 100%)`,
          }}
        />
        <div className="flex flex-row justify-between">
          <span className="text-sm text-white ">{formatTime(currentTime)} </span>
          <span className="text-sm text-white ">{formatTime(duration)}</span>
        </div>
        <div className="flex justify-center">
          <button disabled={buffering}>
            <RotateCcw color="#ffffff" />
          </button>
          <button
            onClick={togglePlay}
            className="mr-3 ml-3"
            disabled={buffering}
          >
            {soundplayicon()}
          </button>
          <button disabled={buffering}>
            <RotateCw color="#ffffff" />
          </button>
        </div>
      </div>
  );
}
