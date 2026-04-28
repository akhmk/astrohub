import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api, Roadmap, RoadmapProgress } from '../lib/api';

interface RoadmapProps {
  onBack: () => void;
}

// Fallback data when API is empty
const fallbackRoadmapData = [
  {
    phase: "Phase 1", title: "Foundations of Space Science", color: "#f97316",
    details: ["Introduction to Astrophysics and Cosmology", "Mathematics for Space Engineering", "History of Space Exploration", "Basic Orbital Mechanics"]
  },
  {
    phase: "Phase 2", title: "Advanced Engineering & Propulsion", color: "#fbbf24",
    details: ["Rocket Propulsion Systems", "Structural Analysis of Spacecraft", "Avionics and Control Systems", "Materials Science for Extreme Environments"]
  },
  {
    phase: "Phase 3", title: "Mission Planning & Operations", color: "#94a3b8",
    details: ["Deep Space Communication", "Autonomous Navigation Systems", "Life Support Systems (ECLSS)", "Mission Architecture Design"]
  },
  {
    phase: "Phase 4", title: "Planetary Colonization", color: "#86efac",
    details: ["In-Situ Resource Utilization (ISRU)", "Space Habitat Engineering", "Exobiology and Planetary Protection", "Space Law and Governance"]
  }
];

export default function Roadmaps({ onBack }: RoadmapProps) {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState(0);
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getRoadmaps();
        setRoadmaps(res.data);
        
        // Load progress for each roadmap if user is logged in
        if (user && res.data.length > 0) {
          const progMap: Record<string, string[]> = {};
          for (const rm of res.data) {
            try {
              const p = await api.getProgress(rm.id);
              progMap[rm.id] = p.completedSteps || [];
            } catch {}
          }
          setProgress(progMap);
        }
      } catch (err) {
        console.error('Failed to load roadmaps:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const toggleStep = async (roadmapId: string, stepId: string) => {
    if (!user) return;
    const current = progress[roadmapId] || [];
    const updated = current.includes(stepId) 
      ? current.filter(s => s !== stepId) 
      : [...current, stepId];
    
    setProgress(prev => ({ ...prev, [roadmapId]: updated }));
    try {
      await api.updateProgress(roadmapId, updated);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  // Use API data if available, otherwise fallback
  const useFallback = roadmaps.length === 0;

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
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
              Roadmaps
            </h1>
            <p className="text-white/60 max-w-2xl text-lg font-body">
              Structured learning paths for mastering aerospace and space science.
            </p>
          </div>
          <div className="px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold animate-pulse">
            Coming Soon
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="liquid-glass p-12 rounded-3xl border border-white/10 text-center backdrop-blur-md">
              <h2 className="text-4xl font-heading font-bold mb-4">Under Construction</h2>
              <p className="text-white/60 max-w-md mx-auto">
                Our curriculum team is developing comprehensive learning pathways. 
                Get ready for structured, interactive study plans.
              </p>
            </div>
          </div>

          <div className="opacity-20 blur-sm grayscale pointer-events-none">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-white/40" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column: Phase Cards */}
            <div className="space-y-4">
              {(useFallback ? fallbackRoadmapData : roadmaps).map((item, index) => (
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
                      {useFallback ? (item as any).phase : `Phase ${index + 1}`}
                    </span>
                    <h3 className={`text-xl font-medium transition-colors ${
                      activePhase === index ? 'text-white' : 'text-white/40'
                    }`}>
                      {useFallback ? (item as any).title : (item as Roadmap).title}
                    </h3>
                  </div>
                  <div className={`transition-transform duration-300 ${activePhase === index ? 'rotate-45' : ''}`}>
                    <Plus size={24} className={activePhase === index ? 'text-white' : 'text-white/20'} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Details */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-white/10" />

              <div className="space-y-16">
                {(useFallback ? fallbackRoadmapData : roadmaps).map((item, index) => {
                  const colors = ['#f97316', '#fbbf24', '#94a3b8', '#86efac'];
                  const color = useFallback ? (item as any).color : colors[index % colors.length];
                  const details = useFallback 
                    ? (item as any).details 
                    : (item as Roadmap).steps.map((s: any) => ({ id: s.id, title: s.title }));
                  const rmId = useFallback ? '' : (item as Roadmap).id;

                  return (
                    <div key={index} className="relative">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          scale: activePhase === index ? 1.2 : 1,
                          backgroundColor: color,
                          boxShadow: activePhase === index ? `0 0 20px ${color}44` : 'none'
                        }}
                        className="absolute -left-[52px] top-1.5 w-3 h-3 rounded-full border-2 border-black z-10"
                      />

                      <div className={`transition-all duration-500 ${activePhase === index ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4'}`}>
                        <h2 className="text-xl font-medium text-white mb-6">
                          {index + 1}. {useFallback ? (item as any).title : (item as Roadmap).title}
                        </h2>
                        <ul className="space-y-4">
                          {useFallback ? (
                            (details as string[]).map((detail: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-white/60 leading-relaxed">
                                <span className="mt-2.5 w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                                {detail}
                              </li>
                            ))
                          ) : (
                            (details as { id: string; title: string }[]).map((step) => (
                              <li 
                                key={step.id} 
                                className="flex items-start gap-3 text-white/60 leading-relaxed cursor-pointer hover:text-white/80 transition-colors"
                                onClick={() => toggleStep(rmId, step.id)}
                              >
                                {(progress[rmId] || []).includes(step.id) ? (
                                  <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Circle size={18} className="text-white/20 mt-0.5 flex-shrink-0" />
                                )}
                                {step.title}
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
