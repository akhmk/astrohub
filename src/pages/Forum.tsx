import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Home, 
  Users, 
  MessageSquare, 
  Bookmark, 
  MoreHorizontal, 
  Bell, 
  Settings, 
  Plus, 
  Image as ImageIcon, 
  Send,
  TrendingUp,
  Award,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';

const NAV_ITEMS = [
  { icon: Home, label: 'My Feed', active: true },
  { icon: Users, label: 'Groups' },
  { icon: MessageSquare, label: 'Messages', badge: 1 },
  { icon: Bookmark, label: 'Bookmarks' },
  { icon: MoreHorizontal, label: 'More' },
];

const SECONDARY_NAV = [
  { icon: Bell, label: 'Notifications', badge: 3 },
  { icon: Settings, label: 'Settings' },
];

const POSTS = [
  {
    id: 1,
    author: 'tmhao2005',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    time: '2 hours ago',
    title: 'TypeScript useful advanced types',
    content: 'As the title says, here are all the useful types that I\'m using every day or create new types on top of them. I thought it might be handy for some people so I just share here and this will be updated moving forward:',
    code: `type ReduceItems<Arr extends ReadonlyArray<any>, Result extends any[]> = [] => Arr extends []
  ? Result
  : Arr extends [infer H]
  ? H extends {items: ReadonlyArray<MenuItem>}
    ? [...Result, ...H["items"]]
    : never
  : Arr extends readonly [infer H, ...infer Tail]
  ? Tail extends ReadonlyArray<any>
    ? H extends {items: ReadonlyArray<MenuItem>}
      ? ReduceItems<Tail, [...Result, ...H["items"]]>
      : never
    : never
  : never;`,
    likes: 124,
    comments: 42,
    shares: 12
  }
];

export default function Forum() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8 lg:px-16 relative">
      {/* Space Background */}
      <CosmicBackground />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-8 relative z-10">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  item.active 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={item.active ? 'text-blue-400' : ''} />
                  <span className="font-body text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/10 mx-4" />

          <div className="flex flex-col gap-2">
            {SECONDARY_NAV.map((item) => (
              <button
                key={item.label}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-body text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto p-4 liquid-glass rounded-2xl flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
              alt="User" 
              className="w-10 h-10 rounded-full border border-white/10"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Robert J.</span>
              <span className="text-[10px] text-white/40">Pro Member</span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search discussions, topics, or people..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* New Post Box */}
          <div className="liquid-glass rounded-3xl p-6 border border-white/5">
            <textarea 
              placeholder="Start a new discussion..." 
              className="w-full bg-transparent border-none resize-none text-lg font-body focus:outline-none mb-4 min-h-[100px]"
            />
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <Plus size={20} />
                </button>
                <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <ImageIcon size={20} />
                </button>
                <button className="text-xs font-medium text-white/40 hover:text-white transition-colors">
                  More
                </button>
              </div>
              <button className="bg-white text-black rounded-full px-6 py-2 text-sm font-bold flex items-center gap-2 hover:bg-white/90 transition-colors">
                Post <Send size={16} />
              </button>
            </div>
          </div>

          {/* Feed Filters */}
          <div className="flex items-center gap-6 px-2">
            <button className="text-sm font-bold text-white border-b-2 border-blue-500 pb-2">Following</button>
            <button className="text-sm font-medium text-white/40 hover:text-white pb-2 transition-colors">Featured</button>
            <button className="text-sm font-medium text-white/40 hover:text-white pb-2 transition-colors">Rising</button>
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-6">
            {POSTS.map((post) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass rounded-3xl p-8 border border-white/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-white/10" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{post.author}</span>
                        <Award size={14} className="text-yellow-500" />
                      </div>
                      <span className="text-xs text-white/40">{post.time}</span>
                    </div>
                  </div>
                  <button className="p-2 text-white/40 hover:text-white rounded-lg transition-all">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <h2 className="text-2xl font-heading italic mb-4">{post.title}</h2>
                <p className="text-white/70 font-body mb-6 leading-relaxed">
                  {post.content}
                </p>

                {post.code && (
                  <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm text-blue-300 mb-8 border border-white/5 overflow-x-auto">
                    <pre><code>{post.code}</code></pre>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors">
                      <Heart size={20} />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors">
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors">
                      <Share2 size={20} />
                      <span className="text-sm font-medium">{post.shares}</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex flex-col gap-8">
          {/* Intro Card */}
          <div className="liquid-glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <h3 className="text-lg font-heading italic mb-2 flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              Intro
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Boost your learning with our premium features and community.
            </p>
            <button className="w-full bg-white text-black rounded-xl py-3 text-sm font-bold hover:bg-white/90 transition-colors">
              Upgrade Now
            </button>
          </div>

          {/* Trending */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-heading italic flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-400" />
              Trending
            </h3>
            <div className="flex flex-wrap gap-2">
              {['#astrophysics', '#mars2026', '#spacex', '#quantum', '#telescope'].map((tag) => (
                <button key={tag} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/60 hover:text-white transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Official Channels */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-heading italic">Official</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Cosmos Academy', role: 'Official Channel' },
                { name: 'Research Lab', role: 'Updates' },
                { name: 'Student Support', role: 'Help' },
              ].map((channel) => (
                <button key={channel.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group">
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
  );
}
