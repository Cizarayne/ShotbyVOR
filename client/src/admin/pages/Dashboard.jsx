import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Image,
  Film,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Eye,
  ChevronRight,
  X,
} from "lucide-react";
import { api } from "../lib/api";

const SECTIONS = [
  { key: "work", label: "Work", icon: Image, to: "/admin/work", color: "blue" },
  {
    key: "reels",
    label: "Reels",
    icon: Film,
    to: "/admin/reels",
    color: "violet",
  },
  {
    key: "highlights",
    label: "Highlights",
    icon: Sparkles,
    to: "/admin/highlights",
    color: "amber",
  },
  {
    key: "journals",
    label: "Journals",
    icon: BookOpen,
    to: "/admin/journals",
    color: "emerald",
  },
];

const COLOR = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    badge: "text-blue-600",
    bar: "bg-blue-500",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "bg-violet-100 text-violet-600",
    badge: "text-violet-600",
    bar: "bg-violet-500",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    badge: "text-amber-600",
    bar: "bg-amber-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    badge: "text-emerald-600",
    bar: "bg-emerald-500",
  },
};

// ── View helpers ─────────────────────────────────────────────────────────────
// Items created before view tracking existed may not have a `views` field,
// so treat anything non-numeric as 0.
const views = (item) => Number(item?.views) || 0;
const sectionViews = (items) => items.reduce((sum, it) => sum + views(it), 0);
const topPerformer = (items) =>
  items.reduce((best, it) => (!best || views(it) > views(best) ? it : best), null);
const fmt = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);

// Short type/status label for an individual item in the drill-down modal.
const typeLabel = (key, item) => {
  if (key === "journals") return item.published ? "Published" : "Draft";
  if (key === "reels") return "Video";
  return item.mediaType === "video" ? "Video" : "Image";
};

// Best image URL to use as a row thumbnail; empty string when none exists
// (e.g. videos without a poster frame).
const thumbOf = (key, item) => {
  if (key === "reels") return item.thumbnailUrl || "";
  if (key === "journals")
    return item.coverType === "image" ? item.coverUrl || "" : "";
  return item.mediaType === "image" ? item.mediaUrl || "" : "";
};

export default function AdminDashboard() {
  const [data, setData] = useState({
    work: [],
    reels: [],
    highlights: [],
    journals: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Single round-trip: full item arrays + precomputed counts/views.
        const summary = await api.get("/dashboard");
        setData({
          work: summary.work || [],
          reels: summary.reels || [],
          highlights: summary.highlights || [],
          journals: summary.journals || [],
        });
      } catch (_) {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Performance drill-down ────────────────────────────────────────────────
  // null = closed, "all" = every item ranked together, otherwise a section key.
  const [drill, setDrill] = useState(null);

  useEffect(() => {
    if (!drill) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setDrill(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [drill]);

  // ── Performance numbers ─────────────────────────────────────────────────────
  const totalViews = SECTIONS.reduce(
    (sum, { key }) => sum + sectionViews(data[key]),
    0,
  );
  const videoViews =
    sectionViews(data.reels) +
    sectionViews(data.work.filter((i) => i.mediaType === "video")) +
    sectionViews(data.highlights.filter((i) => i.mediaType === "video"));
  const maxSectionViews = Math.max(
    ...SECTIONS.map(({ key }) => sectionViews(data[key])),
    0,
  );

  // ── Drill-down rows: individual content sorted by views ───────────────────
  const drillSections =
    drill == null
      ? []
      : drill === "all"
        ? SECTIONS
        : SECTIONS.filter(({ key }) => key === drill);
  const drillRows = drillSections
    .flatMap(({ key, label, icon, color }) =>
      data[key].map((item) => ({ item, key, label, icon, color })),
    )
    .sort((a, b) => views(b.item) - views(a.item));
  const drillTotal = drillRows.reduce((sum, r) => sum + views(r.item), 0);
  const drillMax = Math.max(...drillRows.map((r) => views(r.item)), 1);
  const drillSection =
    drill && drill !== "all" ? SECTIONS.find(({ key }) => key === drill) : null;
  const DrillIcon =
    drill === "all" ? Eye : drillSection ? drillSection.icon : null;
  const drillTitle =
    drill === "all"
      ? "All content performance"
      : drillSection
        ? `${drillSection.label} performance`
        : "";
  const drillIconCls =
    drill === "all"
      ? "bg-blue-100 text-blue-600"
      : drillSection
        ? COLOR[drillSection.color].icon
        : "";

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">
            Overview
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        <p className="text-slate-500 mt-1">
          Manage your Shotbyvor content from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SECTIONS.map(({ key, label, icon: Icon, to, color }) => {
          const c = COLOR[color];
          return (
            <Link
              key={key}
              to={to}
              className={`admin-card p-5 hover:shadow-md transition-shadow group ${c.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg ${c.icon}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight
                  className={`w-4 h-4 ${c.badge} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {loading ? "—" : data[key].length}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </Link>
          );
        })}
      </div>

      {/* Performance */}
      <div className="admin-card p-6 mb-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                Performance
              </span>
            </div>
            <h2 className="font-semibold text-slate-700">
              How your content is doing
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              A view is counted when a visitor opens a reel, reads a journal, or
              expands a photo/video full-screen. Click a section below — or the totals — to see per-content insights.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDrill("all")}
            className="group flex items-center gap-2 text-right"
            aria-label="View per-content performance"
          >
            <div>
              <p className="text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {loading ? "—" : fmt(totalViews)}
              </p>
              <p className="text-xs text-slate-400">
                total views · {loading ? "—" : fmt(videoViews)} from videos
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTIONS.map(({ key, label, icon: Icon, color }) => {
            const c = COLOR[color];
            const items = data[key];
            const secViews = sectionViews(items);
            const top = topPerformer(items);
            const pct = maxSectionViews
              ? Math.round((secViews / maxSectionViews) * 100)
              : 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setDrill(key)}
                className="group w-full text-left rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${c.icon}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {loading ? "—" : `${items.length} ${items.length === 1 ? "item" : "items"}`}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {loading ? "—" : fmt(secViews)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 mb-2">
                  {label} views
                </p>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-400 truncate">
                  {loading
                    ? "\u00A0"
                    : top
                      ? `Top: ${top.title || "Untitled"} (${fmt(views(top))})`
                      : "No views yet"}
                </p>
                <span className="mt-2 flex items-center justify-end gap-1 text-[11px] font-medium text-slate-400 transition-colors group-hover:text-blue-500">
                  View items
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance drill-down: per-content insights */}
      {drill && DrillIcon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={drillTitle}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrill(null)}
          />
          <div className="relative admin-card w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 p-5">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${drillIconCls}`}
              >
                <DrillIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-800 truncate">
                  {drillTitle}
                </h2>
                <p className="text-xs text-slate-400">
                  {drillRows.length} {drillRows.length === 1 ? "item" : "items"} · {fmt(drillTotal)} views · ranked by views
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrill(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-2 overflow-y-auto p-5">
              {drillRows.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No content yet — add something to see how it performs.
                </div>
              ) : (
                drillRows.map(({ item, key, label, icon: Icon, color }, i) => {
                  const v = views(item);
                  const share = drillTotal
                    ? Math.round((v / drillTotal) * 100)
                    : 0;
                  const barPct = Math.round((v / drillMax) * 100);
                  const thumb = thumbOf(key, item);
                  const meta = [
                    drill === "all" ? label : null,
                    typeLabel(key, item),
                    item.category,
                    key === "reels" ? item.duration : "",
                  ]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <div
                      key={item._id || `${key}-${i}`}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                            i === 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ${COLOR[color].icon}`}
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="truncate text-sm font-medium text-slate-700">
                              {item.title || "Untitled"}
                            </p>
                            <span className="shrink-0 text-sm font-bold text-slate-800">
                              {fmt(v)}
                            </span>
                          </div>
                          <p className="truncate text-[11px] text-slate-400">
                            {meta}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 pl-9">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200/70">
                          <div
                            className={`h-full rounded-full ${COLOR[color].bar}`}
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-[10px] text-slate-400">
                          {share}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
