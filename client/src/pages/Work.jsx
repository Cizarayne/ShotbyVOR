import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Film, Image as ImageIcon, Play, X } from "lucide-react";
import { trackView } from "../lib/trackView";
import { useSEO } from "../lib/useSEO";

async function fetchWork() {
  const res = await fetch("/api/work");
  if (!res.ok) throw new Error("Failed to load work");
  return res.json();
}

export default function Work() {
  useSEO({
    title: "Work — Photography Portfolio",
    description:
      "Browse the SHOTBYVOR photography portfolio — portraits, events, brands and lifestyle shoots captured with intentional light and real emotion.",
    path: "/work",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    fetchWork()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Milestone flags — reset each time a different item is opened.
  const engagedRef = useRef(false);
  const milestoneRef = useRef(false);
  useEffect(() => {
    engagedRef.current = false;
    milestoneRef.current = false;
  }, [lightboxItem?._id]);

  // Photos count a view on open (once per session); videos count on genuine
  // playback, so replaying a video actually moves the counter.
  useEffect(() => {
    if (lightboxItem?._id && lightboxItem.mediaType !== "video") {
      trackView("work", lightboxItem._id);
    }
  }, [lightboxItem]);

  // Close the lightbox with Escape and lock background scroll while open
  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e) => e.key === "Escape" && setLightboxItem(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxItem]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080a0c]">
      <div className="pointer-events-none absolute -right-40 top-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full overflow-hidden border-y border-white/10"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/page-heading-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/90 via-[#080a0c]/65 to-[#080a0c]/30" />
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-4xl space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">Our Portfolio</p>
              <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">Work</h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">A selection of recent projects, campaigns, and visual stories.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-24 pt-14 sm:px-8 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-20 text-sm text-white/50">Loading work…</div>
          ) : error ? (
            <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-center text-sm text-red-200">{error}</div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/50">New work is coming soon.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3) }}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0f1214]"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxItem(item)}
                    aria-label={`View ${item.title}`}
                    className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-black text-left"
                  >
                    {item.mediaType === "video" ? (
                      <video src={item.mediaUrl} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" muted loop playsInline />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                    {item.featured && <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">Featured</span>}
                    <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#080a0c] opacity-0 shadow-xl transition group-hover:opacity-100"><ArrowUpRight size={17} /></span>
                    {item.mediaType === "video" && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/55 backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white" fill="currentColor" />
                        </span>
                      </span>
                    )}
                  </button>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {item.category || "Work"}
                      {item.mediaType === "video" && <Film size={12} />}
                      {item.mediaType !== "video" && <ImageIcon size={12} />}
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">{item.title}</h2>
                    {item.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">{item.description}</p>}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Media lightbox ─────────────────────────────────────── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white sm:right-6 sm:top-6"
          >
            <X size={18} />
          </button>
          <div className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {lightboxItem.mediaType === "video" ? (
              <video
                src={lightboxItem.mediaUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[78vh] w-full rounded-2xl bg-black object-contain"
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.currentTime >= 3 && !engagedRef.current) {
                    engagedRef.current = true;
                    trackView("work", lightboxItem._id, { repeatable: true });
                  }
                  if (
                    v.duration &&
                    v.currentTime / v.duration >= 0.75 &&
                    !milestoneRef.current
                  ) {
                    milestoneRef.current = true;
                    trackView("work", lightboxItem._id, { repeatable: true });
                  }
                }}
                onEnded={() => {
                  if (milestoneRef.current) return;
                  milestoneRef.current = true;
                  trackView("work", lightboxItem._id, { repeatable: true });
                }}
              />
            ) : (
              <img
                src={lightboxItem.mediaUrl}
                alt={lightboxItem.title}
                className="max-h-[78vh] w-full rounded-2xl object-contain"
              />
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-white/40">
              <span>{lightboxItem.category || "Work"}</span>
              <span className="text-white/20">·</span>
              <span className="font-serif text-base normal-case tracking-normal text-white">
                {lightboxItem.title}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
