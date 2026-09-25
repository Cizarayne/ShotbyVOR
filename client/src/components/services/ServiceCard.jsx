import { motion, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export default function ServiceCard({
  service,
  index,
  total,
  progress,
}) {
  const isLast = index === total - 1;

  // --- Scroll mapping, Skiper #16 style (recreated from scratch) ---
  // Card i gets pinned when it reaches the viewport, then card i+1
  // slides over it. While card i+1 is arriving, card i eases down
  // to its resting scale. Last card never scales.
  const start = index / total;
  const end = (index + 1) / total;

  const targetScale = isLast ? 1 : 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [start, end], [1, targetScale]);

  // Gentle settle: the pinned card drifts up slightly as it shrinks,
  // which sells the physical "stack" feeling.
  const y = useTransform(progress, [start, end], [0, isLast ? 0 : -14]);

  // Barely-there dim on older cards so the incoming card reads on top.
  const brightness = useTransform(
    progress,
    [start, end],
    [1, isLast ? 1 : 0.82]
  );
  const filter = useTransform(
    brightness,
    (b) => `brightness(${b})`
  );

  // Each card pins a little lower than the one before it, so the
  // rounded top edges of earlier cards peek out behind the active card.
  const pinOffset = index * 16;
  const Icon = service.Icon;

  return (
    <div className="sticky top-0 flex h-[100svh] w-full items-start justify-center">
      <motion.article
        style={{
          scale,
          y,
          filter,
          transformOrigin: "top center",
          marginTop: `calc(9vh + ${pinOffset}px)`,
        }}
        className="relative mx-auto flex h-[74svh] max-h-[740px] min-h-[500px] w-[88vw] max-w-[1200px] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-[#1C1F21]/70 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:h-[72svh] md:min-h-[540px] md:max-h-[760px] md:flex-row"
    >
      {/* ── Image side (its own slot, no overlap = no awkward cutoffs) ── */}
      <div className="relative h-[36%] min-h-[190px] w-full shrink-0 overflow-hidden sm:h-[38%] md:h-full md:min-h-0 md:w-[45%] md:max-w-[540px]">
        <img
          src={service.image}
          alt={service.title}
          loading={index === 0 ? "eager" : "lazy"}
          style={{ objectPosition: service.focus || "50% 50%" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* gentle legibility shade, heavier on mobile where text sits below */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/25" />
      </div>

      {/* ── Glass content panel ── */}
      <div className="relative flex-1 border-t border-white/15 bg-[#1C1F21]/45 px-6 py-7 backdrop-blur-2xl sm:px-10 md:flex md:min-h-full md:w-[55%] md:flex-col md:justify-center md:border-l md:border-t-0 md:bg-[#1C1F21]/55 md:px-12 md:py-12 lg:px-14">
          {/* soft top glow for depth */}
          <div className="pointer-events-none absolute -top-20 left-1/3 h-48 w-72 rounded-full bg-white/[0.08] blur-3xl" />
          {/* Number + badge row */}
          <div className="relative mb-5 flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="font-mono text-sm font-medium tracking-wider text-[#7D838C]">
              {service.number}
            </span>
            {Icon && (
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md">
                <Icon size={16} />
              </span>
            )}
            {service.category && (
              <span className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                {service.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="relative mb-2 font-serif text-3xl leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {service.title}
          </h3>

          {/* Tagline */}
          {service.tagline && (
            <p className="relative mb-3 font-serif text-base italic text-white/85 sm:text-lg">
              {service.tagline}
            </p>
          )}

          {/* Description */}
          <p className="relative mb-5 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-base lg:text-lg">
            {service.description}
          </p>

          {/* Deliverables */}
          {service.deliverables && (
            <ul className="relative mb-5 flex flex-wrap gap-2">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md"
                >
                  <Check size={13} className="text-white" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Meta + CTA row */}
          <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="/contact-us"
              className="group/btn inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              <span>Explore Service</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </Link>
            {service.meta && (
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/45">
                {service.meta}
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
