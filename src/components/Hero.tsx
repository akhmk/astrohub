import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "@phosphor-icons/react";
import BlurText from "./BlurText";

export default function Hero() {
  return (
    <section className="relative overflow-visible h-[1000px] flex flex-col items-center justify-start text-center">
      {/* Background Image (Space) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920')",
          top: "0%" 
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
      <div
        className="absolute bottom-0 left-0 right-0 h-[300px] z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, black)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 pt-[150px] px-8 flex flex-col items-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="liquid-glass rounded-full px-1 py-1 flex items-center gap-3 mb-8"
        >
          <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold">
            Enroll Now
          </span>
          <span className="text-xs font-medium text-white pr-3">
            Spring Semester 2026: Astrophysics & Orbital Mechanics
          </span>
        </motion.div>

        <BlurText
          text="Master the Secrets of the Universe"
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] max-w-4xl tracking-[-4px] mb-8 justify-center"
          delay={100}
        />

        <motion.p
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sm md:text-base text-white/80 font-body font-light leading-tight max-w-lg mb-10"
        >
          World-class education in astronomy and aerospace engineering. Learn from industry experts and join a global community of space enthusiasts.
        </motion.p>

        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <button className="liquid-glass-strong rounded-full px-6 py-3 flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform">
            Explore Courses
            <ArrowUpRight size={16} weight="bold" />
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Play size={14} weight="fill" className="text-white" />
            </div>
            Watch Intro
          </button>
        </motion.div>

        {/* Partners Bar */}
        <div className="mt-auto pb-8 pt-32 w-full">
          <div className="flex flex-col items-center gap-8">
            <div className="liquid-glass rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest text-white/40 font-medium">
              Academic Partners & Affiliations
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {["MIT", "Stanford", "Caltech", "NASA", "CERN"].map((partner) => (
                <span
                  key={partner}
                  className="text-2xl md:text-3xl font-heading italic text-white/30 hover:text-white/60 transition-colors cursor-default"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
