import { motion } from "framer-motion";
import ServicesSection from "../components/services/ServicesSection";
import ServicesExtras from "../components/services/ServicesExtras";
import { useSEO } from "../lib/useSEO";

export default function Services() {
  useSEO({
    title: "Services — Photography, Videography & Production",
    description:
      "SHOTBYVOR services — photography, videography, commercial production, live events and professional post-production built to be seen.",
    path: "/services",
  });
  return (
    <section className="relative min-h-screen overflow-x-clip bg-[#080a0c]">
      {/* PAGE BACKGROUND — same film-equipment image as About page */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Dark scrims keep text + cards readable over the photo */}
      <div className="pointer-events-none absolute inset-0 bg-[#080a0c]/78" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#080a0c] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#080a0c] to-transparent" aria-hidden="true" />
      {/* Background blur effects */}
      <div className="pointer-events-none absolute -right-40 top-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl" />

      {/* Section Header — full-width banner like About page heading */}
      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full overflow-hidden border-y border-white/10"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/services-heading.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/90 via-[#080a0c]/65 to-[#080a0c]/30" />
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-4xl space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                What We Do - ShotbyVOR
              </p>
              <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
                Creative work,{" "}
                <span className="italic text-white/90">built to be seen</span>.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                From photography to videography, commercial production to live
                events, and professional post-production — we create visual
                experiences that connect, inspire, and endure.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stacking Cards Section — untouched, original 5 solid cards */}
      <div className="relative z-10 pb-24 pt-16 lg:pt-24">
        <ServicesSection />
      </div>

      {/* Extra context — glassmorphic cards only, below the stack */}
      <div className="relative z-10 pb-24">
        <ServicesExtras />
      </div>

      {/* Bottom Spacing */}
      <div className="h-32" />
    </section>
  );
}
