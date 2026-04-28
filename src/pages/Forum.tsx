import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Home, Bookmark, MoreHorizontal, Bell, Settings, Plus, 
  Image as ImageIcon, Send, TrendingUp, Award, ChevronRight,
  Heart, MessageCircle, Share2, User, Lock, Eye, BellRing, Loader2, ArrowLeft
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from '../hooks/useAuth';
import { api, ForumPost, ForumComment } from '../lib/api';

const NAV_ITEMS = [
  { icon: Home, label: 'My Feed' },
  { icon: Bookmark, label: 'Bookmarks' },
];

const SECONDARY_NAV = [
  { icon: Bell, label: 'Notifications', badge: 3 },
  { icon: Settings, label: 'Settings' },
];

interface ForumProps {
  onBack: () => void;
}

export default function Forum({ onBack }: ForumProps) {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('My Feed');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<(ForumPost & { comments: ForumComment[] }) | null>(null);
  const [commentText, setCommentText] = useState('');

  // Fetch posts from API
  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (profile && posts.length > 0) {
      const liked = posts.filter(p => p.favorites?.some(f => f.userId === profile.id)).map(p => p.id);
      setLikedPosts(liked);
    }
  }, [profile, posts.length]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getForumPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id: string) => {
    if (!user) return alert('Please sign in to favorite posts');
    try {
      const { action } = await api.toggleFavorite(id);
      if (action === 'added') {
        setLikedPosts(prev => [...prev, id]);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, _count: { ...p._count, favorites: p._count.favorites + 1 } } : p));
      } else {
        setLikedPosts(prev => prev.filter(p => p !== id));
        setPosts(prev => prev.map(p => p.id === id ? { ...p, _count: { ...p._count, favorites: Math.max(0, p._count.favorites - 1) } } : p));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() || !postTitle.trim() || !user) return;
    setPosting(true);
    try {
      await api.createForumPost({ title: postTitle, content: postContent });
      setPostTitle('');
      setPostContent('');
      await loadPosts();
    } catch (err: any) {
      alert(`Failed to post: ${err.message}`);
    } finally {
      setPosting(false);
    }
  };

  const handleOpenPost = async (postId: string) => {
    try {
      const full = await api.getForumPost(postId);
      setSelectedPost(full);
    } catch (err) {
      console.error('Failed to load post:', err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost || !user) return;
    try {
      await api.addComment(selectedPost.id, commentText);
      setCommentText('');
      const updated = await api.getForumPost(selectedPost.id);
      setSelectedPost(updated);
      await loadPosts();
    } catch (err: any) {
      alert(`Failed to comment: ${err.message}`);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.deleteForumPost(id);
      setSelectedPost(null);
      await loadPosts();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getAuthorName = (author: { firstName: string | null; lastName: string | null }) =>
    `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Anonymous';

  const notifications = [
    { id: 1, type: 'like', user: 'Sarah K.', content: 'liked your post about Quantum Mechanics', time: '5m ago', icon: Heart, color: 'text-red-400' },
    { id: 2, type: 'comment', user: 'Alex M.', content: 'replied to your comment: "Great explanation!"', time: '1h ago', icon: MessageCircle, color: 'text-blue-400' },
    { id: 3, type: 'system', user: 'Astrohub', content: 'Your research paper was featured in the Weekly Digest', time: '3h ago', icon: Award, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-8 lg:px-16 relative">
      <CosmicBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-4">
              Forum
            </h1>
            <p className="text-white/60 max-w-2xl text-lg font-body">
              Connect with researchers, engineers, and students from around the globe.
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
                Our community team is building the ultimate platform for space enthusiasts.
                Get ready for advanced discussions and collaboration tools.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-8 opacity-20 blur-sm grayscale pointer-events-none">
            
            {/* Left Sidebar */}
            <aside className="hidden lg:flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => { setActiveTab(item.label); setSelectedPost(null); }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.label 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={activeTab === item.label ? 'text-blue-400' : ''} />
                  <span className="font-body text-sm font-medium">{item.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="h-px bg-white/10 mx-4" />

          <div className="flex flex-col gap-2">
            {SECONDARY_NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => { setActiveTab(item.label); setSelectedPost(null); }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.label 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={activeTab === item.label ? 'text-blue-400' : ''} />
                  <span className="font-body text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && activeTab !== item.label && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {profile && (
            <div className="mt-auto p-4 liquid-glass rounded-2xl flex items-center gap-3">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="User" className="w-10 h-10 rounded-full border border-white/10" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-white/10">
                  <User size={20} className="text-blue-400" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{profile.firstName} {profile.lastName}</span>
                <span className="text-[10px] text-white/40 capitalize">{profile.role}</span>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex flex-col gap-8 relative">
          <AnimatePresence mode="wait">
          {selectedPost ? (
            /* Post Detail View */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <button onClick={() => setSelectedPost(null)} className="text-white/40 hover:text-white text-sm self-start">
                ← Back to Feed
              </button>
              <article className="liquid-glass rounded-3xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {selectedPost.author.photoURL ? (
                      <img src={selectedPost.author.photoURL} className="w-12 h-12 rounded-full border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center"><User size={20} className="text-blue-400" /></div>
                    )}
                    <div>
                      <span className="font-bold">{getAuthorName(selectedPost.author)}</span>
                      <div className="text-xs text-white/40">{formatTime(selectedPost.createdAt)}</div>
                    </div>
                  </div>
                  {profile && (profile.uid === selectedPost.author.id || profile.role === 'admin') && (
                    <button onClick={() => handleDeletePost(selectedPost.id)} className="text-red-400/60 hover:text-red-400 text-xs">Delete</button>
                  )}
                </div>
                <h2 className="text-2xl font-heading mb-4">{selectedPost.title}</h2>
                <p className="text-white/70 font-body mb-6 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                {selectedPost.code && (
                  <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm text-blue-300 mb-8 border border-white/5 overflow-x-auto">
                    <pre><code>{selectedPost.code}</code></pre>
                  </div>
                )}
              </article>

              {/* Comments */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-heading">Comments ({selectedPost.comments?.length || 0})</h3>
                {selectedPost.comments?.map(c => (
                  <div key={c.id} className="liquid-glass rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><User size={14} /></div>
                      <span className="text-sm font-bold">{getAuthorName(c.author)}</span>
                      <span className="text-xs text-white/30">{formatTime(c.createdAt)}</span>
                    </div>
                    <p className="text-white/70 text-sm pl-11">{c.content}</p>
                  </div>
                ))}
                {user && (
                  <div className="flex gap-3 items-end">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-white/30 resize-none min-h-[60px]"
                    />
                    <button onClick={handleAddComment} className="bg-white text-black rounded-full px-4 py-2 text-sm font-bold hover:bg-white/90">
                      <Send size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (activeTab === 'My Feed' || activeTab === 'Bookmarks') ? (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input 
                    type="text" 
                    placeholder={t.forum.searchPlaceholder} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* New Post Box — only show for logged-in users */}
                {user && (
                  <div className="liquid-glass rounded-3xl p-6 border border-white/5">
                    <input
                      type="text"
                      placeholder="Post title..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full bg-transparent border-none text-xl font-heading focus:outline-none mb-3"
                    />
                    <textarea 
                      placeholder={t.forum.postPlaceholder} 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full bg-transparent border-none resize-none text-lg font-body focus:outline-none mb-4 min-h-[80px]"
                    />
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <Plus size={20} />
                        </button>
                        <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <ImageIcon size={20} />
                        </button>
                      </div>
                      <button 
                        onClick={handlePost}
                        disabled={posting || !postTitle.trim() || !postContent.trim()}
                        className="bg-white text-black rounded-full px-6 py-2 text-sm font-bold flex items-center gap-2 hover:bg-white/90 transition-colors active:scale-95 disabled:opacity-50"
                      >
                        {posting ? <Loader2 size={16} className="animate-spin" /> : <>{t.forum.postButton} <Send size={16} /></>}
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-white/40" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-white/40 text-lg mb-2">No posts yet</p>
                    <p className="text-white/30 text-sm">{user ? 'Be the first to share something!' : 'Sign in to create a post.'}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {posts.map((post) => (
                      <motion.article 
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="liquid-glass rounded-3xl p-8 border border-white/5 cursor-pointer hover:border-white/10 transition-all"
                        onClick={() => handleOpenPost(post.id)}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            {post.author.photoURL ? (
                              <img src={post.author.photoURL} alt={getAuthorName(post.author)} className="w-12 h-12 rounded-full border border-white/10" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <User size={20} className="text-blue-400" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{getAuthorName(post.author)}</span>
                              </div>
                              <span className="text-xs text-white/40">{formatTime(post.createdAt)}</span>
                            </div>
                          </div>
                          <button className="p-2 text-white/40 hover:text-white rounded-lg transition-all" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal size={20} />
                          </button>
                        </div>

                        <h2 className="text-2xl font-heading mb-4">{post.title}</h2>
                        <p className="text-white/70 font-body mb-6 leading-relaxed line-clamp-3">
                          {post.content}
                        </p>

                        {post.code && (
                          <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm text-blue-300 mb-8 border border-white/5 overflow-x-auto">
                            <pre><code>{post.code}</code></pre>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center gap-8">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                              className={`flex items-center gap-2 transition-colors ${likedPosts.includes(post.id) ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
                            >
                              <Heart size={20} fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} />
                              <span className="text-sm font-medium">{post._count.favorites || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                              <MessageCircle size={20} />
                              <span className="text-sm font-medium">{post._count.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                              <Share2 size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'Notifications' ? (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-3xl font-heading mb-4">{t.forum.notifications}</h2>
                <div className="flex flex-col gap-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="liquid-glass rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer">
                      <div className={`p-3 rounded-xl bg-white/5 ${notif.color}`}>
                        <notif.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-bold">{notif.user}</span> {notif.content}
                        </p>
                        <span className="text-xs text-white/40">{notif.time}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8"
              >
                <h2 className="text-3xl font-heading mb-4">{t.forum.settings}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: User, label: 'Account', desc: 'Manage your profile and email' },
                    { icon: Lock, label: 'Security', desc: 'Password and two-factor auth' },
                    { icon: BellRing, label: 'Notifications', desc: 'Configure alert preferences' },
                    { icon: Eye, label: 'Privacy', desc: 'Control your visibility' },
                  ].map((item) => (
                    <button key={item.label} className="liquid-glass rounded-2xl p-6 border border-white/5 text-left hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 rounded-lg bg-white/5 text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-all">
                          <item.icon size={20} />
                        </div>
                        <span className="font-bold">{item.label}</span>
                      </div>
                      <p className="text-xs text-white/40">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-heading flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-400" />
              {t.forum.trending}
            </h3>
            <div className="flex flex-wrap gap-2">
              {['#astrophysics', '#mars2026', '#spacex', '#quantum', '#telescope'].map((tag) => (
                <button 
                  key={tag} 
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/60 hover:text-white transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-heading">{t.forum.official}</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Astrohub', role: 'Official Channel' },
                { name: 'Research Lab', role: 'Updates' },
                { name: 'Student Support', role: 'Help' },
              ].map((channel) => (
                <button 
                  key={channel.name} 
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Award size={20} className="text-blue-400" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{channel.name}</span>
                      <span className="text-[10px] text-white/40">{channel.role}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
