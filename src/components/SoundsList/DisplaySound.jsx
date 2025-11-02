import useBackgroundAudio from "../../shared/hooks/useBackgroundAudio";

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
    stop,
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

  if (!sound)
    return <div className="bg-red-300 text-black">there is no audio</div>;

  return (
    <div className="absolute bottom-0 bg-blue-500 p-3 mb-4 z-100">
      <div className="flex flex-col">
        <div>{sound.title}</div>
        <div>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!isPlaying && !seeking}
            style={{
              background: `linear-gradient(to right,
                      #3b82f6 0%,
                      #3b82f6 ${(currentTime / duration) * 100}%,
                      #94a3b8 ${(currentTime / duration) * 100}%,
                      #94a3b8 ${bufferProgress}%,
                      #e2e8f0 ${bufferProgress}%,
                      #e2e8f0 100%)`,
            }}
          />{" "}
          <span className="text-sm text-white">{formatTime(currentTime)} </span>
          <span className="text-sm text-white">{formatTime(duration)}</span>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span>Loading...</span>
          </div>
        )}

        {buffering && !loading && (
          <div className="flex items-center gap-2 text-orange-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            <span>Buffering...</span>
          </div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {!loading && !error && (
          <button
            onClick={togglePlay}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold disabled:bg-gray-400"
            disabled={buffering}
          >
            {isThisSoundPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
        )}

        {isThisSoundPlaying && (
          <button
            onClick={stop}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            ⏹️ Stop
          </button>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ✕
          </button>
        )}

        {isThisSoundPlaying && (
          <div className="mt-2 text-center">
            <span className="text-xs text-green-600 animate-pulse">
              🎵 Now Playing
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
