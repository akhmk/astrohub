import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';
import { ArrowLeft, Search, Filter, Clock, Users, Star, ArrowRight, BookOpen, CheckCircle, PlayCircle, ClipboardList } from 'lucide-react';

const COURSES = [
  {
    id: 1,
    title: "Introduction to Astrophysics",
    instructor: "Ibrayev Mirali",
    duration: "12 Weeks",
    students: "1.2k",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    category: "Astrophysics",
    level: "Beginner"
  },
  {
    id: 2,
    title: "Basic Rocketry",
    instructor: "Akhmetov Yeraly, Latipov Akhmadkhon",
    duration: "10 Weeks",
    students: "850",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    category: "Engineering",
    level: "Beginner"
  }
];

const MODULES_DATA: Record<number, any[]> = {
  2: [
    {
      id: 1,
      title: "Module 1: Principles of Rocket Propulsion",
      description: "Understanding the fundamental physics that move objects in the vacuum of space.",
      lessons: [
        { id: 101, title: "Newton's Third Law in Space", duration: "45m", type: "video" },
        { id: 102, title: "The Rocket Equation (Tsiolkovsky)", duration: "1h 20m", type: "reading" },
        { id: 103, title: "Chemical vs Electric Propulsion", duration: "55m", type: "video" }
      ],
      tasks: [
        { id: 1001, title: "Calculate delta-v for a simple LEO mission", status: "pending" },
        { id: 1002, title: "Explain nozzle expansion ratios in vacuum", status: "pending" }
      ]
    },
    {
      id: 2,
      title: "Module 2: Structural Design & Materials",
      description: "How to build a machine that survives intense vibrations and extreme temperatures.",
      lessons: [
        { id: 201, title: "Airframe Dynamics", duration: "50m", type: "video" },
        { id: 202, title: "Lightweight Materials for Space", duration: "40m", type: "reading" },
        { id: 203, title: "Fuel Tank Integration", duration: "1h", type: "video" }
      ],
      tasks: [
        { id: 2001, title: "Sketch a basic rocket body layout", status: "pending" },
        { id: 2002, title: "Carbon fiber vs Aluminum trade-off study", status: "pending" }
      ]
    },
    {
      id: 3,
      title: "Module 3: Flight Systems & Avionics",
      description: "The brain of the rocket: guidance, control, and communication.",
      lessons: [
        { id: 301, title: "Guidance, Navigation, and Control (GNC)", duration: "1h 15m", type: "video" },
        { id: 302, title: "Onboard Computer Architecture", duration: "50m", type: "reading" },
        { id: 303, title: "Telemetry and Transmission Systems", duration: "45m", type: "video" }
      ],
      tasks: [
        { id: 3001, title: "Map out a sensor feedback loop", status: "pending" },
        { id: 3002, title: "Define basic PID controller parameters", status: "pending" }
      ]
    }
  ],
  1: [
    {
      id: 1,
      title: "Module 1: Celestial Mechanics",
      description: "The math behind gravity and orbits.",
      lessons: [
        { id: 101, title: "Kepler's Laws", duration: "1h", type: "video" },
        { id: 102, title: "The N-Body Problem", duration: "1h 30m", type: "reading" }
      ],
      tasks: [
        { id: 1001, title: "Calculate orbital eccentricity of Mars", status: "pending" }
      ]
    }
  ]
};

export default function Courses({ onBack, onStartCourse }: { onBack: () => void, onStartCourse: () => void }) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId);
  const modules = selectedCourseId ? MODULES_DATA[selectedCourseId] || [] : [];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-8 lg:px-16 relative">
      {/* Space Background */}
      <CosmicBackground />

      <AnimatePresence mode="wait">
        {!selectedCourseId ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 relative z-10">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h1 className="text-5xl md:text-6xl font-heading tracking-tighter mb-4">
                    Our Trajectories
                  </h1>
                  <p className="text-white/60 font-body max-w-xl">
                    From foundational astronomy to advanced orbital mechanics. Choose your path and master the secrets of the cosmos.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search courses..." 
                      className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-6 text-sm focus:outline-none focus:border-white/30 transition-colors w-64"
                    />
                  </div>
                  <button className="liquid-glass p-2.5 rounded-full hover:bg-white/10 transition-colors">
                    <Filter size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {COURSES.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="liquid-glass rounded-3xl overflow-hidden group hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-medium text-white">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-heading mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-white/50 text-sm font-body mb-6">
                      {course.instructor}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-4 text-white/40 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users size={14} />
                          {course.students}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-7xl mx-auto relative z-10"
          >
            <button 
              onClick={() => setSelectedCourseId(null)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Trajectories
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
              <div>
                <h1 className="text-4xl md:text-6xl font-heading tracking-tighter mb-4">
                  {selectedCourse?.title}
                </h1>
                <p className="text-white/60 text-lg font-body mb-12 max-w-2xl leading-relaxed">
                  Deep dive into the curriculum. Complete all modules to earn your certification.
                </p>

                <div className="space-y-12">
                  {modules.map((module: any, mi: number) => (
                    <div key={module.id} className="relative pl-8 border-l border-white/10">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      
                      <div className="mb-8">
                        <h2 className="text-2xl font-heading mb-3">{module.title}</h2>
                        <p className="text-white/40 text-sm font-body">{module.description}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white/30 mb-4 flex items-center gap-2">
                          <BookOpen size={14} />
                          Lessons
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {module.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="liquid-glass rounded-2xl p-4 flex items-center justify-between group hover:bg-blue-500/5 transition-colors cursor-pointer border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 text-blue-400">
                                  {lesson.type === 'video' ? <PlayCircle size={18} /> : <BookOpen size={18} />}
                                </div>
                                <div>
                                  <div className="text-sm font-medium group-hover:text-blue-400 transition-colors">{lesson.title}</div>
                                  <div className="text-[10px] text-white/40 uppercase tracking-wider">{lesson.duration}</div>
                                </div>
                              </div>
                              <CheckCircle size={16} className="text-white/10" />
                            </div>
                          ))}
                        </div>

                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white/30 mt-8 mb-4 flex items-center gap-2">
                          <ClipboardList size={14} />
                          Tasks
                        </h3>
                        <div className="space-y-3">
                          {module.tasks.map((task: any) => (
                            <div key={task.id} className="p-4 rounded-xl border border-white/5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                              <span className="text-sm text-white/70">{task.title}</span>
                              <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                                Required
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Info */}
              <aside className="sticky top-32">
                <div className="liquid-glass rounded-3xl overflow-hidden border border-white/10">
                  <img src={selectedCourse?.image} alt="" className="w-full aspect-video object-cover" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-yellow-500 mb-4">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-bold text-white">{selectedCourse?.rating}</span>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">Instructor</span>
                        <span className="text-white text-right font-medium">{selectedCourse?.instructor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">Duration</span>
                        <span className="text-white font-medium">{selectedCourse?.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">Level</span>
                        <span className="text-white font-medium">{selectedCourse?.level}</span>
                      </div>
                    </div>
                    
                    <div className="mb-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40 mb-6">
                      <span>Course Progress</span>
                      <span className="text-white font-bold">33%</span>
                    </div>

                    <button 
                      onClick={onStartCourse}
                      className="w-full bg-white text-black rounded-full py-4 text-sm font-bold hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
