import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { api, Lab } from '../lib/api';

interface LabsProps {
  onBack: () => void;
}

// Fallback data
const fallbackLabs = [
  {
    title: "Virtual Telescope Lab",
    description: "Control digital versions of world-class telescopes. Process real astronomical data and capture your own images of deep-space objects.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    tags: ["Astronomy", "Data Analysis"]
  },
  {
    title: "Rocket Simulation",
    description: "Design and test launch vehicles in a high-fidelity physics environment. Master orbital mechanics through interactive flight simulations.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    tags: ["Engineering", "Physics"]
  },
  {
    title: "CubeSat Ground Station",
    description: "Learn to communicate with small satellites. Practice telemetry analysis and mission operations in our virtual control center.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    tags: ["Aerospace", "Communication"]
  },
  {
    title: "Exoplanet Workshop",
    description: "Search for worlds beyond our solar system. Use the transit method to detect and characterize planets orbiting distant stars.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
    tags: ["Science", "Discovery"]
  }
];

const difficultyColors: Record<string, string> = {
  BEGINNER: 'text-green-400 border-green-500/30 bg-green-500/10',
  INTERMEDIATE: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  ADVANCED: 'text-red-400 border-red-500/30 bg-red-500/10',
};

export default function Labs({ onBack }: LabsProps) {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getLabs();
        setLabs(res.data);
      } catch (err) {
        console.error('Failed to load labs:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const useFallback = labs.length === 0;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 lg:px-12 relative">
      <CosmicBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="flex items-center justify-between mb-20">
          <div>
            <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-4">
              Labs
            </h1>
            <p className="text-white/60 max-w-2xl text-lg font-body">
              Interactive environments for hands-on aerospace engineering and astronomical research.
            </p>
          </div>
          {useFallback && (
            <div className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold">
              Preview
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useFallback ? (
              fallbackLabs.map((lab, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="liquid-glass rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img src={lab.image} alt={lab.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {lab.tags.map(tag => (
                        <span key={tag} className="bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-heading mb-4">{lab.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{lab.description}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              labs.map((lab, i) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="liquid-glass rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${difficultyColors[lab.difficulty]}`}>
                        {lab.difficulty}
                      </span>
                      <span className="text-white/30 text-xs">{lab._count.submissions} submissions</span>
                    </div>
                    <h3 className="text-2xl font-heading mb-4">{lab.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">{lab.description}</p>
                    <button className="bg-white text-black rounded-full px-6 py-2 text-sm font-bold hover:bg-white/90 transition-colors">
                      Open Lab
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
