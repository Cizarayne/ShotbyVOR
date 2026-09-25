import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "../lib/useSEO";

export default function Terms() {
  useSEO({
    title: "Terms of Use",
    description: "SHOTBYVOR terms of use — content ownership, bookings and acceptable use of this portfolio site.",
    path: "/terms",
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
          ShotbyVOR — Terms of Use
        </p>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">
          Terms of Use
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-white/60">
          <p>
            By browsing this portfolio you agree to the simple terms below.
            They exist to protect the studio&apos;s creative work and to keep
            bookings fair for everyone.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">
            Ownership of content
          </h2>
          <p>
            All photographs, films, reels, text, and designs on this site are
            the property of ShotbyVOR unless credited otherwise. You may share
            links to the work, but you may not download, reproduce, edit, or
            use the media commercially without written permission.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">
            Bookings & services
          </h2>
          <p>
            Enquiries made through the contact page are not confirmed bookings
            until dates, deliverables, and pricing are agreed in writing with
            the studio. Any deposits, cancellation terms, or usage licences
            will be stated in that agreement.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">
            Acceptable use
          </h2>
          <p>
            Please do not misuse the contact form, attempt to disrupt the site,
            scrape the portfolio at scale, or misrepresent the studio&apos;s
            work as your own.
          </p>
          <h2 className="pt-2 font-serif text-xl text-white">Changes</h2>
          <p>
            These terms may be updated as the studio grows. Continued use of
            the site after changes means you accept the current version.
          </p>
          <p className="pt-4 text-white/35">
            Last updated {new Date().getFullYear()} — SHOTBYVOR.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
