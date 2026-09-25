import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
} from "lucide-react";
import { trackView } from "../lib/trackView";
import { apiUrl } from "../lib/apiBase";
import { useSEO } from "../lib/useSEO";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function fetchReels() {
  const res = await fetch(apiUrl("/api/reels"));
  if (!res.ok) throw new Error("Failed to load reels");
  return res.json();
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Milestone flags — reset whenever a different reel is opened in the modal.
  const engagedRef = useRef(false);
  const milestoneRef = useRef(false);
  useEffect(() => {
    engagedRef.current = false;
    milestoneRef.current = false;
  }, [item._id]);

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

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, togglePlay]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    const onTime = () => {
      setCurrentTime(v.currentTime);
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(v.duration);
    const onEnded = () => {
      setPlaying(false);
      // Completion milestone — counts as a genuine watch.
      if (milestoneRef.current) return;
      milestoneRef.current = true;
      trackView("reels", item._id, { repeatable: true });
    };
    // Engagement (3s+) and 75% milestones — tracked from timeupdate so they
    // also fire for short looping clips that never dispatch `ended`.
    // Replays reset the modal (new mount), so re-watching counts again.
    const onMilestones = () => {
      if (v.currentTime >= 3 && !engagedRef.current) {
        engagedRef.current = true;
        trackView("reels", item._id, { repeatable: true });
      }
      if (
        v.duration &&
        v.currentTime / v.duration >= 0.75 &&
        !milestoneRef.current
      ) {
        milestoneRef.current = true;
        trackView("reels", item._id, { repeatable: true });
      }
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("timeupdate", onMilestones);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("timeupdate", onMilestones);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(hideTimer.current);
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/92 backdrop-blur-lg"
      onClick={onClose}
      onMouseMove={resetHideTimer}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative flex flex-col w-full max-w-7xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            {item.category && (
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/35 block mb-1.5">
                {item.category}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
          onMouseMove={resetHideTimer}
        >
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="w-full max-h-[75vh] object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {/* Controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 px-5 pb-4 pt-14 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <div
              ref={progressRef}
              className="relative w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 group/bar"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-white/70 transition"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={22} /> : <Play size={22} />}
                </button>
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-white/70 transition"
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
                  className="w-20 h-1 accent-white cursor-pointer"
                />
                <span className="text-white/45 text-xs font-mono tabular-nums">
                  {fmtTime(currentTime)} / {fmtTime(duration)}
                </span>
              </div>
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-white/70 transition"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* Centre pause icon */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Play size={32} className="text-white translate-x-0.5" />
              </div>
            </div>
          )}
        </div>

        {item.description && (
          <p className="text-white/35 text-sm leading-relaxed mt-3 px-0.5">
            {item.description}
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ── Featured hero card (first item) ──────────────────────────────────────────

function FeaturedCard({ item, onOpen }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const enter = useCallback(() => {
    setHovered(true);
    videoRef.current?.play();
  }, []);
  const leave = useCallback(() => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-2xl cursor-pointer group"
      style={{ height: "clamp(320px, 50vh, 580px)" }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={onOpen}
    >
      {/* Full-bleed video */}
      <video
        ref={videoRef}
        src={item.videoUrl}
        poster={item.thumbnailUrl || undefined}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Gradient — strong at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

      {/* Category pills — top left */}
      {item.category && (
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      )}

      {/* Text + play — bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 lg:p-8">
        <div className="min-w-0">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
            {item.title}
          </h2>
          {item.description && (
            <p className="text-white/60 text-sm leading-relaxed line-clamp-2 max-w-xl">
              {item.description}
            </p>
          )}
        </div>

        {/* Circular play button — bottom right */}
        <div className="shrink-0 mb-1">
          <div
            className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white flex items-center justify-center shadow-xl transition-all duration-300 ${hovered ? "scale-110 shadow-[0_0_32px_rgba(255,255,255,0.35)]" : ""}`}
          >
            <Play
              size={22}
              className="text-[#080a0c] translate-x-0.5"
              fill="currentColor"
            />
          </div>
        </div>
      </div>

      {/* Duration bottom left pill */}
      {item.duration && (
        <div className="absolute bottom-5 left-6 lg:left-8">
          {/* spacer so it doesn't overlap the text — handled by flex layout above */}
        </div>
      )}
    </motion.div>
  );
}

// ── Standard video card ───────────────────────────────────────────────────────

function VideoCard({ item, rank, onOpen }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const enter = useCallback(() => {
    setHovered(true);
    videoRef.current?.play();
  }, []);
  const leave = useCallback(() => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group aspect-[4/3]
                 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] transition-all duration-300 ease-out"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={onOpen}
    >
      {/* Full-bleed video */}
      <video
        ref={videoRef}
        src={item.videoUrl}
        poster={item.thumbnailUrl || undefined}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.05]"
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Gradient — clear top, heavy at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Category pill — top left */}
      {item.category && (
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      )}

      {/* Duration — top right */}
      {item.duration && (
        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-[10px] font-mono text-white/70 px-2.5 py-1 rounded-full border border-white/15">
          {item.duration}
        </div>
      )}

      {/* Title + description + play — bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 z-10">
        <div className="min-w-0">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight mb-1 drop-shadow-md line-clamp-2">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-white/55 text-xs leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Circular play button */}
        <div className="shrink-0">
          <div
            className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-300 ${hovered ? "scale-110 shadow-[0_0_24px_rgba(255,255,255,0.4)]" : ""}`}
          >
            <Play
              size={17}
              className="text-[#080a0c] translate-x-0.5"
              fill="currentColor"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Reels() {
  useSEO({
    title: "Reels — Cinematic Video Edits",
    description:
      "Watch SHOTBYVOR reels — cinematic video edits from concerts, nightlife, weddings, festivals and brand shoots.",
    path: "/work/reels",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActive] = useState(null);

  useEffect(() => {
    fetchReels()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const featured = items[0] ?? null;
  const rest = items.slice(1);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080a0c]">
      <div className="pointer-events-none absolute -right-40 top-32 h-[32rem] w-[32rem] rounded-full bg-white/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32">
        {/* ── Hero banner ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full overflow-hidden border-y border-white/10"
          style={{ minHeight: "clamp(260px, 38vh, 480px)" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: "url('/images/page-heading-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/95 via-[#080a0c]/70 to-[#080a0c]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0c]/80 via-transparent to-transparent" />

          <div
            className="relative z-10 flex flex-col justify-end h-full mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12 py-12 lg:py-16"
            style={{ minHeight: "inherit" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-4 font-medium">
                Motion
              </p>
              <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-white mb-5">
                Reels
              </h1>
              <p className="text-white/45 text-base sm:text-lg leading-relaxed max-w-xl">
                Live events, raw energy, and cinematic moments — captured frame
                by frame.
              </p>
            </motion.div>

            {/* Clip count pill — bottom right */}
            {!loading && !error && items.length > 0 && (
              <div className="absolute bottom-8 right-8 hidden lg:flex items-center gap-2 border border-white/15 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/40">
                  {items.length} clips
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Content ────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-12 pb-28 sm:px-8 lg:px-12">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-40">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/30 animate-bounce"
                    style={{ animationDelay: `${i * 0.14}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-40 text-center">
              <p className="text-white/35 text-sm">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && items.length === 0 && (
            <div className="py-40 text-center">
              <p className="text-white/25 text-xs uppercase tracking-[0.25em]">
                No reels yet
              </p>
            </div>
          )}

          {/* ── Featured hero card ──────────────────────────────── */}
          {!loading && !error && featured && (
            <div className="mb-6">
              <FeaturedCard
                item={featured}
                onOpen={() => setActive(featured)}
              />
            </div>
          )}

          {/* ── Rest of clips ───────────────────────────────────── */}
          {!loading && !error && rest.length > 0 && (
            <>
              {/* Section divider */}
              <div className="flex items-center gap-4 mb-8 mt-16">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                  All Clips
                </span>
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-[10px] font-mono text-white/20">
                  {rest.length}
                </span>
              </div>

              {/* Mixed grid — first 2 cards are large (2-col), rest are smaller (4-col) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* First two items span 2 columns each on large screens */}
                {rest.slice(0, 2).map((item, idx) => (
                  <div key={item._id} className="lg:col-span-2">
                    <VideoCard
                      item={item}
                      rank={idx + 2}
                      onOpen={() => setActive(item)}
                    />
                  </div>
                ))}
                {/* Remaining items fill 1 column each */}
                {rest.slice(2).map((item, idx) => (
                  <VideoCard
                    key={item._id}
                    item={item}
                    rank={idx + 4}
                    onOpen={() => setActive(item)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {activeVideo && (
        <VideoModal
          key={activeVideo._id}
          item={activeVideo}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
