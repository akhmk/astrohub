import { ArrowUpRight, SignOut, Globe } from "@phosphor-icons/react";
import { ViewState } from "../App";
import { User } from "firebase/auth";
import { UserProfile } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  user: User | null;
  profile: UserProfile | null;
  onLogout: () => void;
}

export default function Navbar({ onNavigate, user, profile, onLogout }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => onNavigate("home")}>
        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center liquid-glass">
          <div className="w-6 h-6 bg-white rounded-sm" />
        </div>
      </div>

      {/* Center: Links */}
      <div className="hidden lg:flex items-center liquid-glass rounded-full px-1.5 py-1">
        {[
          { label: t.nav.home, view: "home" },
          { label: t.nav.courses, view: "courses" },
          { label: t.nav.blog, view: "blog" },
          { label: t.nav.clubs, view: "clubs" },
          { label: t.nav.forum, view: "forum" },
          { label: t.nav.roadmaps, view: "roadmaps" },
          { label: "Labs", view: "labs" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view as ViewState)}
            className="px-3 py-2 text-sm font-medium text-foreground/90 font-body hover:text-white transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right: Auth & Language */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
          className="flex items-center gap-2 px-3 py-2 rounded-full liquid-glass text-xs font-bold text-white hover:bg-white/10 transition-all"
        >
          <Globe size={16} />
          {language.toUpperCase()}
        </button>

        {user ? (
          <div className="flex items-center gap-3 liquid-glass pl-1.5 pr-4 py-1.5 rounded-full">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${profile?.firstName || user.displayName}`} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <span className="text-sm font-medium hidden sm:inline-block">{profile?.firstName || user.displayName?.split(' ')[0]}</span>
            <button 
              onClick={onLogout}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              title="Logout"
            >
              <SignOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onNavigate("auth")}
            className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-bold flex items-center gap-2 hover:bg-white/90 transition-all active:scale-95"
          >
            {t.nav.join} <ArrowUpRight size={18} weight="bold" />
          </button>
        )}
      </div>
    </nav>
  );
}
