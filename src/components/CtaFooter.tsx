import CosmicBackground from "./CosmicBackground";
import { ViewState } from "../App";
import { useLanguage } from "../context/LanguageContext";

interface CtaFooterProps {
  onNavigate: (view: ViewState) => void;
}

export default function CtaFooter({ onNavigate }: CtaFooterProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 overflow-hidden bg-black">
      {/* Custom Cosmic Background */}
      <CosmicBackground fixed={false} />

      {/* Gradient Fades to Black */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] z-1 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, black, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[400px] z-1 pointer-events-none"
        style={{ background: "linear-gradient(to top, black, transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl lg:text-8xl font-heading text-white tracking-tighter leading-[0.85] mb-8">
          {t.cta.title}
        </h2>
        <p className="text-white/70 font-body font-light text-lg md:text-xl max-w-2xl mb-12">
          {t.cta.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <button 
            onClick={() => onNavigate('auth')}
            className="liquid-glass-strong rounded-full px-8 py-4 text-base font-medium hover:scale-105 transition-transform"
          >
            {t.cta.cta}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-48 w-full pt-8 pb-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white/40 text-xs font-body">
            {t.cta.rights}
          </div>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/40 text-xs font-body hover:text-white/70 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
