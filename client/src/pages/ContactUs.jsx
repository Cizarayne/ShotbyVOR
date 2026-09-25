import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SocialMediaWidget from "../components/Social/SocialMediaWidget";
import { useSEO } from "../lib/useSEO";

const PHONE = "+2348106971871";
const EMAIL = "soundslikevor@gmail.com";

/* ==========================================================
   DIAL UP — animated phone number reveal
========================================================== */

function DialUp() {
  const [displayed, setDisplayed] = useState(PHONE.replace(/\d/g, "\u2022"));
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const started = useRef(false);

  function runAnimation() {
    const digits = PHONE.split("");
    const total = digits.length;
    let step = 0;

    const scramble = setInterval(() => {
      setDisplayed(
        digits
          .map((ch, i) => {
            if (i < step) return ch;
            if (!/\d/.test(ch)) return ch;
            return String(Math.floor(Math.random() * 10));
          })
          .join(""),
      );
    }, 40);

    const reveal = setInterval(() => {
      step++;
      if (step >= total) {
        clearInterval(scramble);
        clearInterval(reveal);
        setDisplayed(PHONE);
        setDone(true);
      }
    }, 120);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          runAnimation();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={ref}
      href={`tel:${PHONE}`}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition group-hover:bg-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="text-white/70"
          viewBox="0 0 16 16"
        >
          <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z" />
        </svg>
      </div>

      <div>
        <p className="font-semibold text-white">Phone</p>
        <p
          className={`font-mono text-sm tracking-wider transition-colors duration-300 ${
            done ? "text-white" : "text-white/40"
          }`}
        >
          {displayed}
        </p>
      </div>
    </a>
  );
}

/* ==========================================================
   CONTACT PAGE
========================================================== */

export default function ContactUs() {
  useSEO({
    title: "Contact Us — Book a Shoot",
    description:
      "Book SHOTBYVOR for your next shoot — weddings, events, concerts, portraits and commercials. Send a message and let's create together.",
    path: "/contact-us",
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const formRef = useRef(null);
  const submittedRef = useRef(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setIsLoading(true);
    submittedRef.current = true;
    // Native submit into the hidden iframe (bypasses onSubmit, so no loop)
    formRef.current?.submit();
  };

  // FormSubmit.io answers inside the hidden iframe with its "Thank You" page,
  // which fires this load event — the page itself never navigates away.
  const handleFrameLoad = () => {
    if (!submittedRef.current) return;
    submittedRef.current = false;
    setIsLoading(false);
    setStatus({
      type: "success",
      message: "Message sent successfully! We'll get back to you soon.",
    });
    setFormData({
      fullName: "",
      email: "",
      message: "",
    });
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20";

  const labelClass = "mb-2 block text-sm font-medium text-white/50";

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080a0c]">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-white/3 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-40 h-72 w-72 rounded-full bg-white/2 blur-3xl" />

      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32">
        {/* HEADING — with background image like About page */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full overflow-hidden border-y border-white/10"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/contact-heading.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0c]/90 via-[#080a0c]/65 to-[#080a0c]/30" />
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-4xl space-y-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Let's Create
              </p>

              <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
                Let's Create Something{" "}
                <span className="italic text-white/90">Unforgettable</span>
              </h1>

              <p className="max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                Whether you're planning an exclusive nightlife event, a
                lifestyle campaign, a celebrity appearance, or a brand
                production — we'd love to hear your vision.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-20 pt-14 sm:px-8 lg:px-12">
          {/* ===========================================
              MAIN GRID
          ============================================ */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* ---------------- LEFT COLUMN ---------------- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Additional info */}
              <div className="space-y-6 leading-relaxed text-white/45">
                <p>
                  Every great project starts with a conversation. Tell us about
                  your idea, event, or collaboration, and we'll work with you to
                  turn it into cinematic visuals that leave a lasting impact.
                </p>

                <p className="font-medium text-white/70">
                  No project is too ambitious. If it matters to you, it matters
                  to us.
                </p>
              </div>

              {/* Services list */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="mb-6 text-xl font-bold text-white">
                  We Can Help With
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    "Nightlife Events",
                    "Lifestyle Content",
                    "Celebrity Coverage",
                    "Brand & Commercial Shoots",
                    "Music Videos",
                    "Private Events",
                    "Social Media Content",
                    "Creative Collaborations",
                  ].map((service) => (
                    <div key={service} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                      <span className="text-sm text-white/45">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagline */}
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-xl">
                <p className="text-center text-lg font-medium text-white">
                  Let's capture moments that people won't just watch — they'll
                  remember.
                </p>
              </div>
            </motion.div>

            {/* ---------------- RIGHT COLUMN ---------------- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contact Form */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h3 className="mb-6 text-2xl font-bold text-white">
                  Send Us a Message
                </h3>

                {status.message && (
                  <div
                    className={`mb-4 rounded-xl p-4 text-sm ${
                      status.type === "success"
                        ? "border border-white/15 bg-white/10 text-white/80"
                        : "border border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  action={`https://formsubmit.io/send/${EMAIL}`}
                  method="POST"
                  target="formsubmit-iframe"
                  className="space-y-4"
                >
                  {/* FormSubmit honeypot — must stay empty (rejects bots) */}
                  <input
                    type="text"
                    name="_formsubmit_id"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
                  <input
                    type="hidden"
                    name="_subject"
                    value="New Contact Form Submission — ShotbyVOR"
                  />

                  {/* Full Name */}
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Leave us a message"
                      required
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send Message"}

                    {!isLoading && (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                {/* Hidden target so FormSubmit posts without leaving the page */}
                <iframe
                  name="formsubmit-iframe"
                  title="Form submission"
                  className="hidden"
                  onLoad={handleFrameLoad}
                />
              </div>

              {/* Email card */}
              <a
                href={`mailto:${EMAIL}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition group-hover:bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    className="text-white/70"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.71-2.903L1 5.383z" />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p className="text-sm text-white/40">{EMAIL}</p>
                </div>
              </a>

              {/* Phone card */}
              <DialUp />

              {/* Social Media Widget */}
              <SocialMediaWidget />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
