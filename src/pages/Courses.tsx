import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, Clock, Users, ArrowRight, BookOpen, CheckCircle,
  Loader2, Plus, Bookmark, BookmarkCheck, Filter, X, ChevronDown, Play,
  Layers, Zap,
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { api, CourseSummary, Course, Difficulty } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

// ─── Constants ────────────────────────────────────────────────────

const CATEGORIES = ['Astronomy', 'Astrophysics', 'Space Technology', 'Physics', 'Mathematics', 'Engineering', 'Aerospace'];
const LEVELS: { value: Difficulty; label: string }[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];
const LEVEL_COLORS: Record<Difficulty, string> = {
  BEGINNER: 'text-green-400 bg-green-500/10 border-green-500/20',
  INTERMEDIATE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  ADVANCED: 'text-red-400 bg-red-500/10 border-red-500/20',
};

// ─── Course Card ──────────────────────────────────────────────────

function CourseCard({
  course,
  onClick,
  onBookmark,
  index,
}: {
  key?: React.Key;
  course: CourseSummary;
  onClick: () => void;
  onBookmark: (e: React.MouseEvent) => void | Promise<void>;
  index: number;
}) {
  const totalLessons = course._count.lessons;
  const done = course.completedLessonsCount ?? 0;
  const progress = totalLessons > 0 && done > 0 ? Math.round((done / totalLessons) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="liquid-glass rounded-3xl overflow-hidden group hover:bg-white/[0.02] transition-all duration-300 cursor-pointer border border-white/5 hover:border-white/10 flex flex-col"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="aspect-[16/10] overflow-hidden relative shrink-0">
        <img
          src={course.imageURL || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Bookmark button */}
        <button
          onClick={onBookmark}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all"
        >
          {course.isBookmarked
            ? <BookmarkCheck size={14} className="text-blue-400" />
            : <Bookmark size={14} className="text-white/60" />}
        </button>

        {/* Level badge */}
        <div className={`absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${LEVEL_COLORS[course.level]} backdrop-blur-sm`}>
          {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
        </div>

        {/* Enrolled badge */}
        {course.isEnrolled && (
          <div className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 backdrop-blur-sm">
            Enrolled
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        {course.category && (
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/30 mb-2">{course.category}</span>
        )}
        <h3 className="text-lg font-heading mb-1 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="text-white/40 text-xs mb-4 line-clamp-1">{course.subtitle}</p>
        )}
        {!course.subtitle && course.description && (
          <p className="text-white/40 text-xs mb-4 line-clamp-2">{course.description}</p>
        )}

        {/* Progress bar (enrolled) */}
        {course.isEnrolled && totalLessons > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 text-white/30 text-[10px]">
            <div className="flex items-center gap-1">
              <BookOpen size={11} />
              {totalLessons} lessons
            </div>
            <div className="flex items-center gap-1">
              <Users size={11} />
              {course._count.enrollments}
            </div>
            {course.estimatedHours && (
              <div className="flex items-center gap-1">
                <Clock size={11} />
                {course.estimatedHours}h
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-200">
            <ArrowRight size={15} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function Courses({
  onBack,
  onStartCourse,
}: {
  onBack: () => void;
  onStartCourse: (courseId: string) => void;
}) {
  const { user, profile } = useAuth();

  // List state
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [level, setLevel] = useState<Difficulty | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Course detail state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Course | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Create form state
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newLevel, setNewLevel] = useState<Difficulty>('BEGINNER');
  const [creating, setCreating] = useState(false);

  const canCreate = profile?.role === 'admin';

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadCourses();
  }, [debouncedSearch, category, level]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getCourses({
        search: debouncedSearch || undefined,
        category: category || undefined,
        level: (level as Difficulty) || undefined,
      });
      setCourses(res.data);
    } catch (e) {
      console.error('Failed to load courses', e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, level]);

  const loadDetail = async (id: string) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const data = await api.getCourse(id);
      setDetail(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    loadDetail(id);
  };

  const handleBack = () => {
    setSelectedId(null);
    setDetail(null);
  };

  const handleEnroll = async () => {
    if (!selectedId || enrolling) return;
    setEnrolling(true);
    try {
      await api.enrollCourse(selectedId);
      loadDetail(selectedId);
      loadCourses();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await api.toggleBookmark(courseId);
      setCourses(prev => prev.map(c =>
        c.id === courseId ? { ...c, isBookmarked: !c.isBookmarked } : c
      ));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || creating) return;
    setCreating(true);
    try {
      await api.createCourse({
        title: newTitle,
        description: newDesc || undefined,
        category: newCategory || undefined,
        level: newLevel,
      });
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
      setNewCategory('');
      setNewLevel('BEGINNER');
      loadCourses();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreating(false);
    }
  };

  const activeFiltersCount = [category, level].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8 lg:px-16 relative">
      <CosmicBackground />

      <AnimatePresence mode="wait">

        {/* ── Course List ── */}
        {!selectedId && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 relative z-10">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group text-sm"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Home
              </button>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                  <h1 className="text-5xl md:text-6xl font-heading tracking-tighter mb-3">
                    Our Trajectories
                  </h1>
                  <p className="text-white/40 font-body max-w-lg text-sm leading-relaxed">
                    From foundational astronomy to advanced orbital mechanics. Choose your path and master the secrets of the cosmos.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {canCreate && (
                    <button
                      onClick={() => setShowCreate(!showCreate)}
                      className="bg-white text-black px-4 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <Plus size={15} /> New Course
                    </button>
                  )}

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                      activeFiltersCount > 0
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                        : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <Filter size={14} />
                    Filter
                    {activeFiltersCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
                    <input
                      type="text"
                      placeholder="Search courses…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors w-56"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Filter panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 p-6 liquid-glass rounded-2xl border border-white/5 flex flex-wrap gap-6">
                      {/* Category */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-3 font-bold">Category</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setCategory('')}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${!category ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/40 hover:text-white'}`}
                          >
                            All
                          </button>
                          {CATEGORIES.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setCategory(category === cat ? '' : cat)}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${category === cat ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'border-white/5 text-white/40 hover:text-white'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Level */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-3 font-bold">Level</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLevel('')}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${!level ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/40 hover:text-white'}`}
                          >
                            All
                          </button>
                          {LEVELS.map(({ value, label }) => (
                            <button
                              key={value}
                              onClick={() => setLevel(level === value ? '' : value)}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${level === value ? `${LEVEL_COLORS[value]}` : 'border-white/5 text-white/40 hover:text-white'}`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {activeFiltersCount > 0 && (
                        <button
                          onClick={() => { setCategory(''); setLevel(''); }}
                          className="self-end text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <X size={12} /> Clear filters
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Create form */}
            <AnimatePresence>
              {showCreate && canCreate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden max-w-7xl mx-auto mb-8 relative z-10"
                >
                  <div className="liquid-glass p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-heading mb-5">Create New Course</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="Course title…"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                      />
                      <input
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        placeholder="Category (e.g. Astronomy)…"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <textarea
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      placeholder="Course description…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm mb-4 h-20 resize-none focus:outline-none focus:border-white/30"
                    />
                    <div className="flex items-center gap-4">
                      <select
                        value={newLevel}
                        onChange={e => setNewLevel(e.target.value as Difficulty)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      >
                        {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                      <button
                        onClick={handleCreate}
                        disabled={!newTitle.trim() || creating}
                        className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-40"
                      >
                        {creating ? 'Creating…' : 'Create'}
                      </button>
                      <button
                        onClick={() => setShowCreate(false)}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Course grid */}
            {loading ? (
              <div className="flex justify-center py-20 relative z-10">
                <Loader2 className="animate-spin text-white/30" size={32} />
              </div>
            ) : courses.length === 0 ? (
              <div className="max-w-7xl mx-auto relative z-10 text-center py-24">
                <BookOpen size={48} className="text-white/10 mx-auto mb-4" />
                <h3 className="text-xl font-heading mb-2 text-white/40">No courses found</h3>
                <p className="text-white/20 text-sm">
                  {search || category || level ? 'Try adjusting your filters.' : 'No courses available yet.'}
                </p>
                {(search || category || level) && (
                  <button
                    onClick={() => { setSearch(''); setCategory(''); setLevel(''); }}
                    className="mt-6 text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {courses.map((course, i) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={i}
                    onClick={() => handleSelect(course.id)}
                    onBookmark={(e) => handleBookmark(e, course.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Course Detail ── */}
        {selectedId && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-7xl mx-auto relative z-10"
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group text-sm"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Courses
            </button>

            {detailLoading || !detail ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-white/30" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">

                {/* Left column */}
                <div>
                  {/* Breadcrumb */}
                  {detail.category && (
                    <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
                      <Layers size={12} />
                      <span>{detail.category}</span>
                      <span>·</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${LEVEL_COLORS[detail.level]}`}>
                        {detail.level.charAt(0) + detail.level.slice(1).toLowerCase()}
                      </span>
                    </div>
                  )}

                  <h1 className="text-4xl md:text-5xl font-heading tracking-tighter mb-3">{detail.title}</h1>
                  {detail.subtitle && (
                    <p className="text-white/50 text-lg font-body mb-6">{detail.subtitle}</p>
                  )}
                  <p className="text-white/40 text-sm font-body mb-10 max-w-2xl leading-relaxed">
                    {detail.description}
                  </p>

                  {/* Tags */}
                  {detail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                      {detail.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/5 text-white/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* What you'll learn */}
                  {detail.outcomes.length > 0 && (
                    <div className="liquid-glass rounded-2xl p-6 border border-white/5 mb-8">
                      <h3 className="text-base font-heading mb-4">What you'll learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {detail.outcomes.map((o, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-white/60">{o}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Course Curriculum */}
                  <div className="mb-8">
                    <h2 className="text-xl font-heading mb-6">Course Curriculum</h2>

                    {detail.modules.length > 0 ? (
                      <div className="space-y-4">
                        {detail.modules.map((mod, modIdx) => (
                          <div key={mod.id} className="liquid-glass rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-5 flex items-center gap-3 border-b border-white/5">
                              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-white/40 border border-white/10 shrink-0">
                                {modIdx + 1}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold">{mod.title}</h4>
                                <p className="text-[10px] text-white/30 mt-0.5">{mod.lessons.length} lessons</p>
                              </div>
                            </div>
                            <div className="divide-y divide-white/5">
                              {mod.lessons.map((lesson, lIdx) => {
                                const completed = detail.completedLessons.includes(lesson.id);
                                return (
                                  <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                                    <span className="text-[10px] text-white/20 font-mono w-5 shrink-0">{lIdx + 1}</span>
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/30 shrink-0">
                                      {lesson.lessonType === 'VIDEO' ? <Play size={10} /> : <BookOpen size={10} />}
                                    </div>
                                    <span className="text-sm text-white/60 flex-1 truncate">{lesson.title}</span>
                                    {lesson.duration && (
                                      <span className="text-[10px] text-white/20 shrink-0 flex items-center gap-1">
                                        <Clock size={10} />{lesson.duration}m
                                      </span>
                                    )}
                                    {completed && <CheckCircle size={13} className="text-green-400 shrink-0" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : detail.lessons.length > 0 ? (
                      <div className="liquid-glass rounded-2xl border border-white/5 overflow-hidden">
                        <div className="divide-y divide-white/5">
                          {detail.lessons.map((lesson, lIdx) => {
                            const completed = detail.completedLessons.includes(lesson.id);
                            return (
                              <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                                <span className="text-[10px] text-white/20 font-mono w-5 shrink-0">{lIdx + 1}</span>
                                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/30 shrink-0">
                                  <BookOpen size={10} />
                                </div>
                                <span className="text-sm text-white/60 flex-1 truncate">{lesson.title}</span>
                                {completed && <CheckCircle size={13} className="text-green-400 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/30 text-sm">No lessons added yet.</p>
                    )}
                  </div>

                  {/* Prerequisites */}
                  {detail.prerequisites.length > 0 && (
                    <div className="liquid-glass rounded-2xl p-6 border border-white/5">
                      <h3 className="text-base font-heading mb-4">Prerequisites</h3>
                      <ul className="space-y-2">
                        {detail.prerequisites.map((p, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                            <ChevronDown size={13} className="text-white/20 shrink-0 mt-0.5 rotate-[-90deg]" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right sidebar */}
                <aside className="sticky top-24">
                  <div className="liquid-glass rounded-3xl overflow-hidden border border-white/10">
                    <img
                      src={detail.imageURL || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800'}
                      alt=""
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-6">
                      {/* Meta */}
                      <div className="space-y-3 mb-6 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white/30 text-xs">Instructor</span>
                          <span className="text-white text-sm font-medium">
                            {[detail.author?.firstName, detail.author?.lastName].filter(Boolean).join(' ') || 'AstroHub'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/30 text-xs">Students</span>
                          <span className="text-white text-sm font-medium">{detail._count.enrollments.toLocaleString()}</span>
                        </div>
                        {detail.estimatedHours && (
                          <div className="flex items-center justify-between">
                            <span className="text-white/30 text-xs">Duration</span>
                            <span className="text-white text-sm font-medium">{detail.estimatedHours} hours</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-white/30 text-xs">Level</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${LEVEL_COLORS[detail.level]}`}>
                            {detail.level.charAt(0) + detail.level.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      {detail.isEnrolled && (() => {
                        const total = detail._count.lessons;
                        const done = detail.completedLessons.length;
                        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                        return (
                          <div className="mb-6">
                            <div className="flex justify-between text-xs text-white/30 mb-2">
                              <span>Progress</span>
                              <span className="text-white font-bold">{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-white/20 mt-1.5">{done}/{total} lessons complete</p>
                          </div>
                        );
                      })()}

                      {/* CTA buttons */}
                      {detail.isEnrolled ? (
                        <button
                          onClick={() => onStartCourse(detail.id)}
                          className="w-full bg-white text-black rounded-full py-4 text-sm font-bold hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Play size={16} fill="currentColor" />
                          Continue Learning
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="w-full bg-white text-black rounded-full py-4 text-sm font-bold hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-60"
                          >
                            {enrolling ? 'Enrolling…' : 'Enroll Free'}
                          </button>
                          {user && (
                            <button
                              onClick={async () => {
                                await api.enrollCourse(detail.id);
                                onStartCourse(detail.id);
                              }}
                              className="w-full border border-white/10 rounded-full py-3 text-sm font-medium text-white/60 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
                            >
                              <Zap size={14} />
                              Enroll &amp; Start Now
                            </button>
                          )}
                        </div>
                      )}

                      {/* Bookmark */}
                      {user && (
                        <button
                          onClick={(e) => handleBookmark(e, detail.id)}
                          className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white transition-colors py-2"
                        >
                          {detail.isBookmarked
                            ? <><BookmarkCheck size={13} className="text-blue-400" /> Bookmarked</>
                            : <><Bookmark size={13} /> Save for Later</>}
                        </button>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
