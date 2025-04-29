// src/components/WatchedVideoCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function WatchedVideoCard({ video, watchedTill }) {
  const [duration, setDuration] = useState(0);
  const percentWatched = duration > 0 ? Math.min(100, Math.round((watchedTill / duration) * 100)) : 0;

  return (
    <Link
      to={`/video/${video.videoId}`}
      state={{ watchedTill: watchedTill || 0 }}
      className="group flex flex-col items-center min-w-[220px] max-w-[220px] bg-white/60 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border border-gray-200 hover:border-blue-400 cursor-pointer transform transition-transform duration-200 scale-100 group-hover:scale-110"
      style={{ textDecoration: 'none' }}
    >
      <video
        src={`http://localhost:8080/api/v1/videos/${video.videoId}/file`}
        className="w-full h-40 object-cover rounded-t-2xl bg-gray-200 transition-transform duration-200"
        controls={false}
        muted
        preload="metadata"
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onMouseOver={e => e.currentTarget.play()}
        onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
      />
      {/* Red progress bar */}
      <div className="w-full h-1 bg-gray-200 relative">
        <div
          className="absolute left-0 top-0 h-1 bg-red-600 rounded-b"
          style={{ width: percentWatched + '%' }}
        ></div>
      </div>
      <div className="p-3 w-full">
        <div className="font-semibold text-base text-gray-900 truncate transition-all duration-200" title={video.title}>{video.title}</div>
      </div>
    </Link>
  );
}

export default WatchedVideoCard;