import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Tag, Play } from "lucide-react";
import { useSEO } from "../lib/useSEO";

async function fetchJournals() {
  const res = await fetch("/api/journals");
  if (!res.ok) throw new Error("Failed to load journals");
  return res.json();
}

export default function Journals() {
  useSEO({
    title: "Journals — Stories From Behind the Lens",
    description:
      "SHOTBYVOR journals — thoughts, process and stories from behind the lens on shoots, edits and creative life.",
    path: "/work/journals",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJournals()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080a0c]">
      <div className="pointer-events-none absolute -right-40 top-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative w-full overflow-hidden border-y border-white/10">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/page-heading-bg.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/90 via-[#080a0c]/65 to-[#080a0c]/30" />
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-4xl space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">Stories</p>
              <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">Journals</h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">Thoughts, process, and stories from behind the lens.</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 pt-14 sm:px-8 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-20 text-sm text-white/50">Loading journals…</div>
          ) : error ? (
            <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-center text-sm text-red-200">{error}</div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/50">New stories are coming soon.</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {items.map((item, index) => (
                <motion.article key={item._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}>
                  <Link to={`/work/journals/${item._id}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#0f1214] transition hover:border-white/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    {item.coverUrl ? (
                      item.coverType === "video" ? (
                        <div className="relative">
                          <video
                            src={item.coverUrl}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105"
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-sm">
                              <Play className="h-5 w-5 text-white" fill="currentColor" />
                            </span>
                          </span>
                        </div>
                      ) : (
                        <img src={item.coverUrl} alt={item.title} className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                      )
                    ) : (
                      <div className="aspect-[16/9] w-full bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent" />
                    )}
                    <div className="p-6 sm:p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/40">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                        {item.coverType === "video" && (
                          <span className="inline-flex items-center gap-1.5"><Play size={12} fill="currentColor" /> Video</span>
                        )}
                        {item.tags?.slice(0, 2).map((tag) => <span key={tag} className="inline-flex items-center gap-1.5"><Tag size={13} />{tag}</span>)}
                      </div>
                      <div className="flex items-start justify-between gap-5">
                        <h2 className="font-serif text-3xl font-bold leading-tight text-white transition group-hover:text-white/80 sm:text-4xl">{item.title}</h2>
                        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition group-hover:bg-white group-hover:text-[#080a0c]"><ArrowUpRight size={17} /></span>
                      </div>
                      {item.excerpt && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/55 sm:text-base">{item.excerpt}</p>}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
