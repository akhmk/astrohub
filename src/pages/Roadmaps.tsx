import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus } from '@phosphor-icons/react';

interface RoadmapProps {
  onBack: () => void;
}

const roadmapData = [
  {
    phase: "Phase 1",
    title: "Foundations of Space Science",
    color: "#f97316", // Orange
    details: [
      "Introduction to Astrophysics and Cosmology",
      "Mathematics for Space Engineering",
      "History of Space Exploration",
      "Basic Orbital Mechanics"
    ]
  },
  {
    phase: "Phase 2",
    title: "Advanced Engineering & Propulsion",
    color: "#fbbf24", // Yellow
    details: [
      "Rocket Propulsion Systems",
      "Structural Analysis of Spacecraft",
      "Avionics and Control Systems",
      "Materials Science for Extreme Environments"
    ]
  },
  {
    phase: "Phase 3",
    title: "Mission Planning & Operations",
    color: "#94a3b8", // Blue-grey
    details: [
      "Deep Space Communication",
      "Autonomous Navigation Systems",
      "Life Support Systems (ECLSS)",
      "Mission Architecture Design"
    ]
  },
  {
    phase: "Phase 4",
    title: "Planetary Colonization",
    color: "#86efac", // Green-grey
    details: [
      "In-Situ Resource Utilization (ISRU)",
      "Space Habitat Engineering",
      "Exobiology and Planetary Protection",
      "Space Law and Governance"
    ]
  }
];

export default function Roadmaps({ onBack }: RoadmapProps) {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="flex items-center justify-between mb-20">
          <h1 className="text-6xl md:text-8xl font-heading text-white font-bold tracking-tighter">
            Roadmap
          </h1>
          <div className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold animate-pulse">
            Coming Soon
          </div>
        </div>

        <div className="relative">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="liquid-glass p-12 rounded-3xl border border-white/10 text-center backdrop-blur-md">
              <h2 className="text-4xl font-heading font-bold mb-4">Under Construction</h2>
              <p className="text-white/60 max-w-md mx-auto">
                Our curriculum designers are finalizing the detailed learning paths. 
                Stay tuned for the full interactive roadmap experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start opacity-20 blur-sm grayscale pointer-events-none">
          {/* Left Column: Phase Cards */}
          <div className="space-y-4">
            {roadmapData.map((item, index) => (
              <motion.div
                key={index}
                onClick={() => setActivePhase(index)}
                className={`cursor-pointer rounded-xl border transition-all duration-300 p-8 flex items-center justify-between ${
                  activePhase === index 
                    ? 'bg-white/5 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
                    : 'bg-transparent border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-12">
                  <span className="text-white/20 text-sm font-medium uppercase tracking-widest w-16">
                    {item.phase}
                  </span>
                  <h3 className={`text-xl font-medium transition-colors ${
                    activePhase === index ? 'text-white' : 'text-white/40'
                  }`}>
                    {item.title}
                  </h3>
                </div>
                <div className={`transition-transform duration-300 ${activePhase === index ? 'rotate-45' : ''}`}>
                  <Plus size={24} className={activePhase === index ? 'text-white' : 'text-white/20'} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Timeline & Details */}
          <div className="relative pl-12">
            {/* Vertical Line */}
            <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-white/10" />

            <div className="space-y-16">
              {roadmapData.map((item, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: activePhase === index ? 1.2 : 1,
                      backgroundColor: item.color,
                      boxShadow: activePhase === index ? `0 0 20px ${item.color}44` : 'none'
                    }}
                    className="absolute -left-[52px] top-1.5 w-3 h-3 rounded-full border-2 border-black z-10"
                  />

                  <div className={`transition-all duration-500 ${activePhase === index ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4'}`}>
                    <h2 className="text-xl font-medium text-white mb-6">
                      {index + 1}. {item.title}
                    </h2>
                    <ul className="space-y-4">
                      {item.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/60 leading-relaxed">
                          <span className="mt-2.5 w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
