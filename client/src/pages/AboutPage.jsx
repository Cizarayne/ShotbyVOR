export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background image from wallpaperflare */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://c0.wallpaperflare.com/preview/707/632/24/film-equipment-tripods-slider-techlife.jpg')",
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-950/75" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="space-y-6">
            <p className="text-violet-400 font-medium tracking-widest uppercase text-sm">
              About
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              A videographer focused on{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-purple-400">
                atmosphere
              </span>
              ,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-purple-400">
                clarity
              </span>
              , and{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-purple-400">
                emotion
              </span>
              .
            </h1>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-6 md:px-12 pb-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Story */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-8 md:p-10">
                <h2 className="text-3xl font-bold text-white mb-6">
                  About ShotbyVOR
                </h2>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-xl text-violet-300 font-light italic border-l-4 border-violet-500 pl-6">
                    Every frame has a heartbeat. Every moment deserves to be
                    remembered.
                  </p>

                  <p>
                    At ShotbyVOR, we believe videography is more than recording
                    events it's about preserving emotion, energy, and the
                    stories that unfold between the moments people notice. From
                    the electric pulse of the city's nightlife to the
                    authenticity of everyday lifestyles and the spotlight
                    surrounding celebrities, we capture visuals that leave a
                    lasting impression.
                  </p>

                  <p>
                    Our lens follows movement, emotion, and atmosphere. Whether
                    it's the excitement of a sold-out event, the elegance of a
                    luxury lifestyle shoot, or the presence of influential
                    personalities, we create cinematic content that feels
                    immersive, timeless, and authentic.
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-br from-violet-900/40 to-purple-900/40 backdrop-blur-sm border border-violet-500/30 rounded-2xl p-8 md:p-10">
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p>
                    Driven by creativity, precision, and a passion for
                    storytelling, ShotbyVOR transforms ordinary scenes into
                    unforgettable visual experiences. Every project is
                    approached with fresh ideas, professional craftsmanship, and
                    an eye for the details that make each story unique.
                  </p>

                  <p className="text-xl text-white font-medium">
                    Because the best stories aren't just watched they're felt.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Elements */}
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-400 mb-2">
                    100+
                  </div>
                  <div className="text-sm text-gray-400">Events Captured</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                    50+
                  </div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-xl p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-fuchsia-400 mb-2">
                    4K
                  </div>
                  <div className="text-sm text-gray-400">Cinematic Quality</div>
                </div>
              </div>

              {/* Philosophy Section */}
              <div className="bg-linear-to-br from-violet-950/60 to-purple-950/60 backdrop-blur-sm border border-violet-500/30 rounded-2xl p-8 md:p-10">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Our Philosophy
                </h3>
                <ul className="space-y-4">
                  {[
                    "Cinematic composition & careful pacing",
                    "Immersive storytelling with identity",
                    "Capturing nightlife & lifestyle energy",
                    "Celebrity & event videography",
                    "Timeless, authentic visuals",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tagline */}
              <div className="bg-linear-to-r from-violet-600/20 to-purple-600/20 backdrop-blur-sm border border-violet-500/40 rounded-2xl p-8 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  ShotbyVOR
                </p>
                <p className="text-violet-300 text-lg">
                  Capturing the energy. Preserving the moment.{" "}
                  <span className="text-white">
                    Creating stories that live forever.
                  </span>
                </p>
              </div>
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
