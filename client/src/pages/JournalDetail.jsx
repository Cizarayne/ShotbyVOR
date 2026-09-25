import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { trackView } from "../lib/trackView";
import { apiUrl } from "../lib/apiBase";
import { useSEO } from "../lib/useSEO";

export default function JournalDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic SEO from the fetched journal (title/excerpt/cover). Falls back
  // to a noindexed generic tag while loading or on error.
  useSEO({
    title: item?.title || "Journal",
    description:
      item?.excerpt ||
      item?.content?.slice(0, 155) ||
      "Read this story from SHOTBYVOR — thoughts and process from behind the lens.",
    path: `/work/journals/${item?._id || id}`,
    image: item?.coverUrl,
    noindex: !item,
  });

  useEffect(() => {
    fetch(apiUrl(`/api/journals/${id}`))
      .then((res) => {
        if (!res.ok) throw new Error("Journal not found");
        return res.json();
      })
      .then((data) => {
        if (!data.published) throw new Error("Journal not found");
        setItem(data);
        trackView("journals", id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <article className="min-h-screen bg-[#080a0c] px-6 pb-24 pt-28 sm:px-8 sm:pt-32 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/work/journals" className="mb-12 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"><ArrowLeft size={16} />Back to journals</Link>
        {loading ? <div className="py-20 text-center text-white/50">Loading journal…</div> : error ? <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-center text-red-200">{error}</div> : item && (
          <>
            <header className="border-b border-white/10 pb-10">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-white/45">
                <span className="inline-flex items-center gap-2"><CalendarDays size={15} />{new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                {item.tags?.map((tag) => <span key={tag} className="inline-flex items-center gap-1.5"><Tag size={14} />{tag}</span>)}
              </div>
              <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">{item.title}</h1>
              {item.excerpt && <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/55">{item.excerpt}</p>}
            </header>
            {item.coverUrl &&
              (item.coverType === "video" ? (
                <video
                  src={item.coverUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="mt-10 max-h-[560px] w-full rounded-2xl border border-white/10 bg-black object-contain"
                />
              ) : (
                <img src={item.coverUrl} alt={item.title} className="mt-10 max-h-[560px] w-full rounded-2xl border border-white/10 object-cover" />
              ))}
            <div className="mt-10 whitespace-pre-wrap text-lg leading-[1.9] text-white/75">{item.content}</div>
          </>
        )}
      </div>
    </article>
  );
}
