import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicBackground from '../components/CosmicBackground';
import { ArrowLeft, Search, Filter, Clock, Users, Star, ArrowRight, BookOpen, CheckCircle, PlayCircle, Loader2, Plus } from 'lucide-react';
import { api, Course, Lesson } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function Courses({ onBack, onStartCourse }: { onBack: () => void, onStartCourse: (courseId: string) => void }) {
  const { user, profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Lesson creation state
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await api.getCourse(id);
      setSelectedCourseDetail(data);
    } catch (err) {
      console.error('Failed to load course details', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelectCourse = (id: string) => {
    setSelectedCourseId(id);
    loadCourseDetail(id);
  };

  const handleCreateCourse = async () => {
    if (!newTitle.trim()) return;
    try {
      await api.createCourse({ title: newTitle, description: newDesc });
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
      loadCourses();
    } catch (err: any) {
      alert(`Failed to create course: ${err.message}`);
    }
  };

  const handleCreateLesson = async () => {
    if (!newLessonTitle.trim() || !selectedCourseId) return;
    try {
      await api.createLesson(selectedCourseId, {
        title: newLessonTitle,
        videoURL: newLessonVideo,
        order: selectedCourseDetail?.lessons?.length || 0,
      });
      setShowAddLesson(false);
      setNewLessonTitle('');
      setNewLessonVideo('');
      loadCourseDetail(selectedCourseId);
    } catch (err: any) {
      alert(`Failed to add lesson: ${err.message}`);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourseId) return;
    try {
      await api.enrollCourse(selectedCourseId);
      loadCourseDetail(selectedCourseId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCompleteLesson = async (lessonId: string) => {
    try {
      await api.finishLesson(lessonId);
      if (selectedCourseId) loadCourseDetail(selectedCourseId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreate = profile?.role === 'admin' || profile?.role === 'teacher' as any;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-8 lg:px-16 relative">
      <CosmicBackground />

      <AnimatePresence mode="wait">
        {!selectedCourseId ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 relative z-10">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </button>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h1 className="text-5xl md:text-6xl font-heading tracking-tighter mb-4">
                    Our Trajectories
                  </h1>
                  <p className="text-white/60 font-body max-w-xl">
                    From foundational astronomy to advanced orbital mechanics. Choose your path and master the secrets of the cosmos.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {canCreate && (
                    <button
                      onClick={() => setShowCreate(!showCreate)}
                      className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2"
                    >
                      <Plus size={16} /> New Course
                    </button>
                  )}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search courses..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-6 text-sm focus:outline-none focus:border-white/30 transition-colors w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Create course form */}
            {showCreate && (
              <div className="max-w-7xl mx-auto mb-8 relative z-10 liquid-glass p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-heading mb-4">Create New Course</h3>
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Course title..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-3"
                />
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Course description..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 h-24"
                />
                <button
                  onClick={handleCreateCourse}
                  className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm"
                >
                  Create
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20 relative z-10"><Loader2 className="animate-spin text-white/40" size={32} /></div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {filteredCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="liquid-glass rounded-3xl overflow-hidden group hover:bg-white/[0.02] transition-colors cursor-pointer border border-white/5"
                    onClick={() => handleSelectCourse(course.id)}
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={course.imageURL || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800"} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-heading mb-2 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-white/50 text-sm font-body mb-6 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-4 text-white/40 text-xs">
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={14} />
                            {course._count.lessons} Lessons
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            {course._count.enrollments} Students
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-7xl mx-auto relative z-10"
          >
            <button 
              onClick={() => setSelectedCourseId(null)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Trajectories
            </button>

            {detailLoading || !selectedCourseDetail ? (
               <div className="flex justify-center py-20"><Loader2 className="animate-spin text-white/40" size={32} /></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
                <div>
                  <h1 className="text-4xl md:text-6xl font-heading tracking-tighter mb-4">
                    {selectedCourseDetail.title}
                  </h1>
                  <p className="text-white/60 text-lg font-body mb-12 max-w-2xl leading-relaxed">
                    {selectedCourseDetail.description}
                  </p>

                  <div className="space-y-12">
                    <div className="relative pl-8 border-l border-white/10">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      
                      <div className="mb-8 flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-heading mb-3">Course Curriculum</h2>
                          <p className="text-white/40 text-sm font-body">Complete all lessons to earn your certification.</p>
                        </div>
                        {canCreate && (
                          <button
                            onClick={() => setShowAddLesson(!showAddLesson)}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm transition-colors"
                          >
                            + Add Lesson
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {showAddLesson && canCreate && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-8"
                          >
                            <div className="liquid-glass rounded-2xl p-6 border border-white/10">
                              <h3 className="text-lg font-heading mb-4">New Lesson</h3>
                              <input
                                value={newLessonTitle}
                                onChange={e => setNewLessonTitle(e.target.value)}
                                placeholder="Lesson title..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-3 text-sm"
                              />
                              <input
                                value={newLessonVideo}
                                onChange={e => setNewLessonVideo(e.target.value)}
                                placeholder="Video URL (optional)..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-4 text-sm"
                              />
                              <button
                                onClick={handleCreateLesson}
                                className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-[1.02] transition-transform"
                              >
                                Add
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCourseDetail.lessons?.map((lesson: Lesson) => {
                            const isCompleted = selectedCourseDetail.completedLessons?.includes(lesson.id);
                            return (
                              <div key={lesson.id} className="liquid-glass rounded-2xl p-4 flex items-center justify-between group hover:bg-blue-500/5 cursor-pointer border border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-white/5 text-blue-400">
                                    <PlayCircle size={18} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium group-hover:text-blue-400 transition-colors">{lesson.title}</div>
                                  </div>
                                </div>
                                {isCompleted ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : selectedCourseDetail.isEnrolled ? (
                                  <button 
                                    onClick={() => handleCompleteLesson(lesson.id)}
                                    className="text-[10px] uppercase font-bold text-white/40 hover:text-white px-2 py-1 rounded bg-white/5"
                                  >
                                    Mark Done
                                  </button>
                                ) : null}
                              </div>
                            )
                          })}
                          {selectedCourseDetail.lessons?.length === 0 && (
                            <p className="text-white/40 text-sm">No lessons available yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <aside className="sticky top-32">
                  <div className="liquid-glass rounded-3xl overflow-hidden border border-white/10">
                    <img 
                      src={selectedCourseDetail.imageURL || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800"} 
                      alt="" 
                      className="w-full aspect-video object-cover" 
                    />
                    <div className="p-6">
                      <div className="space-y-4 mb-8 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white/40">Instructor</span>
                          <span className="text-white font-medium">{selectedCourseDetail.author?.firstName || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/40">Students</span>
                          <span className="text-white font-medium">{selectedCourseDetail._count.enrollments}</span>
                        </div>
                      </div>
                      
                      {selectedCourseDetail.isEnrolled ? (
                        <>
                          {(() => {
                            const total = selectedCourseDetail.lessons?.length || 1;
                            const done = selectedCourseDetail.completedLessons?.length || 0;
                            const progress = Math.round((done / total) * 100);
                            return (
                              <>
                                <div className="mb-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }} />
                                </div>
                                <div className="flex items-center justify-between text-xs text-white/40 mb-6">
                                  <span>Course Progress</span>
                                  <span className="text-white font-bold">{progress}%</span>
                                </div>
                              </>
                            );
                          })()}
                          <button
                            onClick={() => onStartCourse(selectedCourseDetail.id)}
                            className="w-full bg-white text-black rounded-full py-4 text-sm font-bold hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                          >
                            Continue Learning
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEnroll}
                          className="w-full bg-white text-black rounded-full py-4 text-sm font-bold hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                          Enroll Now
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
