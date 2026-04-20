import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, ArrowLeft, MapPin, Loader2, Plus } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../hooks/useAuth';
import { api, Club } from '../lib/api';

const CITIES = ["All Cities", "Pavlodar", "Almaty", "Astana", "Shymkent", "Atyrau"];

export default function Clubs({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    setLoading(true);
    try {
      const res = await api.getClubs();
      setClubs(res.data);
    } catch (err) {
      console.error('Failed to load clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClub = async () => {
    if (!newClubName.trim()) return;
    try {
      await api.createClub({ name: newClubName, description: newClubDesc });
      setNewClubName('');
      setNewClubDesc('');
      setShowCreate(false);
      await loadClubs();
    } catch (err: any) {
      alert(`Failed to create club: ${err.message}`);
    }
  };

  const handleJoinClub = async (clubId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return alert('Please sign in to join a club');
    try {
      await api.joinClub(clubId);
      await loadClubs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Use hardcoded fallback when no clubs from API
  const fallbackClubs: Club[] = clubs.length > 0 ? clubs : [
    {
      id: 'fallback-1',
      name: "Juldyz club",
      description: "The first astronomical club for young explorers. Join us to study the stars, build telescopes, and share the wonder of the cosmos.",
      imageURL: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      createdAt: new Date().toISOString(),
      ownerId: '',
      _count: { memberships: 0, posts: 0 },
    },
  ];

  const filteredClubs = useMemo(() => {
    return fallbackClubs.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (club.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [fallbackClubs, searchQuery, selectedCity]);

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-16 px-6 lg:px-12 relative">
      <CosmicBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading tracking-tighter mb-1">
              Student Clubs
            </h1>
            <p className="text-white/60 font-body max-w-xl text-xs">
              Connect with local astronomy clubs and engineering teams.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Create Club Button */}
            {user && (
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="flex items-center gap-1 bg-white text-black rounded-full px-3 py-1.5 text-[10px] font-bold hover:bg-white/90 transition-colors"
              >
                <Plus size={12} /> Create Club
              </button>
            )}

            {/* City Filter */}
            <div className="relative group">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" size={12} />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-8 pr-7 text-[10px] focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer h-8"
              >
                {CITIES.map(city => (
                  <option key={city} value={city} className="bg-zinc-900 text-white">{city}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
              <input 
                type="text" 
                placeholder="Find a club..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-8 pr-5 text-[10px] focus:outline-none focus:border-white/30 transition-colors w-40 md:w-56 h-8"
              />
            </div>
          </div>
        </div>

        {/* Create Club Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="liquid-glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-heading text-lg mb-4">Create a New Club</h3>
                <input
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  placeholder="Club name..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-white/30"
                />
                <textarea
                  value={newClubDesc}
                  onChange={(e) => setNewClubDesc(e.target.value)}
                  placeholder="Description..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-white/30 resize-none h-20"
                />
                <button
                  onClick={handleCreateClub}
                  disabled={!newClubName.trim()}
                  className="bg-white text-black rounded-full px-6 py-2 text-sm font-bold hover:bg-white/90 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club, i) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="liquid-glass rounded-2xl overflow-hidden group border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={club.imageURL || "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800"}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                        Education
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-heading mb-1.5">{club.name}</h3>
                    <p className="text-white/50 text-xs font-body mb-5 line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-white/40 text-[10px]">
                        <Users size={12} />
                        {club._count.memberships} Members
                      </div>
                      <button
                        onClick={(e) => handleJoinClub(club.id, e)}
                        className="bg-white text-black rounded-full px-5 py-1.5 text-[10px] font-bold hover:bg-white/90 transition-colors"
                      >
                        Join Club
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-white/40 text-sm">No clubs found. Why not start one?</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
