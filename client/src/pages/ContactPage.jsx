import { useEffect, useRef, useState } from "react";
import SocialMediaWidget from "../components/Social/SocialMediaWidget";

const PHONE = "+2348106971871";

function DialUp() {
  const [displayed, setDisplayed] = useState(PHONE.replace(/\d/g, "•"));
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const started = useRef(false);

  function runAnimation() {
    const digits = PHONE.split("");
    const total = digits.length;
    let step = 0;

    // Reveal one digit every 120ms, scramble unrevealed ones every 40ms
    const scramble = setInterval(() => {
      setDisplayed(
        digits
          .map((ch, i) => {
            if (i < step) return ch; // already locked
            if (!/\d/.test(ch)) return ch; // keep +, spaces etc.
            return String(Math.floor(Math.random() * 10)); // scramble
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
      className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-xl p-6 hover:bg-white/10 transition group"
    >
      <div className="w-12 h-12 bg-violet-600/20 rounded-full flex items-center justify-center group-hover:bg-violet-600/30 transition shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          className="text-violet-400"
          viewBox="0 0 16 16"
        >
          <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z" />
        </svg>
      </div>
      <div>
        <p className="text-white font-semibold mb-0.5">Phone</p>
        <p
          className={`text-sm font-mono tracking-wider transition-colors duration-300 ${
            done ? "text-violet-300" : "text-gray-400"
          }`}
        >
          {displayed}
        </p>
      </div>
    </a>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({
    type: null,
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    const BOT_TOKEN = "8869859534:AAHzbpp-aftAR5UQPjbH-UWulgWYRbmqNHA";
    const CHAT_ID = "5612504867";

    const message = `
📩 New Contact Form Submission

👤 Name: ${formData.firstName} ${formData.lastName}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone || "Not provided"}

💬 Message:
${formData.message}
    `.trim();

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://p0.piqsels.com/preview/896/703/717/adult-man-outdoor-young.jpg')",
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="space-y-6">
            <p className="text-violet-400 font-medium tracking-widest uppercase text-sm">
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Let's Create Something{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-purple-400">
                Unforgettable
              </span>
            </h1>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 md:px-12 pb-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  Whether you're planning an exclusive nightlife event, a
                  lifestyle campaign, a celebrity appearance, or a brand
                  production, we'd love to hear your vision.
                </p>

                <p>
                  Every great project starts with a conversation. Tell us about
                  your idea, event, or collaboration, and we'll work with you to
                  turn it into cinematic visuals that leave a lasting impact.
                </p>

                <p className="text-violet-300 font-medium">
                  No project is too ambitious. If it matters to you, it matters
                  to us.
                </p>
              </div>

              {/* Services List */}
              <div className="bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  We Can Help With
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Nightlife Events",
                    "Lifestyle Content",
                    "Celebrity Coverage",
                    "Brand & Commercial Shoots",
                    "Music Videos",
                    "Private Events",
                    "Social Media Content",
                    "Creative Collaborations",
                  ].map((service, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-violet-400 rounded-full shrink-0" />
                      <span className="text-gray-300 text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagline */}
              <div className="bg-linear-to-r from-violet-600/20 to-purple-600/20 backdrop-blur-sm border border-violet-500/40 rounded-2xl p-6">
                <p className="text-lg text-white font-medium text-center">
                  Let's capture moments that people won't just watch they'll
                  remember.
                </p>
              </div>
            </div>

            {/* Right Column - Contact Form & Info */}
            <div className="space-y-6">
              {/* Contact Form */}
              <div className="bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Send Us a Message
                </h3>
                {status.message && (
                  <div
                    className={`mb-4 p-4 rounded-xl ${
                      status.type === "success"
                        ? "bg-green-500/20 border border-green-500/30 text-green-300"
                        : "bg-red-500/20 border border-red-500/30 text-red-300"
                    }`}
                  >
                    {status.message}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4 text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        required
                        className="w-full px-4 py-3 bg-slate-900/50 border border-violet-500/20 rounded-xl placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        required
                        className="w-full px-4 py-3 bg-slate-900/50 border border-violet-500/20 rounded-xl placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email address"
                        required
                        className="w-full px-4 py-3 bg-slate-900/50 border border-violet-500/20 rounded-xl placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-violet-500/20 rounded-xl placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Leave us a message"
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-violet-500/20 rounded-xl placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <a
                  href="mailto:soundslikevor@gmail.com"
                  className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-xl p-6 hover:bg-white/10 transition group"
                >
                  <div className="w-12 h-12 bg-violet-600/20 rounded-full flex items-center justify-center group-hover:bg-violet-600/30 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="text-violet-400"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.71-2.903L1 5.383z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400 text-sm">
                      soundslikevor@gmail.com
                    </p>
                  </div>
                </a>

                <DialUp />
              </div>

              {/* Social Media Widget */}
              <SocialMediaWidget />
            </div>
          </div>
        </section>

        {/* Decorative Elements */}
        <div className="absolute top-40 right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
