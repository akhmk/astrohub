import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, ArrowRight, ArrowLeft } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';

const CLUBS = [
  {
    id: 1,
    name: "Astro-Photography Collective",
    description: "Capture the beauty of the night sky. Monthly challenges and gear reviews.",
    members: 1240,
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=800",
    category: "Photography"
  },
  {
    id: 2,
    name: "Rocketry Engineering Lab",
    description: "Design, build, and simulate rocket engines. From amateur to pro levels.",
    members: 850,
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800",
    category: "Engineering"
  },
  {
    id: 3,
    name: "Exoplanet Hunters",
    description: "Analyze real data from space telescopes to find potential new worlds.",
    members: 2100,
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
    category: "Research"
  }
];

export default function Clubs({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-8 lg:px-16 relative">
      <CosmicBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-6xl font-heading italic tracking-tighter mb-4">
              Community Hubs
            </h1>
            <p className="text-white/60 font-body max-w-xl">
              Join specialized groups to collaborate, share projects, and learn with peers who share your passion.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Find a club..." 
                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-6 text-sm focus:outline-none focus:border-white/30 transition-colors w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLUBS.map((club, i) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass rounded-3xl overflow-hidden group"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                    {club.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-heading italic mb-2">{club.name}</h3>
                <p className="text-white/50 text-sm font-body mb-6 line-clamp-2">
                  {club.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Users size={14} />
                    {club.members} Members
                  </div>
                  <button className="bg-white text-black rounded-full px-6 py-2 text-xs font-bold hover:bg-white/90 transition-colors">
                    Join Club
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
