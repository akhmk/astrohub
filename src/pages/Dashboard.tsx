import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Search, ChevronLeft, ChevronRight, Activity, Layers,
  Clock, BookOpen, Loader2, ArrowRight,
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import CosmicBackground from '../components/CosmicBackground';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../hooks/useAuth';
import { ViewState } from '../App';
import { api, EnrolledCourse } from '../lib/api';

interface DashboardProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  onNavigate: (view: ViewState) => void;
  onStartCourse: (courseId: string) => void;
}

const ACTIVITY_DATA = [
  { name: 'Mon', current: 1.2, previous: 0.8 },
  { name: 'Tue', current: 2.5, previous: 1.5 },
  { name: 'Wed', current: 1.8, previous: 2.2 },
  { name: 'Thu', current: 3.5, previous: 2.8 },
  { name: 'Fri', current: 2.1, previous: 1.9 },
  { name: 'Sat', current: 4.2, previous: 3.1 },
  { name: 'Sun', current: 3.8, previous: 2.5 },
];

const COURSE_COLORS = ['bg-purple-500', 'bg-teal-500', 'bg-blue-500', 'bg-orange-500', 'bg-pink-500'];
const COURSE_ICONS = [Rocket, Activity, Layers, BookOpen, ArrowRight];

export default function Dashboard({ user, profile, onNavigate, onStartCourse }: DashboardProps) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const firstName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Cadet';

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    if (user) loadEnrolledCourses();
  }, [user]);

  const loadEnrolledCourses = async () => {
    setLoadingCourses(true);
    try { setEnrolledCourses(await api.getEnrolledCourses()); }
    catch { /* user not logged in or no enrollments */ }
    finally { setLoadingCourses(false); }
  };

  // Derive circle stats from real data
  const totalLessons = enrolledCourses.reduce((s, c) => s + c.totalLessonsCount, 0);
  const completedLessons = enrolledCourses.reduce((s, c) => s + c.completedLessonsCount, 0);

  const circleStats = [
    {
      label: 'Courses',
      count: `${enrolledCourses.length}`,
      total: 'enrolled',
      progress: Math.min(100, enrolledCourses.length * 20),
      color: '#8884d8',
    },
    {
      label: 'Lessons',
      count: `${completedLessons}/${totalLessons}`,
      total: 'completed',
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      color: '#2dd4bf',
    },
    {
      label: 'Progress',
      count: enrolledCourses.length > 0
        ? `${Math.round(enrolledCourses.reduce((s, c) => s + c.progress, 0) / enrolledCourses.length)}%`
        : '0%',
      total: 'avg completion',
      progress: enrolledCourses.length > 0
        ? Math.round(enrolledCourses.reduce((s, c) => s + c.progress, 0) / enrolledCourses.length)
        : 0,
      color: '#fbbf24',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-20 px-8 lg:px-16 relative">
      <CosmicBackground />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header — identical to original */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="text-white/40 text-sm">Welcome back, keep going!</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="Search for the course, task..."
              className="w-full bg-[#1c1c21] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/10 transition-colors"
              onFocus={() => onNavigate('courses')}
              readOnly
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">

            {/* Courses Section — now driven by real enrolled data */}
            <section className="bg-[#15151a] rounded-[2.5rem] p-8 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Course You're Taking</h2>
                <button
                  onClick={() => onNavigate('courses')}
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  View all
                </button>
              </div>

              {loadingCourses ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-white/20" size={24} />
                </div>
              ) : enrolledCourses.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen size={36} className="text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm mb-5">You haven't enrolled in any courses yet.</p>
                  <button
                    onClick={() => onNavigate('courses')}
                    className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:scale-[1.02] transition-transform"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {enrolledCourses.slice(0, 4).map((course, idx) => {
                    const ColorIcon = COURSE_ICONS[idx % COURSE_ICONS.length];
                    const color = COURSE_COLORS[idx % COURSE_COLORS.length];
                    return (
                      /* Same row layout as original hardcoded version */
                      <div key={course.id} className="flex flex-wrap md:flex-nowrap items-center gap-6 group hover:bg-white/[0.02] p-4 -m-4 rounded-3xl transition-colors">
                        <div className={`w-12 h-12 rounded-2xl ${color}/10 border border-white/10 flex items-center justify-center shrink-0`}>
                          <ColorIcon className={color.replace('bg-', 'text-')} size={24} />
                        </div>

                        <div className="min-w-[200px] flex-1">
                          <div className="font-bold text-base mb-1 line-clamp-1">{course.title}</div>
                          <div className="text-xs text-white/30 line-clamp-1">{course.description ?? 'No description'}</div>
                        </div>

                        <div className="hidden xl:block w-32">
                          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Lessons</div>
                          <div className="text-sm font-medium">{course.completedLessonsCount}/{course.totalLessonsCount}</div>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold">{course.progress}%</span>
                            <span className="text-[10px] font-mono text-white/30">{course.completedLessonsCount}/{course.totalLessonsCount}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              className={`h-full ${color} rounded-full`}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => onStartCourse(course.id)}
                          className="bg-[#212126] hover:bg-white hover:text-black transition-all px-6 py-2.5 rounded-xl text-sm font-bold shrink-0"
                        >
                          Continue
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Circular Stats Grid — same visual, now real data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {circleStats.map((stat) => (
                <div key={stat.label} className="bg-[#15151a] rounded-[2.5rem] p-8 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-white/40 text-sm mb-2">{stat.label}</div>
                    <div className="text-2xl font-bold mb-1">{stat.count}</div>
                    <div className="text-[10px] text-white/30 flex items-center gap-1 uppercase tracking-wider">
                      <Clock size={10} /> {stat.total}
                    </div>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        stroke={stat.color}
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={175.9}
                        initial={{ strokeDashoffset: 175.9 }}
                        animate={{ strokeDashoffset: 175.9 - (175.9 * stat.progress) / 100 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">
                      {stat.progress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity Chart — unchanged */}
            <section className="bg-[#15151a] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-xl font-bold mb-1">Your Activity</h2>
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold">
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <div className="w-2 h-2 rounded-full bg-current" /> Current week
                    </div>
                    <div className="flex items-center gap-1.5 text-white/20">
                      <div className="w-2 h-2 rounded-full bg-current" /> Previous week
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-sm">
                  <ChevronLeft size={16} className="text-white/40 cursor-pointer hover:text-white" />
                  <span className="font-medium">This week</span>
                  <ChevronRight size={16} className="text-white/40 cursor-pointer hover:text-white" />
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ACTIVITY_DATA}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} dy={10} />
                    <YAxis hide domain={[0, 5]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1c1c21', border: 'none', borderRadius: '12px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="previous" stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="current" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#15151a' }} activeDot={{ r: 6, fill: '#fff', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
