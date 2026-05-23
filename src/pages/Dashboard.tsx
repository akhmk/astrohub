import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Search, ChevronLeft, ChevronRight, Activity, Layers, Clock,
  BookOpen, Zap, Flame, Trophy, Play, ArrowRight, Loader2, BarChart3,
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import CosmicBackground from '../components/CosmicBackground';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../hooks/useAuth';
import { ViewState } from '../App';
import { api, EnrolledCourse, UserStats } from '../lib/api';

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
const COURSE_ICONS = [Rocket, Activity, Layers, BookOpen, BarChart3];

export default function Dashboard({ user, profile, onNavigate, onStartCourse }: DashboardProps) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const firstName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Cadet';

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [coursesData, statsData] = await Promise.allSettled([
        api.getEnrolledCourses(),
        api.getUserStats(),
      ]);
      if (coursesData.status === 'fulfilled') setEnrolledCourses(coursesData.value);
      if (statsData.status === 'fulfilled') setStats(statsData.value);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoadingData(false);
    }
  };

  const xp = stats?.xp ?? 0;
  const streak = stats?.streak ?? 0;
  const totalLessons = stats?.totalLessonsCompleted ?? 0;
  const totalQuizzes = stats?.totalQuizzesPassed ?? 0;

  // Level calculation based on XP
  const xpLevel = Math.floor(xp / 100) + 1;
  const xpToNext = 100 - (xp % 100);

  const circleStats = [
    { label: 'Enrolled', count: String(stats?.enrolledCourses ?? enrolledCourses.length), total: 'courses', progress: Math.min(100, (stats?.enrolledCourses ?? enrolledCourses.length) * 10), color: '#8884d8' },
    { label: 'Lessons', count: String(totalLessons), total: 'completed', progress: Math.min(100, totalLessons * 5), color: '#2dd4bf' },
    { label: 'Quizzes', count: String(totalQuizzes), total: 'passed', progress: Math.min(100, totalQuizzes * 20), color: '#fbbf24' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-20 px-4 md:px-8 lg:px-16 relative">
      <CosmicBackground />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="text-white/40 text-sm">
              {streak > 0 ? `${streak}-day streak 🔥 Keep it going!` : 'Welcome back, keep going!'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* XP / Level pill */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-[#1c1c21] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-sm font-bold">{xp} XP</span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Lv. {xpLevel}</div>
            </div>

            {streak > 0 && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <Flame size={14} className="text-orange-400" />
                <span className="text-sm font-bold text-orange-300">{streak}</span>
              </div>
            )}

            <div className="relative flex-1 md:w-80 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input
                type="text"
                placeholder="Search for a course, topic…"
                className="w-full bg-[#1c1c21] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-white/10 transition-colors"
                onFocus={() => onNavigate('courses')}
                readOnly
              />
            </div>
          </div>
        </header>

        {/* Quick XP progress bar (mobile) */}
        <div className="md:hidden mb-8 bg-[#15151a] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-sm font-bold">{xp} XP · Lv.{xpLevel}</span>
          </div>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400/60 rounded-full" style={{ width: `${((xp % 100) / 100) * 100}%` }} />
          </div>
          <span className="text-[10px] text-white/30">{xpToNext} to next</span>
        </div>

        <div className="grid grid-cols-1 gap-8">

          {/* Enrolled Courses */}
          <section className="bg-[#15151a] rounded-[2.5rem] p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Continue Learning</h2>
              <button
                onClick={() => onNavigate('courses')}
                className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>

            {loadingData ? (
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
                    <div
                      key={course.id}
                      className="flex flex-wrap md:flex-nowrap items-center gap-5 group hover:bg-white/[0.02] p-3 -m-3 rounded-3xl transition-colors cursor-pointer"
                      onClick={() => onStartCourse(course.id)}
                    >
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl ${color}/10 border border-white/5 flex items-center justify-center shrink-0`}>
                        <ColorIcon className={color.replace('bg-', 'text-')} size={22} />
                      </div>

                      {/* Name */}
                      <div className="min-w-[180px] flex-1">
                        <div className="font-bold text-sm mb-0.5 line-clamp-1">{course.title}</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-wider">{course.category ?? 'Astronomy'}</div>
                      </div>

                      {/* Duration */}
                      {course.estimatedHours && (
                        <div className="hidden xl:block w-28 shrink-0">
                          <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Duration</div>
                          <div className="text-sm font-medium">{course.estimatedHours}h total</div>
                        </div>
                      )}

                      {/* Progress */}
                      <div className="flex-1 min-w-[140px]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-bold">{course.progress}%</span>
                          <span className="text-[10px] font-mono text-white/30">
                            {course.completedLessonsCount}/{course.totalLessonsCount}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full ${color} rounded-full`}
                          />
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onStartCourse(course.id); }}
                        className="bg-[#212126] hover:bg-white hover:text-black transition-all px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shrink-0"
                      >
                        <Play size={13} fill="currentColor" /> Continue
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Stat circles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {circleStats.map((stat) => (
              <div key={stat.label} className="bg-[#15151a] rounded-[2.5rem] p-8 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-white/40 text-sm mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold mb-0.5">{stat.count}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">{stat.total}</div>
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
                      animate={{ strokeDashoffset: 175.9 - (175.9 * Math.min(stat.progress, 100)) / 100 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">
                    {Math.min(stat.progress, 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* XP Level card */}
          <div className="hidden md:block bg-[#15151a] rounded-[2.5rem] p-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Your Progress</h2>
                <p className="text-white/30 text-xs">Complete lessons and pass quizzes to earn XP</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold">{xp} XP</div>
                  <div className="text-[10px] text-white/30">Level {xpLevel}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Trophy size={20} className="text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((xp % 100) / 100) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.3)]"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/20">
              <span>Lv. {xpLevel}</span>
              <span>{xpToNext} XP to level {xpLevel + 1}</span>
            </div>
          </div>

          {/* Activity Chart */}
          <section className="bg-[#15151a] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-bold mb-1">Study Activity</h2>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <div className="w-2 h-2 rounded-full bg-current" /> This week
                  </div>
                  <div className="flex items-center gap-1.5 text-white/20">
                    <div className="w-2 h-2 rounded-full bg-current" /> Last week
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-sm">
                <ChevronLeft size={16} className="text-white/40 cursor-pointer hover:text-white" />
                <span className="font-medium text-sm">This week</span>
                <ChevronRight size={16} className="text-white/40 cursor-pointer hover:text-white" />
              </div>
            </div>

            <div className="h-[260px] w-full">
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
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1c1c21', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="previous" stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth={2} dot={false} />
                  <Area
                    type="monotone" dataKey="current" stroke="#3b82f6" fillOpacity={1}
                    fill="url(#colorCurrent)" strokeWidth={3}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#15151a' }}
                    activeDot={{ r: 6, fill: '#fff', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Browse Courses', icon: BookOpen, view: 'courses' as ViewState, color: 'blue' },
              { label: 'Forum', icon: Activity, view: 'forum' as ViewState, color: 'purple' },
              { label: 'Roadmaps', icon: Layers, view: 'roadmaps' as ViewState, color: 'teal' },
              { label: 'Blog', icon: Rocket, view: 'blog' as ViewState, color: 'orange' },
            ].map(({ label, icon: Icon, view, color }) => (
              <button
                key={label}
                onClick={() => onNavigate(view)}
                className="bg-[#15151a] hover:bg-[#1c1c21] rounded-2xl p-5 border border-white/5 text-left transition-all group"
              >
                <Icon size={20} className={`text-${color}-400 mb-3`} />
                <div className="text-sm font-bold">{label}</div>
                <ArrowRight size={14} className="text-white/20 group-hover:text-white/60 mt-2 transition-colors" />
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
