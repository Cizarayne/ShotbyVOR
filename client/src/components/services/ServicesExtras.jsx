import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket, Sparkles } from "lucide-react";
import { fadeUp } from "./ServicesWorkflow";
import { WorkflowCards } from "./ServicesWorkflow";
import { IncludedCards } from "./ServicesIncluded";

const stats = [
  { value: "100+", label: "Events Captured" },
  { value: "50+", label: "Happy Clients" },
  { value: "4K", label: "Cinematic Quality" },
];

export default function ServicesExtras() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
      <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl pb-14 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#7D838C]">How we work</p>
        <h2 className="mb-5 font-serif text-4xl leading-[1.1] tracking-tight text-[#F5F5F5] sm:text-5xl">From first call<br />to final cut.</h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#A7AAB2] sm:text-lg">Every booking follows the same calm, proven flow — so you always know what happens next and what everything costs.</p>
      </motion.div>
      <WorkflowCards />
      <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mt-4 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center shadow-2xl backdrop-blur-2xl sm:px-10">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-xs">{s.label}</p>
          </div>
        ))}
      </motion.div>
      <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl pb-10 pt-20 text-center">
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#7D838C]"><Sparkles size={14} /> What&apos;s included</p>
        <h2 className="mb-5 font-serif text-4xl leading-[1.1] tracking-tight text-[#F5F5F5] sm:text-5xl">Everything handled,<br />nothing surprising.</h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#A7AAB2] sm:text-lg">No hidden fees, no confusing packages. Every booking comes with the essentials covered — the same six, every time.</p>
      </motion.div>
      <IncludedCards />
      <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[28rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/80"><Rocket size={20} /></div>
        <h2 className="relative mx-auto mt-6 max-w-xl font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl">Have something worth shooting?</h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-white/50 sm:text-base">Dates fill fast around events season. Lock yours in with one message.</p>
        <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contact-us" style={{ backgroundColor: "#ffffff", color: "#000000" }} className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5">
            <span style={{ color: "#000000" }}>Book a date</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/work" className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10">See the work</Link>
        </div>
      </motion.div>
    </div>
  );
}
