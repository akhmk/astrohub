import { motion } from "framer-motion";
import { ViewState } from "../App";

interface FeaturesChessProps {
  onNavigate: (view: ViewState) => void;
}

export default function FeaturesChess({ onNavigate }: FeaturesChessProps) {
  const rows = [
    {
      badge: "Curriculum",
      title: "Expert-led courses. Built for mastery.",
      body: "Our courses are taught by professors from top-tier universities and industry veterans from NASA and SpaceX. Gain deep insights into the mechanics of the cosmos.",
      button: "Browse Courses",
      view: "courses" as ViewState,
      gif: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=800",
      reverse: false,
    },
    {
      badge: "Community",
      title: "Interactive clubs. Global network.",
      body: "Join specialized clubs—from amateur rocketry to deep-sky astrophotography. Connect with thousands of students and professionals worldwide.",
      button: "Join a Club",
      view: "clubs" as ViewState,
      gif: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      reverse: true,
    },
  ];

  return (
    <section className="py-24 px-8 lg:px-16 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col gap-32">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className={`flex flex-col ${
              row.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-16 lg:gap-24`}
          >
            {/* Content */}
            <div className="flex-1 flex flex-col items-start text-left">
              <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6">
                {row.badge}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white tracking-tight leading-[0.9] mb-6">
                {row.title}
              </h2>
              <p className="text-white/60 font-body font-light text-sm md:text-base mb-10 max-w-md">
                {row.body}
              </p>
              <button 
                onClick={() => onNavigate(row.view)}
                className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium hover:scale-105 transition-transform"
              >
                {row.button}
              </button>
            </div>

            {/* Image/GIF */}
            <div className="flex-1 w-full">
              <div className="liquid-glass rounded-2xl overflow-hidden aspect-video relative">
                <img
                  src={row.gif}
                  alt={row.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
