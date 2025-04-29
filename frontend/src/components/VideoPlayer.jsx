import React, { useRef, useEffect } from "react";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  return (
    <div>
      <video
        ref={videoRef}
        src={src}
        controls
        style={{ width: "100%", height: "500px" }}
        preload="auto"
      >
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
  );
}

export default VideoPlayer;
