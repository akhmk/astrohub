import HLSVideo from "./HLSVideo";

export default function StartSection() {
  return (
    <section className="relative min-h-[600px] flex flex-col items-center justify-center text-center py-24 overflow-hidden">
      {/* HLS Video Background */}
      <HLSVideo
        src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div
        className="absolute top-0 left-0 right-0 h-[200px] z-1 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, black, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] z-1 pointer-events-none"
        style={{ background: "linear-gradient(to top, black, transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 flex flex-col items-center max-w-4xl mx-auto">
        <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
          Start Your Journey
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
          Learn from the stars.
        </h2>
        <p className="text-white/60 font-body font-light text-sm md:text-base max-w-xl mb-10">
          Our curriculum is designed by leading astrophysicists and aerospace engineers. From basic stargazing to advanced propulsion systems, we cover it all.
        </p>
        <button className="liquid-glass-strong rounded-full px-8 py-3.5 text-sm font-medium hover:scale-105 transition-transform">
          View Curriculum
        </button>
      </div>
    </section>
  );
}
