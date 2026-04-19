import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, ArrowLeft, MapPin } from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const CLUBS = [
  {
    id: 1,
    name: "Juldyz club",
    description: "The first astronomical club for young explorers. Join us to study the stars, build telescopes, and share the wonder of the cosmos.",
    members: 0,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    category: "Education",
    city: "Pavlodar",
    address: "Tkacheva 16/2",
    location: [52.2514, 76.9535] as [number, number] // Pavlodar, Tkacheva 16/2 (Usolsky, near shore)
  }
];

const CITIES = ["All Cities", "Pavlodar", "Almaty", "Astana", "Shymkent", "Atyrau"];

export default function Clubs({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredClubs = useMemo(() => {
    return CLUBS.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          club.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === "All Cities" || club.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedCity]);

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
              Connect with local astronomy clubs and engineering teams in your city.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${viewMode === 'map' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
              >
                Map
              </button>
            </div>

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

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                      <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                          {club.category}
                        </span>
                        <span className="bg-blue-500/60 backdrop-blur-md text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                          <MapPin size={10} />
                          {club.city}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-heading mb-1.5">{club.name}</h3>
                      <div className="flex items-center gap-1.5 text-white/40 text-[10px] mb-3">
                        <MapPin size={12} />
                        {club.address}
                      </div>
                      <p className="text-white/50 text-xs font-body mb-5 line-clamp-2">
                        {club.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-white/40 text-[10px]">
                          <Users size={12} />
                          {club.members} Members
                        </div>
                        <button className="bg-white text-black rounded-full px-5 py-1.5 text-[10px] font-bold hover:bg-white/90 transition-colors">
                          Join Club
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-white/40 text-sm">No clubs found in this city yet. Why not start one?</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-[500px] rounded-2xl overflow-hidden border border-white/10 relative z-0"
            >
              <MapContainer 
                center={filteredClubs.length > 0 ? filteredClubs[0].location : [52.2514, 76.9535]} 
                zoom={15} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', background: '#000' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {filteredClubs.map(club => (
                  <Marker key={club.id} position={club.location}>
                    <Popup>
                      <div className="text-black p-1">
                        <h4 className="font-bold text-sm">{club.name}</h4>
                        <p className="text-[10px] text-gray-600">{club.address}, {club.city}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
