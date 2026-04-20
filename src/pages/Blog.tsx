import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { api, BlogPost } from '../lib/api';

export default function Blog({ onBack }: { onBack: () => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getBlogPosts();
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpenPost = async (slug: string) => {
    try {
      const full = await api.getBlogPost(slug);
      setSelectedPost(full);
    } catch (err) {
      console.error('Failed to load post:', err);
    }
  };

  // Fallback: if API returns nothing, show a welcome post
  const displayPosts = posts.length > 0 ? posts : [
    {
      id: 'welcome',
      title: "Welcome to Astrohub",
      slug: 'welcome',
      excerpt: "Hey! We are Astrohub Team. From this moment onwards, you won't need to wander around searching for scattered knowledge about space and engineering...",
      content: `Hey! We are Astrohub Team.\n\nFrom this moment onwards, you won't need to wander around searching for scattered knowledge about space and engineering – everything will be gathered, structured, and explained right here in Astrohub.\n\nBy "everything," we mean astronomy, rocket science fundamentals, CubeSat construction, space technologies, and much more – EVERYTHING you need to dive deep into the universe and start building your own path in it.\n\nWe don't just learn – we explore, design, and create.\n\nStay tuned. The universe is closer than you think.`,
      coverURL: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      published: true,
      createdAt: "2026-04-08T00:00:00Z",
      author: { id: '', firstName: 'Astrohub', lastName: 'Team' },
    } as BlogPost,
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-8 lg:px-16 relative">
      <CosmicBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={selectedPost ? () => setSelectedPost(null) : onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {selectedPost ? 'Back to Blog' : 'Back'}
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!selectedPost ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-16">
                  <h1 className="text-5xl md:text-6xl font-heading tracking-tighter mb-4">
                    Astrohub Blog
                  </h1>
                  <p className="text-white/60 font-body max-w-xl">
                    Updates, announcements, and insights from the team behind the academy.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {displayPosts.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group cursor-pointer"
                      onClick={() => post.slug ? handleOpenPost(post.slug) : setSelectedPost(post)}
                    >
                      <div className="aspect-[16/9] overflow-hidden rounded-[2.5rem] mb-8 border border-white/10">
                        <img
                          src={post.coverURL || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex items-center gap-6 text-xs text-white/40 uppercase tracking-widest mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          {post.author ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() : 'Astrohub Team'}
                        </div>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-heading mb-4 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-white/50 font-body mb-8 leading-relaxed">
                        {post.excerpt || post.content?.slice(0, 200) + '...'}
                      </p>
                      <button className="flex items-center gap-2 text-sm font-bold group-hover:gap-4 transition-all">
                        Read Article <ArrowRight size={18} />
                      </button>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl"
              >
                <div className="aspect-[21/9] overflow-hidden rounded-[2.5rem] mb-12 border border-white/10">
                  <img
                    src={selectedPost.coverURL || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex items-center gap-6 text-xs text-white/40 uppercase tracking-widest mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(selectedPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    {selectedPost.author ? `${selectedPost.author.firstName || ''} ${selectedPost.author.lastName || ''}`.trim() : 'Astrohub Team'}
                  </div>
                </div>

                <h2 className="text-5xl md:text-7xl font-heading mb-12 leading-tight">
                  {selectedPost.title}
                </h2>

                <div className="space-y-6 text-xl md:text-2xl text-white/70 font-body leading-relaxed max-w-3xl">
                  {(selectedPost.content || '').split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-16 pt-16 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <User size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold">
                        {selectedPost.author ? `${selectedPost.author.firstName || ''} ${selectedPost.author.lastName || ''}`.trim() : 'Astrohub Team'}
                      </div>
                      <div className="text-sm text-white/40">Founders & Educators</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
