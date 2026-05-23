import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, FileText, CheckCircle, ChevronRight, ChevronLeft, BookOpen, Award,
  Clock, Menu, X, StickyNote, BarChart3, Loader2, ChevronDown,
  ChevronUp, Send, Trash2, Edit3, Check, RotateCcw, Trophy, Zap, Target,
  AlertCircle, Star,
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground';
import { api, Course, Lesson, Quiz, QuizAttemptResult, CourseNote, LessonSummary } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

// ─── Types ───────────────────────────────────────────────────────

type Tab = 'lessons' | 'overview' | 'quiz' | 'notes' | 'progress';

interface Props {
  onBack: () => void;
  courseId: string | null;
}

// ─── Lesson Content Renderer ─────────────────────────────────────

function LessonContent({ content }: { content: string }) {
  return (
    <div
      className="lesson-prose"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// ─── Quiz Engine ─────────────────────────────────────────────────

function QuizEngine({ quiz, courseId, onComplete }: {
  quiz: Quiz;
  courseId: string;
  onComplete: (result: QuizAttemptResult) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const { user } = useAuth();

  const handleSelect = (questionId: string, optionId: string) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    const unanswered = quiz.questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      setError(`Please answer all questions (${unanswered.length} remaining).`);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId: selectedOptionId as string,
      }));
      const res = await api.submitQuiz(quiz.id, payload);
      setResult(res);
      onComplete(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setCurrentQ(0);
    setError(null);
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Result card */}
        <div className="liquid-glass rounded-3xl p-10 border border-white/10 text-center mb-10">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${result.passed ? 'bg-green-500/10 border-2 border-green-500/30' : 'bg-red-500/10 border-2 border-red-500/30'}`}>
            {result.passed ? (
              <Trophy size={40} className="text-green-400" />
            ) : (
              <RotateCcw size={40} className="text-red-400" />
            )}
          </div>
          <h2 className="text-4xl font-heading mb-2">
            {result.percentage}%
          </h2>
          <p className={`text-lg font-medium mb-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
            {result.passed ? 'Passed! Well done.' : 'Not quite — try again.'}
          </p>
          <p className="text-white/40 text-sm mb-8">
            {result.passed
              ? `You scored above the ${quiz.passingScore}% passing threshold. +50 XP earned.`
              : `You need ${quiz.passingScore}% to pass. Review the material and try again.`}
          </p>
          {!result.passed && (
            <button
              onClick={handleRetry}
              className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-[1.02] transition-transform"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Answer review */}
        <h3 className="text-lg font-heading mb-6 text-white/60">Question Review</h3>
        <div className="space-y-6">
          {quiz.questions.map((q, idx) => {
            const answer = result.answers.find(a => a.questionId === q.id);
            const isCorrect = answer?.isCorrect ?? false;
            return (
              <div key={q.id} className="liquid-glass rounded-2xl p-6 border border-white/5">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isCorrect ? <Check size={12} className="text-green-400" /> : <X size={12} className="text-red-400" />}
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{idx + 1}. {q.text}</p>
                </div>
                {answer?.explanation && (
                  <div className="mt-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <p className="text-xs text-blue-300/80 leading-relaxed">{answer.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  const question = quiz.questions[currentQ];
  const totalQ = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Best attempt banner */}
      {quiz.bestAttempt && (
        <div className="mb-8 p-4 liquid-glass rounded-2xl border border-white/5 flex items-center gap-3">
          <Star size={16} className="text-yellow-400 shrink-0" />
          <p className="text-sm text-white/60">
            Your best score: <span className="text-white font-bold">{quiz.bestAttempt.score}%</span>
            {quiz.bestAttempt.passed && <span className="text-green-400 ml-2">✓ Passed</span>}
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-white/40 mb-3">
          <span>Question {currentQ + 1} of {totalQ}</span>
          <span>{answeredCount}/{totalQ} answered</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="liquid-glass rounded-3xl p-8 border border-white/10 mb-6"
        >
          <p className="text-lg font-medium mb-8 leading-relaxed">{question.text}</p>
          <div className="space-y-3">
            {question.options.map((opt) => {
              const selected = answers[question.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(question.id, opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center gap-4 group ${
                    selected
                      ? 'border-blue-500/60 bg-blue-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected ? 'border-blue-400 bg-blue-400' : 'border-white/20'
                  }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className={`text-sm transition-colors ${selected ? 'text-white' : 'text-white/70'}`}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="px-5 py-2.5 rounded-full border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentQ ? 'bg-blue-400 scale-125' : answers[quiz.questions[i].id] ? 'bg-white/40' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {currentQ < totalQ - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            className="px-5 py-2.5 rounded-full bg-white/10 text-sm hover:bg-white/20 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < totalQ}
            className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-40"
          >
            {submitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
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

  useEffect(() => {
    loadNotes();
  }, [courseId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await api.getCourseNotes(courseId);
      setNotes(data);
    } catch { /* not enrolled or no notes */ }
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
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (noteId: string) => {
    if (!editContent.trim()) return;
    try {
      const updated = await api.updateNote(noteId, editContent.trim());
      setNotes(prev => prev.map(n => n.id === noteId ? updated : n));
      setEditing(null);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await api.deleteNote(noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const startEdit = (note: CourseNote) => {
    setEditing(note.id);
    setEditContent(note.content);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* New note */}
      <div className="liquid-glass rounded-3xl p-6 border border-white/10 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <StickyNote size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-white/60">
            {activeLessonId && lessonTitle ? `Note for: ${lessonTitle}` : 'Course note'}
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Write a note to help you remember this…"
          rows={4}
          className="w-full bg-white/5 rounded-2xl p-4 text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCreate();
          }}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-white/30">⌘+Enter to save</span>
          <button
            onClick={handleCreate}
            disabled={!draft.trim() || saving}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-40"
          >
            <Send size={14} />
            Save Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/30" size={24} /></div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16">
          <StickyNote size={32} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No notes yet. Start taking notes to reinforce your learning.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="liquid-glass rounded-2xl p-5 border border-white/5 group">
              {note.lesson && (
                <div className="flex items-center gap-1.5 mb-3">
                  <FileText size={12} className="text-blue-400/60" />
                  <span className="text-xs text-white/30">{note.lesson.title}</span>
                </div>
              )}
              {editing === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 rounded-xl p-3 text-sm text-white/80 resize-none focus:outline-none focus:ring-1 focus:ring-white/20 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="flex items-center gap-1.5 text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold"
                    >
                      <Check size={12} /> Save
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
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white/20">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(note)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDelete(note.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-white/40 hover:text-red-400">
                        <Trash2 size={13} />
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

// ─── Progress Tab ─────────────────────────────────────────────────

function ProgressTab({ course }: { course: Course }) {
  const allLessons = [
    ...course.modules.flatMap(m => m.lessons),
    ...course.lessons,
  ];
  const total = allLessons.length;
  const done = course.completedLessons.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const moduleProgress = course.modules.map(mod => {
    const modTotal = mod.lessons.length;
    const modDone = mod.lessons.filter(l => course.completedLessons.includes(l.id)).length;
    return { module: mod, total: modTotal, done: modDone, pct: modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0 };
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Overall */}
      <div className="liquid-glass rounded-3xl p-8 border border-white/10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-heading mb-1">{pct}% Complete</h3>
            <p className="text-white/40 text-sm">{done} of {total} lessons finished</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="transparent" />
              <motion.circle
                cx="40" cy="40" r="34"
                stroke="#3b82f6"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={213.6}
                initial={{ strokeDashoffset: 213.6 }}
                animate={{ strokeDashoffset: 213.6 - (213.6 * pct) / 100 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{pct}%</div>
          </div>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Per module */}
      <div className="space-y-4">
        {moduleProgress.map(({ module, total: mt, done: md, pct: mp }) => (
          <div key={module.id} className="liquid-glass rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">{module.title}</h4>
              <span className="text-xs text-white/40">{md}/{mt}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${mp}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {module.lessons.map(lesson => {
                const completed = course.completedLessons.includes(lesson.id);
                return (
                  <div key={lesson.id} className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border ${completed ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-white/5 text-white/30'}`}>
                    {completed ? <CheckCircle size={10} /> : <div className="w-2 h-2 rounded-full border border-current" />}
                    {lesson.title.length > 22 ? lesson.title.slice(0, 22) + '…' : lesson.title}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {pct === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-8 liquid-glass rounded-3xl border border-yellow-500/30 bg-yellow-500/5 text-center"
        >
          <Trophy size={40} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-heading mb-2">Course Complete!</h3>
          <p className="text-white/50 text-sm">You've completed all lessons in this course. Take the quiz to test your mastery.</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────

function OverviewTab({ course }: { course: Course }) {
  return (
    <div className="max-w-3xl">
      {/* Description */}
      <div className="liquid-glass rounded-3xl p-8 border border-white/10 mb-8">
        <h3 className="text-lg font-heading mb-4">About This Course</h3>
        <p className="text-white/60 leading-relaxed text-sm">{course.description}</p>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Level', value: course.level.charAt(0) + course.level.slice(1).toLowerCase(), icon: Target },
          { label: 'Duration', value: `${course.estimatedHours ?? '?'}h`, icon: Clock },
          { label: 'Lessons', value: String(course._count.lessons), icon: BookOpen },
          { label: 'Students', value: String(course._count.enrollments), icon: Award },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="liquid-glass rounded-2xl p-5 border border-white/5">
            <Icon size={16} className="text-blue-400 mb-2" />
            <div className="text-lg font-bold">{value}</div>
            <div className="text-xs text-white/30">{label}</div>
          </div>
        ))}
      </div>

      {/* What you'll learn */}
      {course.outcomes.length > 0 && (
        <div className="liquid-glass rounded-3xl p-8 border border-white/10 mb-8">
          <h3 className="text-lg font-heading mb-6">What You'll Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.outcomes.map((o, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">{o}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {course.prerequisites.length > 0 && (
        <div className="liquid-glass rounded-3xl p-8 border border-white/10 mb-8">
          <h3 className="text-lg font-heading mb-4">Prerequisites</h3>
          <ul className="space-y-2">
            {course.prerequisites.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <ChevronRight size={14} className="text-white/30 shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructor */}
      {course.author && (
        <div className="liquid-glass rounded-3xl p-6 border border-white/10">
          <h3 className="text-lg font-heading mb-4">Instructor</h3>
          <div className="flex items-center gap-4">
            <img
              src={course.author.photoURL ?? `https://ui-avatars.com/api/?name=${encodeURIComponent((course.author.firstName ?? 'A') + ' ' + (course.author.lastName ?? ''))}&background=1a1a2e&color=fff`}
              alt=""
              className="w-12 h-12 rounded-full border border-white/10"
            />
            <div>
              <div className="font-medium">{[course.author.firstName, course.author.lastName].filter(Boolean).join(' ')}</div>
              <div className="text-xs text-white/40">Course Author</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function Learning({ onBack, courseId }: Props) {
  const { user, profile } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('lessons');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completingLesson, setCompletingLesson] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttemptResult | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId]);

  const loadCourse = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getCourse(id);
      setCourse(data);
      setExpandedModules(new Set(data.modules.map(m => m.id)));
      // Auto-load the first lesson
      const firstLesson = data.modules[0]?.lessons[0] ?? data.lessons[0];
      if (firstLesson) {
        const lessonData = await api.getLesson(firstLesson.id);
        setActiveLesson(lessonData);
      }
    } catch (e: any) {
      console.error('Failed to load course', e);
    } finally {
      setLoading(false);
    }
  };

  const loadLesson = async (lessonId: string) => {
    setLessonLoading(true);
    setActiveTab('lessons');
    // Close sidebar on mobile after selecting a lesson
    if (window.innerWidth < 1024) setSidebarOpen(false);
    try {
      const data = await api.getLesson(lessonId);
      setActiveLesson(data);
    } catch (e) {
      console.error('Failed to load lesson', e);
    } finally {
      setLessonLoading(false);
    }
  };

  const loadQuiz = async () => {
    if (!courseId || quiz) { setActiveTab('quiz'); return; }
    setQuizLoading(true);
    try {
      const data = await api.getCourseQuiz(courseId);
      setQuiz(data);
    } catch (e) {
      console.error('No quiz found');
    } finally {
      setQuizLoading(false);
      setActiveTab('quiz');
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson || !course || completingLesson) return;
    setCompletingLesson(true);
    try {
      await api.finishLesson(activeLesson.id);
      setCourse(prev => prev ? {
        ...prev,
        completedLessons: prev.completedLessons.includes(activeLesson.id)
          ? prev.completedLessons
          : [...prev.completedLessons, activeLesson.id],
      } : prev);
    } catch (e: any) {
      if (!e.message?.includes('must be enrolled')) console.error(e);
    } finally {
      setCompletingLesson(false);
    }
  };

  const handleEnroll = async () => {
    if (!courseId) return;
    try {
      await api.enrollCourse(courseId);
      loadCourse(courseId);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const allLessons = course ? [
    ...course.modules.flatMap(m => m.lessons),
    ...course.lessons,
  ] : [];
  const totalLessons = allLessons.length;
  const doneLessons = course?.completedLessons.length ?? 0;
  const progressPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
  const isCompleted = course?.completedLessons.includes(activeLesson?.id ?? '') ?? false;
  const canComplete = course?.isEnrolled && activeLesson && !isCompleted;

  const activeLessonIndex = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
  const nextLesson = activeLessonIndex >= 0 && activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1] : null;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'lessons', label: 'Lessons', icon: BookOpen },
    { key: 'overview', label: 'Overview', icon: FileText },
    { key: 'quiz', label: 'Quiz', icon: Zap },
    { key: 'notes', label: 'Notes', icon: StickyNote },
    { key: 'progress', label: 'Progress', icon: BarChart3 },
  ];

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

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 text-center">
          <p className="text-white/60 mb-6">Course not found.</p>
          <button onClick={onBack} className="text-sm text-white/40 hover:text-white transition-colors">
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <CosmicBackground />

      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-white/10 hidden md:block shrink-0" />
          <div className="min-w-0 hidden md:block">
            <h1 className="text-sm font-bold truncate max-w-sm">{course.title}</h1>
            {activeLesson && activeTab === 'lessons' && (
              <p className="text-[10px] text-white/30 truncate max-w-sm">{activeLesson.title}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[10px] font-bold text-white/40">{progressPct}%</span>
          </div>

          {/* Enroll button if not enrolled */}
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
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-16 z-40 shrink-0">
        <div className="flex items-center gap-1 px-4 md:px-6 overflow-x-auto no-scrollbar">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'quiz') loadQuiz();
                else setActiveTab(key);
              }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${
                activeTab === key
                  ? 'border-blue-400 text-white'
                  : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto p-5 md:p-10">

            {/* LESSONS TAB — lesson content */}
            {activeTab === 'lessons' && (
              <>
                {lessonLoading && (
                  <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-white/30" size={32} />
                  </div>
                )}

                {!lessonLoading && !activeLesson && (
                  <div className="text-center py-20">
                    <BookOpen size={48} className="text-white/10 mx-auto mb-4" />
                    <h3 className="text-xl font-heading mb-2 text-white/60">Select a Lesson</h3>
                    <p className="text-white/30 text-sm max-w-md mx-auto">
                      Choose a lesson from the sidebar to begin reading. Complete each lesson to track your progress.
                    </p>
                  </div>
                )}

                {!lessonLoading && activeLesson && (
                  <motion.div
                    key={activeLesson.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Lesson header */}
                    <div className="mb-8 pb-8 border-b border-white/5">
                      <div className="flex items-center gap-2 text-xs text-white/30 mb-4 flex-wrap">
                        <span>{course.modules.find(m => m.id === activeLesson.moduleId)?.title ?? 'Lesson'}</span>
                        <ChevronRight size={12} />
                        <span className="text-white/50">{activeLesson.title}</span>
                        {activeLesson.duration && (
                          <>
                            <span className="ml-auto flex items-center gap-1">
                              <Clock size={12} />
                              {activeLesson.duration} min read
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-heading tracking-tight mb-4">{activeLesson.title}</h2>
                      {activeLesson.summary && (
                        <p className="text-white/50 text-base leading-relaxed max-w-2xl">{activeLesson.summary}</p>
                      )}
                    </div>

                    {/* Lesson content */}
                    {activeLesson.content ? (
                      <LessonContent content={activeLesson.content} />
                    ) : (
                      <div className="text-center py-16 text-white/30">
                        <FileText size={32} className="mx-auto mb-4" />
                        <p className="text-sm">Content coming soon.</p>
                      </div>
                    )}

                    {/* Complete button */}
                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle size={18} />
                            <span className="text-sm font-medium">Lesson completed</span>
                          </div>
                        ) : (
                          <p className="text-xs text-white/30">Mark this lesson complete when you're ready to move on.</p>
                        )}
                      </div>
                      {canComplete && (
                        <button
                          onClick={handleCompleteLesson}
                          disabled={completingLesson}
                          className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full text-sm font-bold hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                        >
                          {completingLesson ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                          Mark as Complete
                        </button>
                      )}
                    </div>

                    {/* Prev / Next lesson navigation */}
                    {(prevLesson || nextLesson) && (
                      <div className="mt-6 flex items-center justify-between gap-4">
                        {prevLesson ? (
                          <button
                            onClick={() => loadLesson(prevLesson.id)}
                            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
                          >
                            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                            <span className="truncate max-w-[180px]">{prevLesson.title}</span>
                          </button>
                        ) : <div />}
                        {nextLesson && (
                          <button
                            onClick={() => loadLesson(nextLesson.id)}
                            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group ml-auto"
                          >
                            <span className="truncate max-w-[180px]">{nextLesson.title}</span>
                            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && <OverviewTab course={course} />}

            {/* QUIZ TAB */}
            {activeTab === 'quiz' && (
              <>
                {quizLoading && (
                  <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-white/30" size={32} />
                  </div>
                )}
                {!quizLoading && !quiz && (
                  <div className="text-center py-20">
                    <Zap size={40} className="text-white/10 mx-auto mb-4" />
                    <p className="text-white/30 text-sm">No quiz available for this course yet.</p>
                  </div>
                )}
                {!quizLoading && quiz && (
                  <div>
                    <div className="mb-10">
                      <h2 className="text-3xl font-heading mb-2">{quiz.title}</h2>
                      {quiz.description && <p className="text-white/50 text-sm">{quiz.description}</p>}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                          <Target size={13} />
                          Passing score: {quiz.passingScore}%
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                          <BookOpen size={13} />
                          {quiz.questions.length} questions
                        </div>
                      </div>
                    </div>
                    {!course.isEnrolled ? (
                      <div className="liquid-glass rounded-3xl p-10 border border-white/10 text-center">
                        <Trophy size={40} className="text-white/20 mx-auto mb-4" />
                        <p className="text-white/50 mb-6">Enroll in this course to take the quiz.</p>
                        <button
                          onClick={handleEnroll}
                          className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm"
                        >
                          Enroll Now
                        </button>
                      </div>
                    ) : (
                      <QuizEngine
                        quiz={quiz}
                        courseId={course.id}
                        onComplete={(result) => setQuizResult(result)}
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <>
                {!course.isEnrolled ? (
                  <div className="text-center py-20">
                    <StickyNote size={40} className="text-white/10 mx-auto mb-4" />
                    <p className="text-white/30 text-sm mb-6">Enroll to start taking notes.</p>
                    <button onClick={handleEnroll} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm">
                      Enroll Now
                    </button>
                  </div>
                ) : (
                  <NotesPanel
                    courseId={course.id}
                    activeLessonId={activeLesson?.id ?? null}
                    lessonTitle={activeLesson?.title}
                  />
                )}
              </>
            )}

            {/* PROGRESS TAB */}
            {activeTab === 'progress' && <ProgressTab course={course} />}
          </div>
        </main>

        {/* Sidebar */}
        <aside className={`
          absolute lg:relative inset-y-0 right-0 w-72 xl:w-80
          bg-black/80 backdrop-blur-2xl border-l border-white/5 z-20
          transition-transform duration-300 flex flex-col overflow-hidden
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-full lg:w-0'}
        `}>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 mb-5">Course Content</p>

            {/* Overall mini progress */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-[10px] text-white/30 shrink-0">{doneLessons}/{totalLessons}</span>
            </div>

            {/* Modules + Lessons */}
            <div className="space-y-6">
              {course.modules.map((mod) => {
                const expanded = expandedModules.has(mod.id);
                const modDone = mod.lessons.filter(l => course.completedLessons.includes(l.id)).length;
                return (
                  <div key={mod.id}>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between gap-2 text-left group mb-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-mono text-white/30 shrink-0">
                          {mod.order + 1}
                        </div>
                        <span className="text-xs font-bold text-white/50 group-hover:text-white/80 transition-colors truncate">
                          {mod.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-white/20">{modDone}/{mod.lessons.length}</span>
                        {expanded ? <ChevronUp size={12} className="text-white/20" /> : <ChevronDown size={12} className="text-white/20" />}
                      </div>
                    </button>

                    {expanded && (
                      <div className="space-y-1 pl-1">
                        {mod.lessons.map((lesson) => {
                          const completed = course.completedLessons.includes(lesson.id);
                          const isActive = activeLesson?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => loadLesson(lesson.id)}
                              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group/lesson ${
                                isActive
                                  ? 'bg-blue-500/10 border border-blue-500/30'
                                  : 'hover:bg-white/[0.03] border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                                  isActive ? 'bg-blue-500 text-white' : completed ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'
                                }`}>
                                  {lesson.lessonType === 'VIDEO' ? <Play size={11} /> : <FileText size={11} />}
                                </div>
                                <div className="min-w-0">
                                  <div className={`text-[11px] font-medium leading-tight truncate transition-colors ${isActive ? 'text-white' : 'text-white/50 group-hover/lesson:text-white/80'}`}>
                                    {lesson.title}
                                  </div>
                                  {lesson.duration && (
                                    <div className="text-[9px] text-white/20 mt-0.5">{lesson.duration} min</div>
                                  )}
                                </div>
                              </div>
                              {completed && <CheckCircle size={12} className="text-green-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Unmoduled lessons */}
              {course.lessons.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/20 mb-2">Additional</p>
                  <div className="space-y-1">
                    {course.lessons.map(lesson => {
                      const completed = course.completedLessons.includes(lesson.id);
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => loadLesson(lesson.id)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                            isActive ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-white/[0.03] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-blue-500' : 'bg-white/5 text-white/30'}`}>
                              <FileText size={11} />
                            </div>
                            <span className={`text-[11px] font-medium truncate ${isActive ? 'text-white' : 'text-white/50'}`}>
                              {lesson.title}
                            </span>
                          </div>
                          {completed && <CheckCircle size={12} className="text-green-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
