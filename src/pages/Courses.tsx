import React from 'react';
import { motion } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';
import { ArrowLeft, Search, Filter, Clock, Users, Star, ArrowRight } from 'lucide-react';

const COURSES = [
  {
    id: 1,
    title: "Introduction to Astrophysics",
    instructor: "Dr. Sarah Jenkins",
    duration: "12 Weeks",
    students: "1.2k",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    category: "Astrophysics",
    level: "Beginner"
  },
  {
    id: 2,
    title: "Orbital Mechanics & Satellite Design",
    instructor: "Prof. Michael Chen",
    duration: "10 Weeks",
    students: "850",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    category: "Engineering",
    level: "Advanced"
  },
  {
    id: 3,
    title: "Planetary Geology: Mars & Beyond",
    instructor: "Dr. Elena Rodriguez",
    duration: "8 Weeks",
    students: "2.1k",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
    category: "Planetary Science",
    level: "Intermediate"
  },
  {
    id: 4,
    title: "Rocket Propulsion Systems",
    instructor: "Jameson Wright",
    duration: "14 Weeks",
    students: "1.5k",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    category: "Engineering",
    level: "Intermediate"
  },
  {
    id: 5,
    title: "Observational Astronomy",
    instructor: "Dr. Alan Grant",
    duration: "6 Weeks",
    students: "3.2k",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=800",
    category: "Astronomy",
    level: "Beginner"
  },
  {
    id: 6,
    title: "Search for Extraterrestrial Life",
    instructor: "Dr. Jill Tarter",
    duration: "8 Weeks",
    students: "5.4k",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4b4bf?auto=format&fit=crop&q=80&w=800",
    category: "Astrobiology",
    level: "Beginner"
  }
];

export default function Courses({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-8 lg:px-16 relative">
      {/* Space Background */}
      <CosmicBackground />

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
            <h1 className="text-5xl md:text-6xl font-heading italic tracking-tighter mb-4">
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
            className="liquid-glass rounded-3xl overflow-hidden group hover:bg-white/[0.02] transition-colors"
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
              
              <h3 className="text-2xl font-heading italic mb-2 leading-tight group-hover:text-blue-400 transition-colors">
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
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
