import { useEffect, useRef, useState } from "react";

export default function DisplaySound({ sound }) {
  const [play, setPlay] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState({ min: 0, sec: 0 });
  const audioRef = useRef(null);

  useEffect(() => {
    if (!sound?.file) return;

    const audio = new Audio();
    audio.src = sound.file;
    audio.preload = "auto";
    audio.loop = true;

    audioRef.current = audio;

    const handleLoadStart = () => {
      console.log("⏳ Starting download...");
      setLoading(true);
      setError(null);
    };

    const handleLoadedMetadata = () => {
      console.log(`📊 Duration: ${audio.duration}s`);
      setDuration({
        min: Math.floor(audio.duration / 60),
        sec: Math.floor(audio.duration % 60),
      });
    };

    const handleCanPlay = () => {
      console.log("✅ Ready to play! (enough buffered)");
      setLoading(false);
      // Auto-play when ready
      audio.play().catch((err) => {
        console.error("Autoplay blocked:", err);
        setError("Click play to start");
      });
    };

    const handleCanPlayThrough = () => {
      console.log("✅ Fully buffered!");
    };

    const handleWaiting = () => {
      console.log("⏸️ Buffering...");
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      console.log("▶️ Playing...");
      setIsBuffering(false);
      setPlay(true);
    };

    const handlePause = () => {
      console.log("⏸️ Paused");
      setPlay(false);
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration;
        if (duration > 0) {
          const percent = (bufferedEnd / duration) * 100;
          setBufferProgress(percent);
          console.log(`📥 Buffered: ${percent.toFixed(1)}%`);
        }
      }
    };

    const handleError = (e) => {
      console.error("❌ Audio error:", e);
      setError("Failed to load audio");
      setLoading(false);
    };

    // Attach all event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay); // ✅ Triggers after 3-5s
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("error", handleError);

    // ✅ Start loading
    audio.load();

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("error", handleError);

      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [sound]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (play) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Play failed:", err);
        setError("Failed to play");
      });
    }
  };

  if (!sound) return null;

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

        {isBuffering && !loading && (
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
                disabled={isBuffering}
              >
                {play ? "⏸️ Pause" : "▶️ Play"}
              </button>
            )}

        {play && (
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
