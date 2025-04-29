import Spline from '@splinetool/react-spline';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import VideoUpload from "./components/VideoUpload";
import VideoPlayer from "./components/VideoPlayer";
import { useParams } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import "./AppTransition.css";
import WatchedVideoCard from "./components/WatchedVideoCard";

function SplineBackground() {
  return (
    <div className="spline-bg-absolute">
      <Spline
        scene="https://prod.spline.design/SZU0Dp9zzmMdyO1E/scene.splinecode"
        style={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0, zIndex: 0 }}
      />
    </div>
  );
}

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [watchedVideosRaw, setWatchedVideosRaw] = useState([]);
  const [search, setSearch] = useState("");
  const userId = localStorage.getItem('userId') || 'guest';
  const location = useLocation();

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/videos", { params: { search } })
      .then(res => setVideos(res.data))
      .catch(() => setVideos([]));
  }, [search]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/videos/watched/user/${userId}`)
      .then(res => setWatchedVideos(res.data))
      .catch(() => setWatchedVideos([]));
  }, [userId, location.state?.refreshWatched]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/v1/watched/user/${userId}`)
      .then(res => setWatchedVideosRaw(res.data))
      .catch(() => setWatchedVideosRaw([]));
  }, [userId, location.state?.refreshWatched]);

  return (
    <div className="fixed inset-0 min-h-screen min-w-full flex items-center justify-center overflow-hidden bg-black">
      <SplineBackground />
      <div
        className="glass-card w-full h-full min-h-screen min-w-full flex flex-col justify-center items-center p-0 m-0 relative z-10"
        style={{
          background: 'rgba(255,255,255,0.18)',
          borderRadius: 0,
          maxWidth: '100vw',
          minHeight: '100vh',
          minWidth: '100vw',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        }}
      >
        <div className="flex flex-row items-start justify-between w-full px-8 pt-8">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg mb-1"
            style={{
              letterSpacing: '0.1em',
              fontFamily: "'Belleza', sans-serif",
              lineHeight: 1,
              textAlign: 'left',
              fontSize: '5.25rem',
              marginTop: '-20px',
            }}
          >
            NEXTFLIX
          </h1>
          <div className="flex flex-col items-end justify-start gap-2 mt-2">
            <Link to="/upload" className="upload-btn px-6 py-3 text-base font-semibold shadow-md">Upload</Link>
          </div>
        </div>
        {/* Add spacing between headline and search bar */}
        <div style={{height: '5px'}}></div>
        <div className="mb-8 w-full px-0" style={{maxWidth: '100vw', marginTop: '40px'}}>
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border- #048c7f-400 focus:ring-2 focus:ring- #048c7f-100 text-lg bg-white/70 shadow-sm placeholder:text-gray-400"
            style={{width: '100vw', maxWidth: '100vw'}}
          />
        </div>
        {/* Your Uploads Heading */}
        <div className="w-full flex justify-center mb-0 z-20" style={{marginBottom: '0px'}}>
          <h2 className="text-2xl text-center text-white" style={{fontFamily: "'Belleza', sans-serif", fontWeight: 400, position: 'relative', zIndex: 20}}>Your Uploads</h2>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[320px] w-full px-8 pb-8 mt-0" style={{marginTop: '0px'}}>
          <div className="w-full flex justify-center">
            {videos.length === 0 ? (
              <div className="text-lg text-gray-600">No videos found.</div>
            ) : (
              <div className="relative w-full flex items-center justify-center">
                {/* Unwatched Videos Carousel */}
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow-lg"
                  style={{ left: 0 }}
                  onClick={() => {
                    const container = document.getElementById('video-carousel');
                    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  aria-label="Scroll left"
                >
                  &#8592;
                </button>
                <div
                  id="video-carousel"
                  className="flex gap-8 overflow-x-auto py-2 px-1"
                  style={{
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    width: '12500px',
                    maxWidth: '1250px',
                    margin: '0 40px',
                  }}
                  onWheel={e => {
                    e.currentTarget.scrollLeft += e.deltaY;
                    e.preventDefault();
                  }}
                >
                  <style>{`
                    #video-carousel::-webkit-scrollbar { display: none; }
                  `}</style>
                  {videos.filter(v => !v.watched).map(video => (
                    <Link
                      key={video.videoId}
                      to={`/video/${video.videoId}`}
                      className="group flex flex-col items-center min-w-[220px] max-w-[220px] bg-white/60 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 border border-gray-200 hover:border- #048c7f-400 cursor-pointer transform transition-transform duration-200 scale-100 group-hover:scale-110"
                      style={{ textDecoration: 'none' }}
                    >
                      <video
                        src={`http://localhost:8080/api/v1/videos/${video.videoId}/file`}
                        className="w-full h-40 object-cover rounded-t-2xl bg-gray-200 transition-transform duration-200"
                        controls={false}
                        muted
                        preload="metadata"
                        onMouseOver={e => e.currentTarget.play()}
                        onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                      <div className="p-3 w-full">
                        <div className="font-semibold text-base text-gray-900 truncate transition-all duration-200" title={video.title}>{video.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow-lg"
                  style={{ right: 0 }}
                  onClick={() => {
                    const container = document.getElementById('video-carousel');
                    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  aria-label="Scroll right"
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Recently Watched Heading */}
        <div className="w-full flex justify-center mb-0 z-20" style={{marginBottom: '0px'}}>
          <h2 className="text-2xl text-center text-white" style={{fontFamily: "'Belleza', sans-serif", fontWeight: 400, position: 'relative', zIndex: 20}}>Recently Watched</h2>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[320px] w-full px-8 pb-8 mt-0" style={{marginTop: '0px'}}>
          <div className="w-full flex justify-center">
            {watchedVideos.length === 0 ? (
              <div className="text-lg text-gray-600">No watched videos found.</div>
            ) : (
              <div className="relative w-full flex items-center justify-center">
                {/* Watched Videos Carousel */}
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow-lg"
                  style={{ left: 0 }}
                  onClick={() => {
                    const container = document.getElementById('watched-video-carousel');
                    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  aria-label="Scroll left"
                >
                  &#8592;
                </button>
                <div
                  id="watched-video-carousel"
                  className="flex gap-8 overflow-x-auto py-2 px-1"
                  style={{
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    width: '1144px',
                    maxWidth: '1144px',
                    margin: '0 40px',
                  }}
                  onWheel={e => {
                    e.currentTarget.scrollLeft += e.deltaY;
                    e.preventDefault();
                  }}
                >
                  <style>{`
                    #watched-video-carousel::-webkit-scrollbar { display: none; }
                  `}</style>
                  {watchedVideos.map(video => {
                    const watched = watchedVideosRaw.find(w => w.videoId === video.videoId);
                    return (
                      <WatchedVideoCard
                        key={video.videoId}
                        video={video}
                        watchedTill={watched?.watchedTill || 0}
                      />
                    );
                  })}
                </div>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow-lg"
                  style={{ right: 0 }}
                  onClick={() => {
                    const container = document.getElementById('watched-video-carousel');
                    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  aria-label="Scroll right"
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SplineBackground />
      <div className="glass-card max-w-2xl w-full mx-auto p-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link to="/main" className="upload-btn px-4 py-2 text-base font-semibold shadow-md">&#8592; Home</Link>
        </div>
        <VideoUpload />
      </div>
    </div>
  );
}

function VideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    setError("");
    setVideo(null);
    axios.get(`http://localhost:8080/api/v1/videos/${videoId}`)
      .then(res => setVideo(res.data))
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            setError("Video not found (404). The video may have been deleted or the link is invalid.");
          } else {
            setError(`Error: ${err.response.status} - ${err.response.data?.message || 'An error occurred.'}`);
          }
        } else if (err.request) {
          setError("Network error: Could not reach backend. Check if the backend server is running and CORS is configured.");
        } else {
          setError("Unknown error occurred.");
        }
        console.error('Video fetch error:', err);
      });
  }, [videoId]);

  if (error) return (
    <div className="spline-bg min-h-screen flex items-center justify-center">
      <div className="glass-card max-w-2xl w-full mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <Link to="/main" className="upload-btn mt-4 inline-block">Go Home</Link>
      </div>
    </div>
  );
  if (!video) return (
    <div className="spline-bg min-h-screen flex items-center justify-center">
      <div className="glass-card max-w-2xl w-full mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Loading video...</h2>
      </div>
    </div>
  );
  // Add Home button and watched update logic
  const handleGoHome = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      // Get actual watched time
      const watchedTill = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
      await axios.post('http://localhost:8080/api/v1/watched', {
        userId,
        videoId: video.videoId,
        watchedTill
      });
    } catch (e) {}
    navigate('/main', { state: { refreshWatched: true } });
  };
  return (
    <div className="spline-bg min-h-screen flex items-center justify-center">
      <div className="glass-card max-w-2xl w-full mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
        <div className="mb-4" style={{ color: 'black' }}>{video.description}</div>
        <video
          ref={videoRef}
          src={`http://localhost:8080/api/v1/videos/${video.videoId}/file`}
          controls
          style={{ width: "100%", height: "500px" }}
          preload="auto"
        />
        <button onClick={handleGoHome} className="upload-btn mt-6 inline-block">
          <span style={{marginRight: '8px'}}>&#8592;</span>Home
        </button>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames="fade-route" timeout={500}>
        <div className="fade-route">
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/main" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/video/:videoId" element={<VideoPage />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
