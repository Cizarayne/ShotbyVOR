import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Maximize2, Volume2, VolumeX, X } from "lucide-react";

const highlightVideos = [
  {
    id: 1,
    src: "/Featured_Videos/video22.mp4",
    category: "PERFORMANCE",
    year: "2025",
    duration: "0:45",
    title: "Pretty Faces at Soakers",
    desc: "High-intensity festival opener with synchronized neon bursts and thunderous bass lines.",
  },
  {
    id: 2,
    src: "/Featured_Videos/video28.mp4",
    category: "DOCUSERIES",
    year: "2025",
    duration: "1:12",
    title: "DJ Consequence on Deck",
    desc: "Every transition, every drop, every moment captured with precision.",
  },
  {
    id: 3,
    src: "/Featured_Videos/video19.mp4",
    category: "PRODUCTION",
    year: "2025",
    duration: "0:58",
    title: "Laser Grid Inferno",
    desc: "Volumetric green laser arrays blazing across the main outdoor arena.",
  },
  {
    id: 4,
    src: "/Featured_Videos/video25.mp4",
    category: "LIVE AUDIO",
    year: "2025",
    duration: "1:04",
    title: "Mixer Board POV",
    desc: "First-person immersive view of audio configuration directly from the DJ deck.",
  },
  {
    id: 5,
    src: "/Featured_Videos/video26.mp4",
    category: "FESTIVAL CULTURE",
    year: "2025",
    duration: "0:38",
    title: "Super Soaker Frontline",
    desc: "Chaotic energy of thousands of festival-goers completely drenched in mid-day hype.",
  },
  {
    id: 6,
    src: "/Featured_Videos/video20.mp4",
    category: "EXPERIMENTAL",
    year: "2025",
    duration: "1:20",
    title: "Soakers Adrenaline Rush",
    desc: "Capturing the vibrant energy, thrilling moments, and non-stop excitement of the ultimate water experience.",
  },
  {
    id: 7,
    src: "/Featured_Videos/video21.mp4",
    category: "PRODUCTION",
    year: "2025",
    duration: "2:10",
    title: "Barry Jhay Live at Soakers",
    desc: "Every lyric, every spotlight, every roar of the crowd",
  },
  {
    id: 8,
    src: "/Featured_Videos/video24.mp4",
    category: "CANDID DOC",
    year: "2025",
    duration: "0:52",
    title: "Teasers",
    desc: "Short previews. Big stories. Every frame sparks anticipation for what's next.",
  },
  {
    id: 9,
    src: "/Featured_Videos/video23.mp4",
    category: "WIDESCREEN",
    year: "2025",
    duration: "1:15",
    title: "Beach Volleyball Energy",
    desc: "Wide-angle capture of the passion, energy, and beauty of beach volleyball.",
  },
  {
    id: 10,
    src: "/Featured_Videos/video10.mp4",
    category: "CROWD DYNAMIC",
    year: "2025",
    duration: "0:48",
    title: "Soaked in Love",
    desc: "Love In Every Frame",
  },
  {
    id: 11,
    src: "/Featured_Videos/video14.mp4",
    category: "LIVE REEL",
    year: "2025",
    duration: "0:30",
    title: "Happy Moments & Vibes at Soakers",
    desc: "Good vibes. Great people. Unforgettable memories.",
  },
  {
    id: 12,
    src: "/Featured_Videos/video16.mp4",
    category: "ARTIST REEL",
    year: "2025",
    duration: "1:40",
    title: "Beach Front Vibes",
    desc: "Tracking stage presence, bass drops, and raw street fashion highlights.",
  },
  {
    id: 13,
    src: "/Featured_Videos/video17.mp4",
    category: "BOOTH DRAMA",
    year: "2025",
    duration: "0:55",
    title: "Night Booth Infrared",
    desc: "High-contrast tracking of DJs under emerald overhead lighting.",
  },
  {
    id: 14,
    src: "/Featured_Videos/video18.mp4",
    category: "STREETWEAR",
    year: "2025",
    duration: "0:42",
    title: "Pool Games & Fun",
    desc: "Dive into a day filled with exciting games, great company, and endless summer vibes.",
  },
  {
    id: 15,
    src: "/Featured_Videos/video13.mp4",
    category: "FESTIVAL CULTURE",
    year: "2025",
    duration: "1:01",
    title: "Stage Energy",
    desc: "Lights on. Energy up. Memories forever.",
  },
  {
    id: 16,
    src: "/Featured_Videos/video9.mp4",
    category: "ARTIST SPOTLIGHT",
    year: "2025",
    duration: "1:10",
    title: "Life of the Party",
    desc: "Capturing the people, the energy, and the unforgettable moments that kept the celebration alive.",
  },
  {
    id: 17,
    src: "/Featured_Videos/video8.mp4",
    category: "PRODUCTION",
    year: "2025",
    duration: "0:35",
    title: "Soakers Regular",
    desc: "The signature Soakers experience filled with great music, vibrant crowds, and endless good vibes.",
  },
  {
    id: 18,
    src: "/Featured_Videos/video15.mp4",
    category: "CANDID PORTRAIT",
    year: "2025",
    duration: "0:50",
    title: "Seun Pizzle at Soakers",
    desc: "The music. The energy. The unforgettable moments.",
  },
  {
    id: 19,
    src: "/Featured_Videos/video12.mp4",
    category: "ACTION CAPTURE",
    year: "2025",
    duration: "0:57",
    title: "Water Guns & Fun",
    desc: "From playful water battles to contagious laughter, every frame tells a story of pure fun",
  },
  {
    id: 20,
    src: "/Featured_Videos/video11.mp4",
    category: "ANTHOLOGY",
    year: "2025",
    duration: "1:22",
    title: "Pool Splashes",
    desc: "Capturing the thrill of every jump, splash, and smile with cinematic precision.",
  },
  {
    id: 21,
    src: "/Featured_Videos/video1.mp4",
    category: "STREETWEAR",
    year: "2025",
    duration: "0:46",
    title: "Joblaq at Soakers",
    desc: "Big personality. Bigger moments. Unforgettable vibes.",
  },
  {
    id: 22,
    src: "/Featured_Videos/video6.mp4",
    category: "CROWD DYNAMIC",
    year: "2025",
    duration: "1:05",
    title: "Skales Performance at Soakers",
    desc: "Relive the excitement as Skales delivered a high energy performance that kept the audience on their feet.",
  },
  {
    id: 23,
    src: "/Featured_Videos/video7.mp4",
    category: "PRODUCTION",
    year: "2025",
    duration: "0:39",
    title: "Wet Zone Signage",
    desc: "Creative focus on custom warning signs for incoming water lines.",
  },
  {
    id: 24,
    src: "/Featured_Videos/video3.mp4",
    category: "AMBIENT REEL",
    year: "2025",
    duration: "0:44",
    title: "Pool Side Adrenaline Rush at Soakers",
    desc: "Dive into a poolside experience filled with nonstop excitement, vibrant energy, and unforgettable memories.",
  },
  {
    id: 25,
    src: "/Featured_Videos/video4.mp4",
    category: "PERFORMANCE",
    year: "2025",
    duration: "2:05",
    title: "Soakers Finale Climax",
    desc: "Montage of all performance angles, lasers, and main stage drops.",
  },
  {
    id: 26,
    src: "/Featured_Videos/video5.mp4",
    category: "EXPERIMENTAL",
    year: "2025",
    duration: "1:11",
    title: "Sweat Sheen & Flares",
    desc: "Manipulated shutter speeds showing sweat sheen and light flares.",
  },
  {
    id: 27,
    src: "/Featured_Videos/video2.mp4",
    category: "CANDID PORTRAIT",
    year: "2025",
    duration: "0:53",
    title: "Water Gun Splash",
    desc: "From surprise sprays to contagious laughter, every frame is bursting with life and excitement.",
  },
  {
    id: 28,
    src: "/Featured_Videos/video27.mp4",
    category: "LIVE PERFORMANCE",
    year: "2025",
    duration: "1:08",
    title: "Final Act Stage Rush",
    desc: "High-energy finale capturing the last crowd surge before lights out.",
  },
];

function fmtTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Fullscreen modal ──────────────────────────────────────────────────────────
function VideoModal({ item, onClose }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // Escape to close
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Wire video events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    const onTime = () => {
      setCurrentTime(v.currentTime);
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(v.duration);
    const onEnded = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  // Initial hide timer
  useEffect(() => {
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(hideTimer.current);
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const handleVolume = useCallback((e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    setVolume(val);
    v.muted = val === 0;
    setMuted(val === 0);
  }, []);

  const handleSeek = useCallback((e) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    v.currentTime = ratio * v.duration;
  }, []);

  const handleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  }, []);

  return (
    /* Backdrop — click outside to close */
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      onMouseMove={resetHideTimer}
    >
      {/* Panel — stop propagation */}
      <div
        className="relative flex flex-col w-full max-w-7xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header row: title + close ── */}
        <div className="flex items-start justify-between mb-3 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600 block mb-0.5">
              {item.category} · {item.year}
            </span>
            <h2 className="text-slate-950 font-extrabold text-xl sm:text-2xl leading-tight bg-white/90 px-3 py-1 rounded-lg inline-block">
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-slate-100 hover:text-violet-600 transition hover:scale-105"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Video container — large ── */}
        <div
          className="relative w-full rounded-xl overflow-hidden bg-black shadow-xl border border-slate-100"
          onMouseMove={resetHideTimer}
        >
          <video
            ref={videoRef}
            src={item.src}
            className="w-full max-h-[75vh] object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {/* Gradient controls bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 bg-linear-to-t from-black/80 to-transparent transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Progress bar */}
            <div
              ref={progressRef}
              className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4 group/bar"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-violet-500 rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition" />
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-violet-400 transition"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={22} /> : <Play size={22} />}
                </button>
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-violet-400 transition"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolume}
                  className="w-24 h-1 accent-violet-500 cursor-pointer"
                  aria-label="Volume"
                />
                <span className="text-white/70 text-xs font-mono tabular-nums">
                  {fmtTime(currentTime)} / {fmtTime(duration)}
                </span>
              </div>
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-violet-400 transition"
                aria-label="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* Center pause icon */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Play size={32} className="text-white translate-x-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* ── Description ── */}
        <p className="text-slate-600 text-sm leading-relaxed mt-3 bg-white/80 px-3 py-2 rounded-lg">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

// ── Video card ─────────────────────────────────────────────────────────────────
function VideoCard({ item, rank, onOpen }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    videoRef.current?.play();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div
      className="flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition duration-300 overflow-hidden group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
        {/* Rank badge */}
        <div className="absolute top-2 left-2 z-10 bg-violet-600 text-white font-bold text-[10px] tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">
          {String(rank).padStart(2, "0")}
        </div>

        <video
          ref={videoRef}
          src={item.src}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500 ease-out"
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Play overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition duration-200 ${hovered ? "opacity-0" : "opacity-100"}`}
        >
          <div className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <Play size={16} className="text-violet-600 translate-x-0.5" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-[10px] font-mono font-semibold text-white px-1.5 py-0.5 rounded">
          {item.duration}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col grow p-3.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 block mb-1">
          {item.category}
        </span>
        <h3 className="text-sm font-bold tracking-tight text-slate-900 mb-1.5 line-clamp-1 group-hover:text-violet-600 transition">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HighlightsPage() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans px-6 py-16 sm:px-12 lg:px-20 xl:px-24">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-16 border-b border-slate-200 pb-10">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-violet-600 block mb-3">
          Selected Reels
        </span>
        <div className="flex items-end justify-between gap-4">
          <h1 className=" font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 max-w-2xl">
            Highlights reel live events, raw energy, and cinematic moments.
          </h1>
          <span className="text-xs text-slate-400 font-mono tracking-wider hidden sm:block shrink-0 pb-1">
            {highlightVideos.length} CLIPS
          </span>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {highlightVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              item={video}
              rank={index + 1}
              onOpen={() => setActiveVideo(video)}
            />
          ))}
        </section>
      </main>

      {/* Modal */}
      {activeVideo && (
        <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
