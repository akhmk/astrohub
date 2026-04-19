import { motion } from "framer-motion";
import HLSVideo from "./HLSVideo";
import { ViewState } from "../App";
import { useLanguage } from "../context/LanguageContext";

interface StartSectionProps {
  onNavigate: (view: ViewState) => void;
}

export default function StartSection({ onNavigate }: StartSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[700px] flex items-center justify-center text-center py-24 overflow-hidden">
      {/* HLS Video Background */}
      <HLSVideo
        src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Overlays */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{ 
          background: "linear-gradient(to bottom, black 0%, transparent 40%, transparent 60%, black 100%), rgba(0,0,0,0.2)" 
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 w-full max-w-4xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="liquid-glass rounded-full px-4 py-1 text-xs font-medium text-white font-body mb-8 inline-block"
        >
          {t.start.badge}
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-heading text-white tracking-tight leading-[0.85] mb-8"
        >
          {t.start.title}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/60 font-body font-light text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          {t.start.description}
        </motion.p>
      </div>
    </section>
  );
}
