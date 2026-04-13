import { motion } from "framer-motion";
import { BookOpen, Rocket, Binoculars, Globe } from "@phosphor-icons/react";

export default function LearningPaths() {
  const paths = [
    {
      icon: Binoculars,
      title: "Observational Astronomy",
      description: "Learn to navigate the night sky, use telescopes, and capture stunning astrophotography.",
      level: "Beginner"
    },
    {
      icon: Rocket,
      title: "Aerospace Engineering",
      description: "Dive into propulsion systems, orbital mechanics, and spacecraft design principles.",
      level: "Advanced"
    },
    {
      icon: BookOpen,
      title: "Astrophysics",
      description: "Explore the laws of physics that govern stars, black holes, and the universe.",
      level: "Intermediate"
    },
    {
      icon: Globe,
      title: "Planetary Science",
      description: "Study the geology, atmospheres, and potential for life on other planets and moons.",
      level: "Beginner"
    }
  ];

  return (
    <section className="py-24 px-8 lg:px-16 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
            Learning Paths
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Choose your trajectory.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paths.map((path, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass rounded-3xl p-8 flex flex-col md:flex-row gap-8 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="liquid-glass-strong rounded-2xl w-16 h-16 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <path.icon size={32} weight="duotone" className="text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-heading italic text-white">
                    {path.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium px-2 py-0.5 border border-white/10 rounded-full">
                    {path.level}
                  </span>
                </div>
                <p className="text-white/50 font-body font-light text-sm leading-relaxed">
                  {path.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
