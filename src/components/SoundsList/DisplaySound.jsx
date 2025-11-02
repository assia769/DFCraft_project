import useBackgroundAudio from "../../shared/hooks/useBackgroundAudio";

export default function DisplaySound({ sound, onClose }) {

  const { isPlaying, currentSound, loading, buffering, bufferProgress, error, play, pause, stop } = useBackgroundAudio();

  const togglePlay = () => {
    if (isPlaying && currentSound === sound.file) {
      pause();
    } else {
      play(sound.file);
    }
  };

  const duration = {
    min: Math.floor(sound.duration / 60) || 0,
    sec: Math.floor(sound.duration % 60) || 0,
  };

  const isThisSoundPlaying = isPlaying && currentSound === sound.file;

  if (!sound) return (<div className="bg-red-300 text-black">there is no audio</div>);


  return (
    <div className="absolute bottom-0 bg-blue-500 p-3 mb-4">
      <div className="flex flex-col">
        <div>{sound.title}</div>
        <div>
          <progress
            value={bufferProgress}
            max={100}
            className="w-full"
          ></progress>{" "}
          <div>
            {" "}
            {duration.min}:
            {duration.sec.toString().padStart(2, "0")}
            {sound.author && ` • ${sound.author}`}
          </div>
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
        {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

        {!loading && !error && (
              <button
                onClick={togglePlay}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold disabled:bg-gray-400"
                disabled={buffering}
              >
                {isThisSoundPlaying  ? "⏸️ Pause" : "▶️ Play"}
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

        {isThisSoundPlaying  && (
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
