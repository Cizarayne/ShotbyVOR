// HomePage.jsx
import Section from "../components/Section";

const featuredProjects = [
  "Cinematic wedding films with intimate storytelling",
  "Commercial reels for fashion and lifestyle brands",
  "Music videos with bold motion and color grading",
];

export default function HomePage() {
  return (
    // ADJUSTED: Switched 'h-screen' to 'min-h-screen sm:h-screen' so smaller screens like iPhone SE can scroll safely
    <div className="min-h-screen sm:h-screen w-full relative overflow-x-hidden flex flex-col justify-end lg:justify-center p-5 sm:p-12 lg:p-20 xl:p-24 pt-28 sm:pt-32 lg:pt-20 pb-8 sm:pb-12">
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
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-black/30" />

      {/* Text Content */}
      <div className="font-fjorden relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-5 sm:gap-8 lg:gap-10">
        <Section
          subtitle="Videography Portfolio"
          title="Crafting cinematic stories for bold brands and unforgettable moments."
          accent
        >
          <p className="font-serif text-white/80 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed mt-2 sm:mt-4">
            ShotbyVOR brings a sharp eye for movement, light, and emotion into
            every frame. From weddings to campaigns, each film is shaped to feel
            powerful, polished, and personal.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 sm:gap-4 pt-4 sm:pt-6">
            <a
              href="/projects"
              className="font-serif px-4 py-2 sm:px-6 sm:py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-full transition hover:bg-violet-100 hover:text-violet-700 hover:scale-105"
            >
              Explore Projects
            </a>
            <a
              href="/highlights"
              className="font-serif px-4 py-2 sm:px-6 sm:py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-full transition hover:bg-violet-100 hover:text-violet-700 hover:scale-105"
            >
              Explore Highlights
            </a>
            <a
              href="/contact"
              className="font-serif px-4 py-2 sm:px-6 sm:py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-full transition hover:bg-violet-100 hover:text-violet-700 hover:scale-105"
            >
              Let&apos;s Connect
            </a>
          </div>
        </Section>

        {/* Separator Line */}
        <hr className="border-white/10 w-full" />

        {/* Featured Projects Sub-Section */}
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-violet-400 block mb-2 sm:mb-3">
            Featured Work — What I create
          </span>
          <ul className="font-serif grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-6 text-white/90 text-xs sm:text-sm">
            {featuredProjects.map((item, index) => (
              <li
                key={index}
                className="flex gap-2.5 items-start bg-black/30 p-3 sm:p-4 rounded-xl border border-white/5"
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