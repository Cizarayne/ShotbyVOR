import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSEO } from "../lib/useSEO";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  useSEO({
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist. Explore SHOTBYVOR's photography and videography portfolio.",
    noindex: true,
  });
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080a0c] px-6">
      <div className="pointer-events-none absolute -right-40 top-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-white/[0.02] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl text-center"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">
          ShotbyVOR
        </p>
        <h1 className="mt-4 font-serif text-8xl font-bold leading-none tracking-tight text-white sm:text-9xl">
          404
        </h1>
        <p className="mt-4 font-serif text-2xl text-white/85">
          This frame didn&apos;t make the cut.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
          The page you&apos;re looking for was moved, renamed, or never
          existed. Let&apos;s get you back to the good stuff.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            style={{ backgroundColor: "#ffffff", color: "#000000" }}
            className="group flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span style={{ color: "#000000" }}>Back Home</span>
          </Link>
          <Link
            to="/work"
            className="group flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            View Our Work
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
