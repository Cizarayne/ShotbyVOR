import { motion } from "framer-motion";
import { CalendarCheck, Clapperboard, Film, PenTool } from "lucide-react";

export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const payoff = {
  "Say hello": "Best for: first-timers who want a fast yes or no.",
  "Plan & scout": "Best for: packed timelines and tricky venues.",
  "Shoot day": "Best for: crowds that hate being staged.",
  "Edit & grade": "Best for: feeds that need to look expensive.",
};

export const workflow = [
  { icon: CalendarCheck, step: "01", title: "Say hello", text: "Tell us the date, venue and vibe. Fast reply with availability and a clear quote." },
  { icon: Clapperboard, step: "02", title: "Plan & scout", text: "Shot list, timelines and lighting locked in before the day. Nothing left to chance." },
  { icon: Film, step: "03", title: "Shoot day", text: "A calm crew that blends in and captures energy without staging it." },
  { icon: PenTool, step: "04", title: "Edit & grade", text: "Cinematic cut, color and sound polish. You review, we refine, then deliver." },
];

export function WorkflowCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {workflow.map((item, i) => (
        <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="mb-8 flex items-start justify-between">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80"><item.icon size={19} /></div>
            <span className="font-mono text-xs tracking-widest text-white/30">{item.step}</span>
          </div>
          <h3 className="font-serif text-2xl text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/50">{item.text}</p>
          <p className="mt-4 border-t border-white/10 pt-3 text-xs font-medium uppercase tracking-[0.12em] text-white/35">{payoff[item.title]}</p>
        </motion.div>
      ))}
    </div>
  );
}
