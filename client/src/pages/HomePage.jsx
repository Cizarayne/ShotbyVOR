import Section from "../components/Section";

const featuredProjects = [
  "Cinematic wedding films with intimate storytelling",
  "Commercial reels for fashion and lifestyle brands",
  "Music videos with bold motion and color grading",
];

export default function HomePage() {
  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col justify-end lg:justify-center p-6 sm:p-12 lg:p-20 xl:p-24">
      {/* Background Video Layer */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Ambient Cinematic Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/45 to-black/20" />

      {/* Text Content */}
      <div className="font-fjorden relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-10">
        <Section
          subtitle="Videography Portfolio"
          title="Crafting cinematic stories for bold brands and unforgettable moments."
          accent
        >
          <p className="font-serif text-white/80 max-w-2xl text-base sm:text-lg leading-relaxed mt-4">
            ShotbyVOR brings a sharp eye for movement, light, and emotion into
            every frame. From weddings to campaigns, each film is shaped to feel
            powerful, polished, and personal.
          </p>
          <div className="flex flex-wrap gap-4 pt-6">
            <a
              href="/projects"
              className="font-serif px-6 py-2.5 bg-white text-black font-semibold rounded-full transition hover:bg-violet-100 hover:text-violet-700 hover:scale-105"
            >
              Explore Projects
            </a>
            <a
              href="/highlights"
              className="font-serif px-6 py-2.5 bg-white text-black font-semibold rounded-full transition hover:bg-violet-100 hover:text-violet-700 hover:scale-105"
            >
              Explore Highlights
            </a>
            <a
              href="/contact"
              className="font-serif px-6 py-2.5 bg-white text-black font-semibold rounded-full transition hover:bg-violet-100 hover:text-violet-700 hover:scale-105"
            >
              Let&apos;s Connect
            </a>
          </div>
        </Section>

        {/* Separator Line */}
        <hr className="border-white/10 w-full" />

        {/* Featured Projects Sub-Section */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 block mb-3">
            Featured Work — What I create
          </span>
          <ul className="font-serif grid sm:grid-cols-3 gap-6 text-white/90 text-md">
            {featuredProjects.map((item, index) => (
              <li
                key={index}
                className="flex gap-3 items-start bg-black/20 p-4 rounded-xl border border-white/5"
              >
                <span className="text-violet-400 font-bold">0{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
