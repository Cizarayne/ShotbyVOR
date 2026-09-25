import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Video,
  Wand2,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "../lib/useSEO";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "../components/SocialIcons";
import { site, socialTarget } from "../lib/site";

export default function Home() {
  useSEO({
    title: "Photography & Films — Portraits, Events, Weddings, Reels",
    description:
      "SHOTBYVOR is a creative photography and videography studio capturing real moments and turning them into timeless stories. View the portfolio and book a shoot.",
    path: "/",
  });
  return (
    <section className="relative overflow-hidden bg-[#080a0c]">

      {/* Background video — below lg the hero section is far taller than it is
          wide (stacked cards), so object-cover would over-zoom the 16:9 footage
          to a tiny slice on mobile. Cap the video to the viewport height there;
          at lg+ it stretches across the whole section as before. */}
      <div className="absolute inset-x-0 top-0 h-screen supports-[height:100svh]:h-[100svh] overflow-hidden lg:inset-0 lg:h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,12,.92)_0%,rgba(8,10,12,.75)_45%,rgba(8,10,12,.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,10,12,.98)_0%,transparent_40%)]" />
      </div>

      {/* Follow Us sidebar */}
      <div className="absolute bottom-10 left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex">
        <span className="origin-center -rotate-90 text-[11px] tracking-[0.25em] text-white/50">
          Follow Us
        </span>
        <div className="mt-8 flex flex-col gap-5 text-white/60">
          <a href={site.social.instagram} {...socialTarget(site.social.instagram)} aria-label="Instagram" className="transition duration-300 hover:scale-110 hover:text-white">
            <InstagramIcon size={21} />
          </a>
          <a href={site.social.youtube} {...socialTarget(site.social.youtube)} aria-label="YouTube" className="transition duration-300 hover:scale-110 hover:text-white">
            <YoutubeIcon size={21} />
          </a>
          <a href={site.social.facebook} {...socialTarget(site.social.facebook)} aria-label="Facebook" className="transition duration-300 hover:scale-110 hover:text-white">
            <FacebookIcon size={21} />
          </a>
          <a href={site.social.tiktok} {...socialTarget(site.social.tiktok)} aria-label="TikTok" className="transition duration-300 hover:scale-110 hover:text-white">
            <TiktokIcon size={21} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pt-32 lg:px-[8%] lg:pt-40">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >

          <div className="mb-6 inline-flex rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-[10px] tracking-[0.15em] text-white/85 backdrop-blur-xl">
            CAPTURING MOMENTS. CREATING STORIES.
          </div>

          <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl lg:text-[76px]">
            Visuals That
            <br />
            Speak Forever.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
            We are a creative photography and videography
            studio passionate about capturing real moments
            and turning them into timeless stories.
          </p>

          <div className="mt-7 flex flex-row flex-wrap items-center gap-3">
            <Link
              to="/work"
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
              className="group flex items-center justify-center gap-2 rounded-xl bg-white py-2 pl-4 pr-2 text-[13px] font-semibold text-black transition hover:-translate-y-0.5"
            >
              <span style={{ color: "#000000", whiteSpace: "nowrap" }}>View Our Work</span>
              <span
                style={{ color: "#000000", backgroundColor: "rgba(0,0,0,0.08)" }}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
              >
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>

            <Link
              to="/services"
              className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 py-2 pl-5 pr-2 text-[13px] font-medium text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Our Services
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                <Camera size={15} />
              </span>
            </Link>
          </div>

        </motion.div>

        {/* Showreel -> routes to Reels page */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute right-[7%] top-[34%] hidden lg:block"
        >
          <Link
            to="/work/reels"
            className="group flex flex-col items-center gap-3"
          >
          <span className="text-[11px] font-medium tracking-[0.3em] text-white/70 drop-shadow-lg">
            PLAY
          </span>

          <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-white/40 bg-white/10 shadow-[0_8px_40px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl transition duration-500 group-hover:scale-110 group-hover:bg-white/20 group-hover:shadow-[0_8px_60px_rgba(255,255,255,0.25)]">
            {/* Glossy highlight */}
            <div className="pointer-events-none absolute inset-x-4 top-1.5 h-8 rounded-[100%] bg-white/25 blur-md" />
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,transparent_45%,transparent_60%,rgba(255,255,255,0.08)_100%)]" />
            <Play
              size={28}
              fill="currentColor"
              className="relative text-white drop-shadow-lg"
            />
          </div>

          <span className="text-[11px] font-medium tracking-[0.3em] text-white/70 drop-shadow-lg">
            SHOWREEL
          </span>
          </Link>
        </motion.div>

      </div>

      {/* Bottom cards + stats */}
      <div className="relative z-20 mx-6 mb-10 mt-10 grid gap-4 md:grid-cols-2 lg:mx-[5%] lg:grid-cols-4">

        <GlassCard
          icon={Camera}
          title="Photography"
          description="Timeless portraits, vibrant events, lifestyle stories and brand campaigns — shot with intentional light, direction and real emotion."
          highlights={["Portraits", "Events", "Brands"]}
        />

        <GlassCard
          icon={Video}
          title="Videography"
          description="Cinematic films for concerts, nightlife, weddings and commercials — capturing energy, atmosphere and authentic moments in stunning 4K."
          highlights={["Concerts", "Weddings", "Commercials"]}
        />

        <GlassCard
          icon={Wand2}
          title="Editing"
          description="Cinematic color grading, clean sound design and sharp pacing — polished edits built to captivate on socials, screens and cinema."
          highlights={["Grading", "Sound", "Reels"]}
        />

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl">
          {/* Glass gloss */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_100%)]" />
          <div className="relative">
            <h3 className="text-3xl font-semibold text-white">120+</h3>
            <p className="mt-1 text-xs font-medium leading-5 text-white/70">Projects Completed</p>
            <p className="mt-1 text-[11px] leading-4 text-white/45">Weddings, concerts, lifestyle shoots & celebrity features delivered.</p>
          </div>
          <div className="relative mt-4 border-t border-white/10 pt-4">
            <h3 className="text-3xl font-semibold text-white">98%</h3>
            <p className="mt-1 text-xs font-medium leading-5 text-white/70">Client Satisfaction</p>
            <p className="mt-1 text-[11px] leading-4 text-white/45">Rated for creativity, fast delivery & an unforgettable shoot experience.</p>
          </div>
          <div className="relative mt-4 flex h-10 items-end justify-end gap-1">
            <div className="w-1.5 rounded-t bg-white/30" style={{ height: '40%' }} />
            <div className="w-1.5 rounded-t bg-white/50" style={{ height: '65%' }} />
            <div className="w-1.5 rounded-t bg-white/80" style={{ height: '85%' }} />
            <div className="w-1.5 rounded-t bg-white" style={{ height: '100%' }} />
          </div>
        </div>

      </div>

    </section>
  );
}

/* Glass Card */
function GlassCard({
  icon: Icon,
  title,
  description,
  highlights = [],
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl"
    >
      {/* Top gloss sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />
      {/* Diagonal shine */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.09)_0%,transparent_35%)]" />
      <div className="relative mb-6 grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
        <Icon size={19} className="text-white" />
      </div>

      <h3 className="relative text-base font-semibold text-white">
        {title}
      </h3>

      <p className="relative mt-2 max-w-xs text-xs leading-5 text-white/60">
        {description}
      </p>

      {highlights.length > 0 && (
        <div className="relative mb-8 mt-4 flex flex-wrap gap-2">
          {highlights.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-white/75 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {!highlights.length && <div className="relative mb-8" />}

      <ArrowRight
        size={16}
        className="absolute bottom-5 right-5 text-white/40 transition group-hover:translate-x-1 group-hover:text-white"
      />
    </motion.div>
  );
}
