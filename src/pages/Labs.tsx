import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import CosmicBackground from '../components/CosmicBackground';

interface LabsProps {
  onBack: () => void;
}

const labsData = [
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

export default function Labs({ onBack }: LabsProps) {
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
          <div className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold animate-pulse">
            Coming Soon
          </div>
        </div>

        <div className="relative">
          {/* Coming Soon Overlay - Using same style as Roadmaps as requested */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="liquid-glass p-12 rounded-3xl border border-white/10 text-center backdrop-blur-md">
              <h2 className="text-4xl font-heading font-bold mb-4">Under Construction</h2>
              <p className="text-white/60 max-w-md mx-auto">
                Our engineering team is finalizing the interactive simulation modules. 
                Get ready for a full hands-on virtual lab experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-20 blur-sm grayscale pointer-events-none">
            {labsData.map((lab, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass rounded-3xl overflow-hidden border border-white/5"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={lab.image} alt={lab.title} className="w-full h-full object-cover" />
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
                  <p className="text-white/50 text-sm leading-relaxed">
                    {lab.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
