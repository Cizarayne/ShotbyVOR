import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clapperboard, Sparkles, Heart, Eye, Film, MoonStar, Users, BadgeCheck, Quote } from "lucide-react";
import { useSEO } from "../lib/useSEO";

const stats = [
  { value: "100+", label: "Events Captured" },
  { value: "50+", label: "Happy Clients" },
  { value: "4K", label: "Cinematic Quality" },
];

const philosophy = [
  { icon: Clapperboard, title: "Cinematic composition", text: "Careful pacing, framing and movement in every cut." },
  { icon: Sparkles, title: "Immersive storytelling", text: "Narratives with identity, not just pretty footage." },
  { icon: MoonStar, title: "Nightlife & lifestyle energy", text: "We live where the city pulses and culture moves." },
  { icon: Users, title: "Celebrity & event coverage", text: "Trusted around influential personalities and sold-out rooms." },
  { icon: BadgeCheck, title: "Timeless, authentic visuals", text: "No gimmicks. Work that still hits years from now." },
];

const pillars = [
  { icon: Eye, title: "Atmosphere", text: "Light, texture, crowd, sound - we build worlds you can feel through the screen." },
  { icon: Film, title: "Clarity", text: "Clean framing and intentional edits. Every shot earns its place." },
  { icon: Heart, title: "Emotion", text: "The glance, the roar, the quiet second before it happens. That is the story." },
];

export default function AboutUs() {
  useSEO({
    title: "About Us — The Studio Behind the Lens",
    description:
      "Meet SHOTBYVOR — a creative photography and videography studio capturing energy, preserving moments and creating stories that live forever.",
    path: "/about-us",
  });
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080a0c]">
      {/* PAGE BACKGROUND — film equipment (local copy of the wallpaperflare image) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[#080a0c]/78" />
      <div className="pointer-events-none absolute -right-40 top-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl" />
      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32">
        {/* HEADING — fixed to the full width of the screen */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative w-full overflow-hidden border-y border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/about-heading.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/90 via-[#080a0c]/65 to-[#080a0c]/30" />
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="max-w-4xl space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">Our Story - ShotbyVOR</p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            A videographer focused on <span className="italic text-white/90">atmosphere</span>, <span className="italic text-white/90">clarity</span>, and <span className="italic text-white/90">emotion</span>.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60 sm:text-lg">From the electric pulse of the city's nightlife to intimate lifestyle stories and celebrity moments - we preserve energy, emotion, and everything in between.</p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Link to="/work" style={{ backgroundColor: "#ffffff", color: "#000000" }} className="group flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5"><span style={{ color: "#000000" }}>View Our Work</span><ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
            <Link to="/contact-us" className="flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10">Book a Shoot</Link>
          </div>
          </div>
          </div>
        </motion.div>
        <div className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-14 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl backdrop-blur-2xl sm:p-8">
              <div className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">{s.value}</div>
              <div className="mt-2 text-xs tracking-wide text-white/50 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </motion.div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl sm:p-10">
              <h2 className="font-serif text-3xl text-white sm:text-4xl">About ShotbyVOR</h2>
              <div className="mt-8 space-y-6 leading-7 text-white/60">
                <p className="border-l-2 border-white/25 pl-6 font-serif text-xl italic leading-8 text-white/85"><Quote size={18} className="mb-2 text-white/30" />Every frame has a heartbeat. Every moment deserves to be remembered.</p>
                <p>At ShotbyVOR, we believe videography is more than recording events - it is about preserving emotion, energy, and the stories that unfold between the moments people notice. From the electric pulse of the city's nightlife to the authenticity of everyday lifestyles and the spotlight surrounding celebrities, we capture visuals that leave a lasting impression.</p>
                <p>Our lens follows movement, emotion, and atmosphere. Whether it is the excitement of a sold-out event, the elegance of a luxury lifestyle shoot, or the presence of influential personalities, we create cinematic content that feels immersive, timeless, and authentic.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl sm:p-10">
              <div className="space-y-6 leading-7 text-white/60">
                <p>Driven by creativity, precision, and a passion for storytelling, ShotbyVOR transforms ordinary scenes into unforgettable visual experiences. Every project is approached with fresh ideas, professional craftsmanship, and an eye for the details that make each story unique.</p>
                <p className="font-serif text-xl italic text-white sm:text-2xl">Because the best stories are not just watched - they are felt.</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl sm:p-10">
              <h3 className="text-lg font-semibold text-white">Our Philosophy</h3>
              <ul className="mt-6 space-y-3">
                {philosophy.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 rounded-xl border border-transparent p-3 transition hover:border-white/10 hover:bg-white/5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80"><item.icon size={19} /></div>
                    <div><p className="text-sm font-semibold text-white">{item.title}</p><p className="mt-1 text-xs leading-5 text-white/50">{item.text}</p></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-2xl sm:p-10">
              <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
              <p className="relative font-serif text-3xl font-semibold tracking-tight text-white">ShotbyVOR</p>
              <p className="relative mx-auto mt-4 max-w-md leading-7 text-white/60">Capturing the energy. Preserving the moment. <span className="text-white">Creating stories that live forever.</span></p>
              <Link to="/contact-us" style={{ backgroundColor: "#ffffff", color: "#000000" }} className="group relative mx-auto mt-7 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5"><span style={{ color: "#000000" }}>Let us Create Together</span><ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-6 grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <motion.div key={p.title} whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="mb-10 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5"><p.icon size={19} className="text-white/80" /></div>
              <h3 className="font-serif text-2xl text-white">{p.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/50">{p.text}</p>
              <ArrowRight size={16} className="absolute bottom-6 right-6 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
            </motion.div>
          ))}
        </motion.div>
        </div>
      </div>
    </section>
  );
}
