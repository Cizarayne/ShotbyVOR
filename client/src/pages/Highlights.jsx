import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Play } from "lucide-react";
import { trackView } from "../lib/trackView";
import { useSEO } from "../lib/useSEO";

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchHighlights() {
  const res = await fetch("/api/highlights");
  if (!res.ok) throw new Error("Failed to load highlights");
  return res.json();
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({ item, allItems, onClose }) {
  const idx = allItems.findIndex((p) => p._id === item._id);
  const [current, setCurrent] = useState(idx);
  const active = allItems[current];
  const hasPrev = current > 0;
  const hasNext = current < allItems.length - 1;

  const prev = useCallback(() => {
    if (hasPrev) setCurrent((i) => i - 1);
  }, [hasPrev]);
  const next = useCallback(() => {
    if (hasNext) setCurrent((i) => i + 1);
  }, [hasNext]);

  // Milestone flags — reset whenever a different highlight displays.
  const engagedRef = useRef(false);
  const milestoneRef = useRef(false);
  useEffect(() => {
    engagedRef.current = false;
    milestoneRef.current = false;
  }, [active?._id]);

  // Photos count a view when displayed (once per session); videos count on
  // genuine playback, so replaying a video actually moves the counter.
  useEffect(() => {
    if (active?._id && active.mediaType !== "video") {
      trackView("highlights", active._id);
    }
  }, [active?._id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-6xl flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl bg-[#0f1214] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image / Video pane */}
        <div className="relative md:w-3/5 bg-black flex items-center justify-center min-h-72">
          {active.mediaType === "video" ? (
            <video
              src={active.mediaUrl}
              className="w-full max-h-[80vh] object-contain"
              controls
              autoPlay
              muted
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.currentTime >= 3 && !engagedRef.current) {
                  engagedRef.current = true;
                  trackView("highlights", active._id, { repeatable: true });
                }
                if (
                  v.duration &&
                  v.currentTime / v.duration >= 0.75 &&
                  !milestoneRef.current
                ) {
                  milestoneRef.current = true;
                  trackView("highlights", active._id, { repeatable: true });
                }
              }}
              onEnded={() => {
                if (milestoneRef.current) return;
                milestoneRef.current = true;
                trackView("highlights", active._id, { repeatable: true });
              }}
            />
          ) : (
            <img
              src={active.mediaUrl}
              alt={active.title}
              className="w-full max-h-[80vh] object-contain"
            />
          )}

          {hasPrev && (
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition hover:scale-110 backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {hasNext && (
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition hover:scale-110 backdrop-blur-sm"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white/60 text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm">
            {current + 1} / {allItems.length}
          </div>
        </div>

        {/* Text pane */}
        <div className="md:w-2/5 flex flex-col p-8 md:p-10 justify-between bg-[#0f1214]">
          <div>
            {active.category && (
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block mb-3">
                {active.category}
              </span>
            )}
            <h2 className="text-2xl font-serif font-bold tracking-tight text-white leading-snug mb-4">
              {active.title}
            </h2>
            {active.description && (
              <p className="text-white/50 text-sm leading-relaxed">
                {active.description}
              </p>
            )}
            {(active.event || active.date) && (
              <p className="mt-4 text-xs text-white/30 font-mono uppercase tracking-wider">
                {active.event}
                {active.event && active.date ? "  ·  " : ""}
                {active.date &&
                  new Date(active.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            )}
          </div>

          {/* Nav dots */}
          <div className="flex gap-1.5 mt-8 flex-wrap">
            {allItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-white w-4"
                    : "bg-white/20 hover:bg-white/40 w-1.5"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white flex items-center justify-center transition hover:scale-105"
        >
          <X size={16} />
        </button>
      </motion.div>
    </div>
  );
}

// ── Spotlight row ─────────────────────────────────────────────────────────────

function SpotlightRow({ item, index, onOpen }) {
  const isEven = index % 2 === 0; // even = image left, odd = image right

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
        isEven ? "" : "md:[direction:rtl]"
      }`}
    >
      {/* Image */}
      <div
        className="w-full overflow-hidden rounded-2xl bg-[#0f1214] border border-white/10 cursor-zoom-in group relative md:[direction:ltr]"
        onClick={() => onOpen(item)}
      >
        {item.mediaType === "video" ? (
          <video
            src={item.mediaUrl}
            className="w-full h-[420px] object-cover group-hover:scale-[1.03] transition duration-700 ease-out"
            muted
            loop
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        ) : (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="w-full h-[420px] object-cover group-hover:scale-[1.03] transition duration-700 ease-out"
            loading="lazy"
          />
        )}
        {item.mediaType === "video" && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/55 backdrop-blur-sm">
              <Play className="h-6 w-6 text-white" fill="currentColor" />
            </span>
          </span>
        )}
        {/* hover hint */}
        <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black/70 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm flex items-center gap-1.5">
            View full image <ArrowUpRight size={12} />
          </span>
        </div>
        {item.featured && (
          <div className="absolute top-3 left-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              Featured
            </span>
          </div>
        )}
        {item.mediaType === "video" && (
          <div className="absolute top-3 right-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              Video
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="max-w-xl md:[direction:ltr]">
        {item.category && (
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/35 block mb-3">
            {item.category}
          </span>
        )}
        <h2
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white mb-4 hover:text-white/70 transition-colors duration-300 cursor-pointer leading-tight"
          onClick={() => onOpen(item)}
        >
          {item.title}
        </h2>
        {item.description && (
          <p className="text-white/45 text-base leading-relaxed">
            {item.description}
          </p>
        )}
        {(item.event || item.date) && (
          <p className="mt-4 text-xs text-white/25 font-mono uppercase tracking-wider">
            {item.event}
            {item.event && item.date ? "  ·  " : ""}
            {item.date &&
              new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Grid card ─────────────────────────────────────────────────────────────────

function GridCard({ item, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative flex min-h-[440px] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#151c1b] shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition duration-500 ease-out hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_24px_65px_rgba(0,0,0,0.45)]"
      onClick={() => onOpen(item)}
    >
      <div className="absolute inset-0 overflow-hidden">
        {item.mediaType === "video" ? (
          <video
            src={item.mediaUrl}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            muted
            loop
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        ) : (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-[#101a18]/95" />
      {item.featured && (
        <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
          Featured
        </span>
      )}
      {item.mediaType === "video" && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/55 backdrop-blur-sm">
            <Play className="h-6 w-6 text-white" fill="currentColor" />
          </span>
        </span>
      )}

      <div className="relative z-10 mt-auto flex flex-col p-6 sm:p-7">
        {item.category && (
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
            {item.category}
          </span>
        )}
        <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-2xl">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
            {item.description}
          </p>
        )}

        <div className="mt-5 flex min-h-8 flex-wrap items-center gap-2">
          {(item.event || item.date) && (
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur-md">
              {item.event || "Highlight"}
            </span>
          )}
          {item.date && (
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur-md">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {item.mediaType === "video" && (
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur-md">
              Video
            </span>
          )}
        </div>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-[#17201d] transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#101a18]"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(item);
          }}
        >
          Reserve now
        </button>
      </div>
    </motion.article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Highlights() {
  useSEO({
    title: "Highlights — Events & Live Moments",
    description:
      "SHOTBYVOR highlights — the best frames from concerts, nightlife, weddings and live events, captured and graded cinematically.",
    path: "/work/highlights",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    fetchHighlights()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Featured items = spotlight rows (alternating), rest = grid
  const spotlight = items.filter((item) => item.featured);
  const grid = items.filter((item) => !item.featured);

  // If nothing is featured, fall back to showing all in the grid
  const showSpotlight = spotlight.length > 0;
  const gridItems = showSpotlight ? grid : items;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080a0c]">
      {/* Subtle background orbs */}
      <div className="pointer-events-none absolute -right-40 top-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32">
        {/* ── Header with bg image ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full overflow-hidden border-y border-white/10"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/page-heading-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/90 via-[#080a0c]/65 to-[#080a0c]/30" />
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-4xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 block">
                Selected Moments
              </span>
              <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
                Highlights
              </h1>
            </div>
          </div>
        </motion.div>

        {/* ── Content ───────────────────────────────────────── */}
        <div className="relative z-10 w-full px-6 pt-14 pb-24 sm:px-12 lg:px-20 xl:px-24">
          <main className="mx-auto max-w-7xl space-y-32">
            {/* ── Loading ───────────────────────────────────────── */}
            {loading && (
              <div className="flex items-center justify-center py-32">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Error ─────────────────────────────────────────── */}
            {error && (
              <div className="py-32 text-center">
                <p className="text-white/40 text-sm">{error}</p>
              </div>
            )}

            {/* ── Empty ─────────────────────────────────────────── */}
            {!loading && !error && items.length === 0 && (
              <div className="py-32 text-center">
                <p className="text-white/30 text-sm uppercase tracking-[0.2em]">
                  No highlights yet
                </p>
              </div>
            )}

            {/* ── Spotlight rows ────────────────────────────────── */}
            {!loading && !error && showSpotlight && (
              <section className="space-y-24">
                {spotlight.map((item, i) => (
                  <SpotlightRow
                    key={item._id}
                    item={item}
                    index={i}
                    onOpen={setLightboxItem}
                  />
                ))}
              </section>
            )}

            {/* ── Grid ──────────────────────────────────────────── */}
            {!loading && !error && gridItems.length > 0 && (
              <section
                className={
                  showSpotlight ? "pt-16 border-t border-white/10" : ""
                }
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {gridItems.map((item) => (
                    <GridCard
                      key={item._id}
                      item={item}
                      onOpen={setLightboxItem}
                    />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          allItems={items}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </section>
  );
}
