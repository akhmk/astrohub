import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  BookOpen, 
  Award,
  Clock,
  Menu,
  X
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';

const COURSE_CONTENT = {
  title: "Basic Rocketry",
  modules: [
    {
      id: 1,
      title: "Module 1: Principles of Rocket Propulsion",
      lessons: [
        { id: 101, title: "Newton's Third Law in Space", type: 'video', duration: '45m', completed: true },
        { id: 102, title: "The Rocket Equation", type: 'reading', duration: '1h 20m', completed: false },
        { id: 103, title: "Chemical vs Electric Propulsion", type: 'video', duration: '55m', completed: false }
      ]
    },
    {
      id: 2,
      title: "Module 2: Structural Design & Materials",
      lessons: [
        { id: 201, title: "Airframe Dynamics", type: 'video', duration: '50m', completed: false },
        { id: 202, title: "Material Selection", type: 'reading', duration: '40m', completed: false }
      ]
    }
  ]
};

export default function Learning({ onBack }: { onBack: () => void }) {
  const [activeLesson, setActiveLesson] = useState(COURSE_CONTENT.modules[0].lessons[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <CosmicBackground />
      
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <h1 className="text-sm font-bold truncate md:max-w-md">
            {COURSE_CONTENT.title} <span className="text-white/40 font-normal ml-2 hidden sm:inline">/ {activeLesson.title}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Award size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">33% Complete</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="max-w-5xl mx-auto p-6 md:p-12">
            {/* Player / Content Placeholder */}
            <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 mb-12 relative overflow-hidden group">
              {activeLesson.type === 'video' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all cursor-pointer">
                    <Play size={32} fill="currentColor" />
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1200" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    alt=""
                  />
                </div>
              ) : (
                <div className="absolute inset-0 p-12 overflow-y-auto">
                  <div className="max-w-2xl mx-auto prose prose-invert">
                    <h2 className="text-3xl font-heading mb-6">{activeLesson.title}</h2>
                    <p className="text-white/60 leading-relaxed mb-6">
                      The Tsiolkovsky rocket equation, or classical rocket equation, is a mathematical equation that describes the motion of vehicles that follow the basic principle of a rocket: a device that can apply acceleration to itself using thrust.
                    </p>
                    <div className="p-8 bg-blue-500/5 rounded-2xl border border-blue-500/20 mb-6">
                      <code className="text-blue-400 text-lg font-mono">Δv = v_e * ln(m_0 / m_f)</code>
                    </div>
                    <p className="text-white/60 leading-relaxed">
                      Where Δv is the maximum change of velocity of the vehicle, v_e is the effective exhaust velocity, m_0 is the initial total mass, and m_f is the final total mass.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pb-12 border-b border-white/10">
              <div>
                <h2 className="text-3xl font-heading mb-2">{activeLesson.title}</h2>
                <div className="flex items-center gap-6 text-sm text-white/40">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {activeLesson.duration}
                  </div>
                  <div className="flex items-center gap-2 line-clamp-1">
                    <BookOpen size={16} />
                    Module 1: Principles of Rocket Propulsion
                  </div>
                </div>
              </div>
              <button className="bg-white text-black rounded-full px-8 py-4 text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Mark as Complete <CheckCircle size={18} />
              </button>
            </div>

            {/* Discussion Preview */}
            <div className="liquid-glass rounded-3xl p-8 border border-white/5">
              <h3 className="text-lg font-bold mb-6">Lesson Discussion</h3>
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4">
                    <img src={`https://picsum.photos/seed/${i + 40}/100/100`} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">SpaceExpert_{i}</span>
                        <span className="text-[10px] text-white/40">2 hours ago</span>
                      </div>
                      <p className="text-sm text-white/60">Can you explain more about the specific impulse relationship here?</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Navigation */}
        <aside className={`
          absolute lg:relative inset-y-0 right-0 w-80 bg-black/80 backdrop-blur-2xl border-l border-white/10 z-20 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:hidden'}
        `}>
          <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white/30 mb-8">Course Curriculum</h3>
            
            <div className="space-y-10">
              {COURSE_CONTENT.modules.map((module) => (
                <div key={module.id}>
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[10px] font-mono text-white/40 border border-white/10">
                      {module.id}
                    </span>
                    {module.title}
                  </h4>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group
                          ${activeLesson.id === lesson.id 
                            ? 'bg-blue-500/10 border border-blue-500/50' 
                            : 'hover:bg-white/5 border border-transparent'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors
                            ${activeLesson.id === lesson.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'}
                          `}>
                            {lesson.type === 'video' ? <Play size={14} /> : <FileText size={14} />}
                          </div>
                          <div>
                            <div className={`text-xs font-medium transition-colors ${activeLesson.id === lesson.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                              {lesson.title}
                            </div>
                            <div className="text-[9px] text-white/30 uppercase tracking-wider">{lesson.duration}</div>
                          </div>
                        </div>
                        {lesson.completed && <CheckCircle size={14} className="text-green-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
