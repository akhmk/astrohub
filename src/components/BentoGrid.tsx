import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  MagnifyingGlass,
  Microphone,
  Camera,
  X,
  Globe,
  Rocket,
  Planet,
  Atom,
  UsersThree,
  Cpu,
  Broadcast,
  Certificate,
  AppWindow,
  Layout,
  CursorClick,
  Code,
  ChatCircleText,
  BookOpen,
  GraduationCap
} from '@phosphor-icons/react';

interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
  delay?: number;
  children?: React.ReactNode;
  cta?: string;
  onClick?: () => void;
}

const BentoCard = ({ title, description, className = "", delay = 0, children, cta = "See More", onClick }: BentoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`bg-[#0a0a0a] rounded-[1.5rem] p-8 flex flex-col relative group overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 ${className}`}
  >
    <div className="relative z-10">
      <h3 className="text-xl font-heading text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-white/40 text-sm font-body leading-relaxed max-w-[240px] mb-6">
        {description}
      </p>
      <button 
        onClick={onClick}
        className="flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-white transition-colors"
      >
        {cta} <ArrowRight size={16} />
      </button>
    </div>
    
    <div className="absolute inset-0 z-0 pointer-events-none">
      {children}
    </div>
  </motion.div>
);

import { ViewState } from '../App';
import { useLanguage } from "../context/LanguageContext";

export default function BentoGrid({ onNavigate }: { onNavigate: (view: ViewState) => void }) {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[1000px]">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4 h-full">
            {/* Academy Courses */}
            <BentoCard
              title={t.nav.courses}
              description={t.bento.curriculumDesc}
              className="flex-[7] min-h-[450px]"
              delay={0.1}
              onClick={() => onNavigate('courses')}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[280px] bg-[#111] rounded-t-xl border-t border-x border-white/10 p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">{t.bento.myCourses}</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Introduction to Astrophysics", progress: 80, color: "bg-blue-500" },
                    { label: "Basic Rocketry", progress: 20, color: "bg-orange-500" },
                  ].map((course, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[9px] text-white/60">
                        <span>{course.label}</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className={`h-full ${course.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none" />
              </div>
            </BentoCard>

            {/* Student Clubs */}
            <BentoCard
              title={t.nav.clubs}
              description={t.bento.communityDesc}
              className="flex-[5] min-h-[350px]"
              delay={0.4}
              onClick={() => onNavigate('clubs')}
            >
              <div className="absolute bottom-0 left-0 w-full h-full flex items-center justify-center opacity-40">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UsersThree size={120} weight="thin" className="text-blue-400/30" />
                  </div>
                  <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
                  <div className="absolute inset-[-20px] border border-white/5 rounded-full animate-spin-reverse-slow" />
                </div>
              </div>
            </BentoCard>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4 h-full">
            {/* Community Forum */}
            <BentoCard
              title={t.nav.forum}
              description={t.bento.communityTitle}
              className="flex-[4] min-h-[300px]"
              delay={0.2}
              onClick={() => onNavigate('forum')}
            >
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%]">
                <div className="bg-white/5 border border-white/10 rounded-full py-3 px-5 flex items-center gap-3 shadow-2xl">
                  <ChatCircleText size={18} className="text-blue-400/60" />
                  <span className="text-white/40 text-sm">Ask the community...</span>
                  <div className="flex-1" />
                  <MagnifyingGlass size={16} className="text-white/60" />
                </div>
                <div className="absolute -inset-4 bg-blue-500/5 blur-2xl rounded-full -z-10" />
              </div>
            </BentoCard>

            {/* Astrohub Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex-[3] min-h-[200px] bg-gradient-to-br from-[#111] to-[#050505] rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <Atom size={32} weight="duotone" className="text-blue-400" />
                <span className="text-xl font-heading text-white font-bold tracking-tighter">{t.bento.hub}</span>
              </div>
              <p className="text-2xl md:text-3xl font-heading text-white font-medium tracking-tight relative z-10">
                {t.bento.hubTitle}
              </p>
            </motion.div>

            {/* Roadmaps */}
            <BentoCard
              title={t.nav.roadmaps}
              description={t.bento.curriculumTitle}
              className="flex-[4] min-h-[300px]"
              delay={0.6}
              onClick={() => onNavigate('roadmaps')}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] flex flex-col gap-2 p-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="w-full h-10 bg-white/5 rounded-lg border border-white/10 flex items-center px-4 gap-3"
                  >
                    <div className="w-4 h-4 rounded-full border border-blue-500/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500/40 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4 h-full">
            {/* Academy Blog */}
            <BentoCard
              title={t.nav.blog}
              description={t.bento.hubDesc}
              className="flex-[5] min-h-[350px]"
              delay={0.3}
              onClick={() => onNavigate('blog')}
            >
              <div className="absolute bottom-0 right-0 w-full h-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <BookOpen size={64} weight="duotone" className="text-blue-400/40" />
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Broadcast size={14} className="text-white/40" />
                  </div>
                  <div className="absolute bottom-4 left-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Rocket size={14} className="text-white/40" />
                  </div>
                  <div className="absolute top-1/2 -left-4 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Globe size={12} className="text-white/40" />
                  </div>
                  <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                  </svg>
                </div>
              </div>
            </BentoCard>

            {/* Interactive Learning */}
            <BentoCard
              title={t.bento.interactive}
              description={t.bento.interactiveDesc}
              className="flex-[7] min-h-[450px]"
              delay={0.7}
              onClick={() => onNavigate('labs')}
            >
              <div className="absolute bottom-0 right-0 w-[95%] h-[300px] bg-[#111] rounded-tl-xl border-t border-l border-white/10 p-4">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[10px] text-white/20 uppercase tracking-widest">{t.bento.lab}</div>
                </div>
                <div className="flex gap-4 h-full">
                  <div className="w-24 border-r border-white/5 pr-2 space-y-2">
                    <div className="text-[9px] text-white/40 uppercase">{t.bento.tools}</div>
                    <div className="w-full h-4 bg-white/5 rounded" />
                    <div className="w-full h-4 bg-blue-500/20 rounded border border-blue-500/30" />
                    <div className="w-full h-4 bg-white/5 rounded" />
                    <div className="w-full h-4 bg-white/5 rounded" />
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px] opacity-10" />
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-[2px]" />
                    <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full" />
                    <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full blur-[1px]" />
                  </div>
                </div>
              </div>
            </BentoCard>
          </div>

        </div>
      </div>
    </section>
  );
}
