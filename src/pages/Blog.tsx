import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The James Webb Telescope: A New Era",
    excerpt: "How the most powerful space telescope ever built is changing our understanding of the early universe.",
    author: "Dr. Sarah Jenkins",
    date: "Oct 12, 2026",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Living on Mars: The 2030 Roadmap",
    excerpt: "A deep dive into the engineering challenges and psychological factors of long-term Martian habitation.",
    author: "Prof. Michael Chen",
    date: "Oct 08, 2026",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Blog({ onBack }: { onBack: () => void }) {
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

        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-heading italic tracking-tighter mb-4">
            Cosmic Chronicles
          </h1>
          <p className="text-white/60 font-body max-w-xl">
            Latest news, research breakthroughs, and stories from the frontier of space exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-[2.5rem] mb-8 border border-white/10">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-6 text-xs text-white/40 uppercase tracking-widest mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {post.date}
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} />
                  {post.author}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading italic mb-4 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-white/50 font-body mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              <button className="flex items-center gap-2 text-sm font-bold group-hover:gap-4 transition-all">
                Read Article <ArrowRight size={18} />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
