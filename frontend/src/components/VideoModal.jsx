import React from "react";

export default function VideoModal({ videoUrl, onClose }) {
  if (!videoUrl) return null;

  const videoId = getYoutubeId(videoUrl);

  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-black rounded-lg w-full max-w-3xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl"
        >
          ✕
        </button>

        {/* Video */}
        <div className="relative pb-[56.25%] h-0">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="IPO Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

/* Helper */
function getYoutubeId(url) {
  try {
    if (url.includes("youtube.com")) {
      return new URL(url).searchParams.get("v");
    }
    if (url.includes("youtu.be")) {
      return url.split("/").pop();
    }
  } catch {
    return null;
  }
}
