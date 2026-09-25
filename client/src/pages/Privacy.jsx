import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "../lib/useSEO";

export default function Privacy() {
  useSEO({
    title: "Privacy Policy",
    description: "SHOTBYVOR privacy policy — how contact information is used and how anonymous viewing statistics work.",
    path: "/privacy",
  });
  return (
    <section className="relative min-h-screen bg-[#080a0c] px-6 pb-24 pt-32 sm:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-3xl"
      >
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Back home
        </Link>
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          ShotbyVOR — Privacy Policy
        </p>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-white/60">
          <p>
            ShotbyVOR respects your privacy. This page explains in plain terms
            what information is collected on this site and how it is used.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">
            Information you share
          </h2>
          <p>
            When you contact the studio through the contact form, you provide
            your name, email address, and message so bookings and enquiries can
            be answered. That information is used only to respond to you and is
            never sold or shared with third parties for marketing.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">
            Anonymous viewing statistics
          </h2>
          <p>
            Portfolio pages keep a simple, anonymous count of how many times a
            photo, reel, highlight, or journal has been viewed. No personal
            data, cookies for tracking, or device fingerprints are attached to
            these counts.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">Media & embeds</h2>
          <p>
            Photos and videos shown here are original studio work. External
            social links (Instagram, YouTube, Facebook, TikTok) open the
            respective platforms, which apply their own privacy policies once
            you leave this site.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">Your rights</h2>
          <p>
            You may ask at any time for your contact messages to be corrected
            or deleted. To do so, simply reply to any studio email or send a
            new message through the contact page.
          </p>
          <p className="pt-4 text-white/35">
            Last updated {new Date().getFullYear()} — SHOTBYVOR.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
