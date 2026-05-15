import { useRef, useEffect } from "react";

const VideoPlayer = ({ selectedResult, videoSrc }) => {
  const videoRef = useRef(null);

  const isYouTube = videoSrc && videoSrc.includes("youtube.com");

  useEffect(() => {
    if (selectedResult && videoRef.current && !isYouTube) {
      const timeString = selectedResult.time?.split(" - ")[0];
      if (!timeString) return;

      const parts = timeString.split(":");
      const seconds = Number(parts[1]);

      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  }, [selectedResult, isYouTube]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-800 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
      
      <div className="relative w-full">

        {selectedResult && (
          <div className="absolute top-3 left-3 z-10 bg-black/60 px-4 py-2 rounded-lg text-sm text-white">
            Now Playing: {selectedResult.caption}
          </div>
        )}

        {isYouTube ? (
          <iframe
            src={videoSrc}
            title="YouTube video"
            className="w-full h-[400px] rounded-xl"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            className="w-full rounded-xl"
          />
        )}

      </div>
    </div>
  );
};

export default VideoPlayer;