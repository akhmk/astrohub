import { motion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import BlurText from "./BlurText";
import { ViewState } from "../App";
import { useLanguage } from "../context/LanguageContext";

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-visible h-[800px] flex flex-col items-center justify-start text-center">
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
      <div className="relative z-10 pt-[200px] px-8 flex flex-col items-center max-w-5xl mx-auto">
        <BlurText
          text={t.hero.title}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading text-foreground leading-[0.8] max-w-4xl tracking-[-4px] mb-8 justify-center"
          delay={100}
        />

        <motion.p
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sm md:text-base text-white/80 font-body font-light leading-tight max-w-lg mb-10"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <button 
            onClick={() => onNavigate('auth')}
            className="liquid-glass-strong rounded-full px-8 py-4 flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform"
          >
            {t.hero.cta}
            <ArrowUpRight size={16} weight="bold" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
