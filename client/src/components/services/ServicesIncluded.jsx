import { motion } from "framer-motion";
import { Clock, Film, Images, Music, PackageCheck, Share2 } from "lucide-react";
import { fadeUp } from "./ServicesWorkflow";

const included = [
  { icon: Film, title: "4K masters", text: "High-resolution finals, ready for any screen.", meta: "Every booking" },
  { icon: Share2, title: "Social cuts", text: "Vertical edits sized for Reels, TikTok and Shorts.", meta: "9:16 included" },
  { icon: Music, title: "Licensed audio", text: "Properly licensed music so posts never get muted.", meta: "Cleared tracks" },
  { icon: Images, title: "Private gallery", text: "A clean gallery to view, pick and share.", meta: "48h delivery" },
  { icon: Clock, title: "Fast turnaround", text: "Preview highlights in days, not weeks.", meta: "72h previews" },
  { icon: PackageCheck, title: "Revisions", text: "Structured rounds until the cut feels right.", meta: "2 rounds incl." },
];

export function IncludedCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {included.map((item, i) => (
        <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.6, delay: (i % 3) * 0.08 }} whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
          {/* soft top glow */}
          <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full bg-white/[0.07] blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
          <div className="relative mb-6 flex items-start justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80"><item.icon size={19} /></div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">{item.meta}</span>
          </div>
          <h3 className="relative text-base font-semibold text-white">{item.title}</h3>
          <p className="relative mt-1.5 pr-8 text-sm leading-6 text-white/50">{item.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
