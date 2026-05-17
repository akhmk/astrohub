import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, FileText, CheckCircle, ChevronRight, ChevronLeft,
  BookOpen, Award, Clock, Menu, X, Loader2, StickyNote, Send,
  Trash2, Edit3, Check, AlertCircle,
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { api, Course, Lesson, CourseNote } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface Props {
  onBack: () => void;
  courseId: string | null;
}

// ─── Notes Panel ─────────────────────────────────────────────────

function NotesPanel({ courseId, activeLessonId, lessonTitle }: {
  courseId: string;
  activeLessonId: string | null;
  lessonTitle?: string;
}) {
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { loadNotes(); }, [courseId]);

  const loadNotes = async () => {
    setLoading(true);
    try { setNotes(await api.getCourseNotes(courseId)); }
    catch { /* not enrolled or no notes yet */ }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!draft.trim() || saving) return;
    setSaving(true);
    try {
      const note = await api.createNote(courseId, {
        content: draft.trim(),
        lessonId: activeLessonId ?? undefined,
      });
      setNotes(prev => [note, ...prev]);
      setDraft('');
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (noteId: string) => {
    if (!editContent.trim()) return;
    try {
      const updated = await api.updateNote(noteId, editContent.trim());
      setNotes(prev => prev.map(n => n.id === noteId ? updated : n));
      setEditing(null);
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await api.deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="liquid-glass rounded-3xl p-8 border border-white/5">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <StickyNote size={18} className="text-blue-400" />
        My Notes
        {activeLessonId && lessonTitle && (
          <span className="text-xs text-white/30 font-normal ml-1">— for: {lessonTitle}</span>
        )}
      </h3>

      {/* New note input */}
      <div className="mb-8">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Write a note to help you remember this…"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-white/30 transition-colors"
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCreate(); }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-white/20">⌘ Enter to save</span>
          <button
            onClick={handleCreate}
            disabled={!draft.trim() || saving}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:scale-[1.02] transition-transform disabled:opacity-40"
          >
            <Send size={12} />
            Save Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="animate-spin text-white/30" size={20} /></div>
      ) : notes.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-6">No notes yet. Start jotting down key ideas.</p>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 group">
              {note.lesson && (
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText size={11} className="text-blue-400/60" />
                  <span className="text-[10px] text-white/30">{note.lesson.title}</span>
                </div>
              )}
              {editing === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 rounded-xl p-3 text-sm text-white/80 resize-none focus:outline-none border border-white/10 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="flex items-center gap-1 text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold"
                    >
                      <Check size={11} /> Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="text-xs text-white/40 px-3 py-1.5 rounded-full border border-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white/20">{new Date(note.updatedAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditing(note.id); setEditContent(note.content); }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-white/40 hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function Learning({ onBack, courseId }: Props) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) loadCourse(courseId);
  }, [courseId]);

  const loadCourse = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCourse(id);
      setCourse(data);
      // Auto-select first lesson
      const first = data.lessons?.[0];
      if (first) loadLesson(first.id);
    } catch {
      setError('Failed to load course.');
    } finally {
      setLoading(false);
    }
  };

  const loadLesson = async (lessonId: string) => {
    setLessonLoading(true);
    // Close sidebar on mobile
    if (window.innerWidth < 1024) setSidebarOpen(false);
    try {
      const data = await api.getLesson(lessonId);
      setActiveLesson(data);
    } catch {
      console.error('Failed to load lesson');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!courseId) return;
    try {
      await api.enrollCourse(courseId);
      loadCourse(courseId);
    } catch (e: any) { alert(e.message); }
  };

  const handleComplete = async () => {
    if (!activeLesson || !course || completing) return;
    setCompleting(true);
    try {
      await api.finishLesson(activeLesson.id);
      setCourse(prev => prev ? {
        ...prev,
        completedLessons: prev.completedLessons?.includes(activeLesson.id)
          ? prev.completedLessons
          : [...(prev.completedLessons ?? []), activeLesson.id],
      } : prev);
    } catch (e: any) {
      if (!e.message?.includes('enrolled')) alert(e.message);
    } finally {
      setCompleting(false);
    }
  };

  const lessons = course?.lessons ?? [];
  const total = lessons.length;
  const done = course?.completedLessons?.length ?? 0;
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const activeLessonIndex = activeLesson ? lessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = activeLessonIndex > 0 ? lessons[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex >= 0 && activeLessonIndex < lessons.length - 1 ? lessons[activeLessonIndex + 1] : null;
  const isCompleted = course?.completedLessons?.includes(activeLesson?.id ?? '') ?? false;
  const canComplete = course?.isEnrolled && activeLesson && !isCompleted;

  // ─── Loading / error states ───────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 text-center">
          <Loader2 className="animate-spin text-white/40 mx-auto mb-4" size={40} />
          <p className="text-white/40 text-sm">Loading course…</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 text-center">
          <AlertCircle size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/60 mb-6">{error ?? 'Course not found.'}</p>
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors">
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // ─── Main UI (same visual structure as original) ───────────────

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <CosmicBackground />

      {/* Header — same layout as original */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-white/10 hidden md:block shrink-0" />
          <h1 className="text-sm font-bold truncate hidden md:block">
            {course.title}
            {activeLesson && (
              <span className="text-white/40 font-normal ml-2">/ {activeLesson.title}</span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Award size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{progressPct}% Complete</span>
          </div>
          {!course.isEnrolled && (
            <button
              onClick={handleEnroll}
              className="text-xs bg-white text-black px-4 py-2 rounded-full font-bold hover:scale-[1.02] transition-transform"
            >
              Enroll
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Main content — same layout as original */}
        <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="max-w-5xl mx-auto p-6 md:p-12">

            {lessonLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-white/30" size={32} />
              </div>
            )}

            {!lessonLoading && !activeLesson && (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <BookOpen size={48} className="text-white/10 mb-4" />
                <p className="text-white/40 text-sm">Select a lesson from the sidebar to begin.</p>
              </div>
            )}

            {!lessonLoading && activeLesson && (
              <motion.div key={activeLesson.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Video player — same structure as original */}
                {activeLesson.videoURL && (
                  <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 mb-12 relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all cursor-pointer">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                    {course.imageURL && (
                      <img
                        src={course.imageURL}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                        alt=""
                      />
                    )}
                  </div>
                )}

                {/* Text content — rendered from real lesson data */}
                {activeLesson.content && (
                  <div className="mb-12">
                    {activeLesson.videoURL ? null : (
                      <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 mb-12 relative overflow-hidden">
                        <div className="absolute inset-0 p-12 overflow-y-auto">
                          <div
                            className="max-w-2xl mx-auto lesson-prose"
                            dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                          />
                        </div>
                      </div>
                    )}
                    {activeLesson.videoURL && (
                      <div className="lesson-prose" dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                    )}
                  </div>
                )}

                {/* Lesson info — same layout as original */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pb-12 border-b border-white/10">
                  <div>
                    <h2 className="text-3xl font-heading mb-2">{activeLesson.title}</h2>
                    {activeLesson.summary && (
                      <p className="text-white/50 text-sm leading-relaxed mb-3 max-w-xl">{activeLesson.summary}</p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-white/40">
                      {activeLesson.duration && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {activeLesson.duration} min
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} />
                        {course.title}
                      </div>
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-green-400 shrink-0">
                      <CheckCircle size={20} />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : canComplete ? (
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      className="bg-white text-black rounded-full px-8 py-4 text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0 disabled:opacity-50"
                    >
                      {completing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                      Mark as Complete
                    </button>
                  ) : !course.isEnrolled ? (
                    <button
                      onClick={handleEnroll}
                      className="bg-white text-black rounded-full px-8 py-4 text-sm font-bold hover:scale-[1.02] transition-all shrink-0"
                    >
                      Enroll to Track Progress
                    </button>
                  ) : null}
                </div>

                {/* Prev / Next navigation */}
                {(prevLesson || nextLesson) && (
                  <div className="flex items-center justify-between mb-12">
                    {prevLesson ? (
                      <button
                        onClick={() => loadLesson(prevLesson.id)}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
                      >
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="truncate max-w-[200px]">{prevLesson.title}</span>
                      </button>
                    ) : <div />}
                    {nextLesson && (
                      <button
                        onClick={() => loadLesson(nextLesson.id)}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group ml-auto"
                      >
                        <span className="truncate max-w-[200px]">{nextLesson.title}</span>
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                )}

                {/* Notes — replaces the hardcoded discussion section */}
                {course.isEnrolled && user && (
                  <NotesPanel
                    courseId={course.id}
                    activeLessonId={activeLesson?.id ?? null}
                    lessonTitle={activeLesson?.title}
                  />
                )}
              </motion.div>
            )}
          </div>
        </main>

        {/* Sidebar — same layout as original, now driven by real data */}
        <aside className={`
          absolute lg:relative inset-y-0 right-0 w-80 bg-black/80 backdrop-blur-2xl border-l border-white/10 z-20 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:hidden'}
        `}>
          <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white/30">Course Curriculum</h3>
              <span className="text-[10px] text-white/20">{done}/{total}</span>
            </div>

            {/* Overall progress bar */}
            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>

            <AnimatePresence>
              <div className="space-y-2">
                {lessons.map((lesson, idx) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const completed = course.completedLessons?.includes(lesson.id);
                  return (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => loadLesson(lesson.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group
                        ${isActive
                          ? 'bg-blue-500/10 border border-blue-500/50'
                          : 'hover:bg-white/5 border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg transition-colors shrink-0
                          ${isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'}
                        `}>
                          {lesson.videoURL ? <Play size={14} /> : <FileText size={14} />}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-medium truncate transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                            {lesson.title}
                          </div>
                          {lesson.duration && (
                            <div className="text-[9px] text-white/30 uppercase tracking-wider">{lesson.duration} min</div>
                          )}
                        </div>
                      </div>
                      {completed && <CheckCircle size={14} className="text-green-500 shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
}
