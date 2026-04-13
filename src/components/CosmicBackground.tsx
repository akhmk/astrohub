import React from 'react';
import { motion } from 'framer-motion';
import Particles from './Particles';

export default function CosmicBackground({ fixed = true }: { fixed?: boolean }) {
  const posClass = fixed ? "fixed" : "absolute";
  
  return (
    <div className={`${posClass} inset-0 z-0 overflow-hidden bg-black`}>
      {/* High-Quality Space Asset (Darkened) */}
      <div 
        className={`${posClass} inset-0 z-0 pointer-events-none bg-cover bg-center opacity-30 grayscale`}
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1920')",
        }}
      />

      {/* Particles Layer */}
      <div className={`${posClass} inset-0 z-1 pointer-events-none`}>
        <Particles 
          particleCount={300}
          particleSpread={15}
          speed={0.05}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          particleColors={['#ffffff', '#4c1d95', '#1e1b4b', '#2563eb']}
        />
      </div>

      {/* Deep Navy/Black Overlays */}
      <div className={`${posClass} inset-0 bg-black/60 z-1`} />
      
      {/* Subtle Purple/Blue Glows (Very Dark) */}
      <div className={`${posClass} inset-0 z-2 opacity-40`}>
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={`${posClass} top-[-20%] left-[-10%] w-full h-full rounded-full blur-[150px]`}
          style={{ background: 'radial-gradient(circle, #1e1b4b 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={`${posClass} bottom-[-20%] right-[-10%] w-full h-full rounded-full blur-[150px]`}
          style={{ background: 'radial-gradient(circle, #4c1d95 0%, transparent 70%)' }}
        />
      </div>

      {/* Vignette */}
      <div 
        className={`${posClass} inset-0 z-3 pointer-events-none`}
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)"
        }}
      />
    </div>
  );
}
