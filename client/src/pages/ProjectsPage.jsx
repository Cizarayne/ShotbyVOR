import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const projectItems = [
  // --- SPOTLIGHT HEADLINER ROWS ---
  {
    id: 1,
    image: "/Featured/barry_jhay.jpeg",
    category: "LIVE PERFORMANCE / REEL",
    title: "Barry Jhay Lighting Up the Night Stage",
    description:
      "Capturing the raw energy, heavy bass lines, and vibrant streetwear aesthetic of the underground music scene in its purest form.",
    layout: "text-right",
  },
  {
    id: 2,
    image: "/Featured/Skales.jpeg",
    category: "CONCERT DOCUSERIES",
    title: "Skales Controls the Crowd Under Neon Greens",
    description:
      "A visual deep-dive into high-intensity crowd engagement, framing heavy structural stage scaffolding against glowing neon backdrops.",
    layout: "text-left",
  },
  {
    id: 3,
    image: "/Featured/khomeini_Bukhari.jpeg",
    category: "ARTIST SPOTLIGHT",
    title: "Khomeini Bukhari — Stage Presence & Raw Energy",
    description:
      "An intimate close-up capturing the commanding stage presence and electrifying performance energy of Khomeini Bukhari under dramatic lighting.",
    layout: "text-right",
  },
  {
    id: 4,
    image: "/Featured/image6.jpeg",
    category: "STAGE PRODUCTION & DESIGN",
    title: "Bikini Bottom Main Stage Rigging",
    description:
      "Showcasing the massive structural architecture, customized neon light panels, and setup configurations built for the ultimate experiential audio-visual night.",
    layout: "text-left",
  },
  {
    id: 5,
    image: "/Featured/image10.jpeg",
    category: "LIVE BROADCAST / AUDIO",
    title: "Laser Arrays & DJ Deck Perspective",
    description:
      "An immersive viewpoint from behind the mixers, capturing the intersection of blinding green overhead neon tubes and thousands of moving hands.",
    layout: "text-right",
  },
  {
    id: 6,
    image: "/Featured/image12.jpeg",
    category: "FESTIVAL ANTHEMS",
    title: "One Year of Epic Water Battles",
    description:
      "An expansive mid-stage wide angle capturing the performance crew waving flags under blinding white neon structures and warm yellow beams.",
    layout: "text-left",
  },
  {
    id: 7,
    image: "/Featured/image14.jpeg",
    category: "ARTIST SPOTLIGHT",
    title: "Center Stage Overalls & Lens Flares",
    description:
      "A striking profile tracking an artist in bold red overalls commanding a wet stage deck, framed by massive horizontal lighting rigs.",
    layout: "text-right",
  },
  {
    id: 8,
    image: "/Featured/image18.jpeg",
    category: "EVENT ANTHOLOGY / VISUALS",
    title: "The Soakers Collective Retrospective",
    description:
      "A high-impact, multi-pane editorial grid detailing tactical gear aesthetics, wet-zone warning signs, and monochromatic stage architecture.",
    layout: "text-left",
  },

  // --- LOWER MODULAR EDITORIAL MATRIX ---
  {
    id: 9,
    image: "/Featured/softmadeit.jpeg",
    category: "FESTIVAL CULTURE",
    title: "The Soakers Chronicles",
    description:
      "Up-close, ultra-dynamic portraits tracking the absolute chaos, water guns, and high fashion of summer youth culture.",
    layout: "grid-item",
  },
  {
    id: 10,
    image: "/Featured/image5.jpeg",
    category: "BEHIND THE SCENES",
    title: "Backstage Access & Crew Synclines",
    description:
      "Documenting the candid, quiet moments between sets where artists and production crews sync up beneath the rig lines.",
    layout: "grid-item",
  },
  {
    id: 11,
    image: "/Featured/image2.jpeg",
    category: "EXPERIMENTAL REELS",
    title: "Foam Party Chaos & Motion Blurs",
    description:
      "Pushing shutter limits to capture high-contrast water, thick foam clouds, and rapid physical movement in low lighting conditions.",
    layout: "grid-item",
  },
  {
    id: 12,
    image: "/Featured/image11.jpeg",
    category: "BOOTH DYNAMICS",
    title: "DJ Deck Hype & Infrared Tones",
    description:
      "A tight, atmospheric look inside the performance booth as the team builds energy over the mixers under a massive emerald backdrop.",
    layout: "grid-item",
  },
  {
    id: 13,
    image: "/Featured/image13.jpeg",
    category: "STREETWEAR & CANDID",
    title: "Foam Runners & Stage Confetti",
    description:
      "A gritty, close-up perspective from the stage floor highlighting performance footwear, colorful water guns, and gold confetti.",
    layout: "grid-item",
  },
  {
    id: 14,
    image: "/Featured/image15.jpeg",
    category: "BACKSTAGE ENERGY",
    title: "Mixer Pilots & Currency Showers",
    description:
      "Capturing the peak intensity behind the sound systems as DJs work the tables amidst flying cash and high-intensity overhead trusses.",
    layout: "grid-item",
  },
  {
    id: 15,
    image: "/Featured/image16.jpeg",
    category: "BARRIER PERSPECTIVE",
    title: "Front Row Rail Glances",
    description:
      "An evocative documentary-style portrait capturing the intense focus and raw emotion of front-row fans pressed up against the security barricades.",
    layout: "grid-item",
  },
  {
    id: 16,
    image: "/Featured/image17.jpeg",
    category: "AMBIENT PORTRAITS",
    title: "Flash Self-Portraiture & Blue Tones",
    description:
      "A raw, sharp foreground perspective juxtaposed against balloon streams and deep sapphire overhead stage illumination.",
    layout: "grid-item",
  },
  {
    id: 17,
    image: "/Featured/image19.jpeg",
    category: "ACTION CAPTURE",
    title: "Foam Stream Target Focus",
    description:
      "A split-second action shot catching water streams slicing directly across the camera frame in a sea of suds and vibrant red accents.",
    layout: "grid-item",
  },
  {
    id: 18,
    image: "/Featured/image4.jpeg",
    category: "CROWD DYNAMICS",
    title: "Surging Energies & Super-Soakers Battles",
    description:
      "Massive close-up captures showcasing scale, atmospheric depth, and festival goers completely drenched mid-experience.",
    layout: "grid-item",
  },
  {
    id: 19,
    image: "/Featured/image7.jpeg",
    category: "WIDESCREEN CAPTURE",
    title: "Stadium Scale & Audience Horizon Lines",
    description:
      "Expansive ultra-wide perspective documenting the massive volume of the arena crowd under high-powered stadium floodlights.",
    layout: "grid-item",
  },
  {
    id: 20,
    image: "/Featured/image8.jpeg",
    category: "PORTRAITURE / GLOW",
    title: "Flash Candid & High-Contrast Night Life",
    description:
      "Sharp, raw event portraiture playing with ambient lens flares, sweat sheen, and saturated concert backdrops.",
    layout: "grid-item",
  },
  {
    id: 21,
    image: "/Featured/image9.jpeg",
    category: "STAGE INTENSITY",
    title: "Artist Handshakes & Pit Action",
    description:
      "Capturing split-second interactive energy directly at the stage barricades as artists hype up front-row attendees.",
    layout: "grid-item",
  },
  {
    id: 22,
    image: "/Featured/image1.jpeg",
    category: "CROWD DYNAMICS",
    title: "Surging Energies & Wide Angle Visuals",
    description:
      "Massive panoramic wide captures showcasing scale, atmospheric depth, and thousands of festival goers moving in unison.",
    layout: "grid-item",
  },
  {
    id: 23,
    image: "/Featured/image20.jpeg",
    category: "LIVE VISUALS",
    title: "Stage Lights & Crowd Energy",
    description:
      "Electric atmosphere captured mid-performance as stage lighting bathes the crowd in vivid colour and raw concert energy.",
    layout: "grid-item",
  },
  {
    id: 24,
    image: "/Featured/image21.jpeg",
    category: "NIGHT CULTURE",
    title: "After Hours & Neon Glow",
    description:
      "Late-night documentary frames blending ambient neon tones, crowd movement, and the unfiltered energy of the night.",
    layout: "grid-item",
  },
];

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ item, allItems, onClose }) {
  const idx = allItems.findIndex((p) => p.id === item.id);
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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image pane */}
        <div className="relative md:w-3/5 bg-slate-950 flex items-center justify-center min-h-72">
          <img
            src={active.image}
            alt={active.title}
            className="w-full h-full max-h-[80vh] object-contain"
          />

          {/* Prev */}
          {hasPrev && (
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition hover:scale-110 backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Next */}
          {hasNext && (
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition hover:scale-110 backdrop-blur-sm"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white/70 text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm">
            {current + 1} / {allItems.length}
          </div>
        </div>

        {/* Text pane */}
        <div className="md:w-2/5 flex flex-col p-8 md:p-10 justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600 block mb-3">
              {active.category}
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 leading-snug mb-4">
              {active.title}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {active.description}
            </p>
          </div>

          {/* Nav dots */}
          <div className="flex gap-1.5 mt-8 flex-wrap">
            {allItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === current
                    ? "bg-violet-600 w-4"
                    : "bg-slate-200 hover:bg-violet-300"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-violet-600 hover:bg-slate-50 flex items-center justify-center transition hover:scale-105"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [lightboxItem, setLightboxItem] = useState(null);

  const topFeatures = projectItems.filter(
    (item) => item.layout !== "grid-item",
  );
  const bottomGrid = projectItems.filter((item) => item.layout === "grid-item");

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans px-6 py-16 sm:px-12 lg:px-20 xl:px-24">
      {/* Editorial Header */}
      <header className="max-w-7xl mx-auto mb-24 border-b border-slate-200 pb-10">
        <span className=" font-metal-mania text-xs font-bold uppercase tracking-[0.3em] text-violet-600 block mb-3">
          Selected Portfolios
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 max-w-3xl">
          Capturing high-octane music culture, crowd movement, and raw stage
          aesthetics.
        </h1>
      </header>

      <main className="max-w-7xl mx-auto space-y-32">
        {/* TOP: Alternating spotlight rows */}
        <section className="space-y-24">
          {topFeatures.map((project) => (
            <div
              key={project.id}
              className={`relative grid md:grid-cols-2 gap-8 md:gap-16 items-center transition-all duration-500 ease-out hover:z-10 hover:-translate-y-1 ${
                project.layout === "text-left"
                  ? "md:flex md:flex-row-reverse"
                  : ""
              }`}
            >
              {/* Image — clickable */}
              <div
                className="w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm border border-slate-100 cursor-zoom-in group relative transition-all duration-500 ease-out hover:shadow-xl hover:shadow-slate-200/80 hover:border-violet-200"
                onClick={() => setLightboxItem(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-120 object-cover group-hover:scale-[1.03] transition duration-700 ease-out"
                />
                {/* View hint */}
                <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-slate-200 backdrop-blur-sm">
                    View full image
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="max-w-xl transition-all duration-500 ease-out">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-600 block mb-2">
                  {project.category}
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-4 hover:text-violet-600 transition-colors duration-300 cursor-pointer"
                  onClick={() => setLightboxItem(project)}
                >
                  {project.title}
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* BOTTOM: Grid */}
        <section className="pt-16 border-t border-slate-100">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative">
            {bottomGrid.map((project) => (
              <div
                key={project.id}
                className="relative z-0 flex flex-col group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:z-10"
                onClick={() => setLightboxItem(project)}
              >
                <div className="w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-100 mb-4 shadow-sm relative transition-all duration-300 ease-out group-hover:shadow-lg group-hover:shadow-slate-200/70 group-hover:border-violet-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-72 object-cover group-hover:scale-[1.05] transition duration-500 ease-out"
                  />
                  {/* View hint */}
                  <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/90 text-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-slate-200">
                      View full image
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 block mb-1 transition-colors duration-300">
                  {project.category}
                </span>
                <h3 className="text-md font-bold tracking-tight text-slate-900 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 transition-colors duration-300 group-hover:text-slate-600">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          allItems={projectItems}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </div>
  );
}
