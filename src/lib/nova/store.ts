'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  ActivityEvent,
  ChallengeSessionRecord,
  DoctorRecord,
  LessonRecord,
  ProjectRecord,
  ViewId,
} from './types'
import { LESSONS_TOTAL } from './content'
import { DOCTOR_CASES } from './doctor'
import { CHALLENGE_QUESTIONS } from './challenges'

export const ACHIEVEMENTS: { id: string; title: string; description: string; icon: string }[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: 'Footprints' },
  { id: 'five-lessons', title: 'Curious Mind', description: 'Complete 5 lessons', icon: 'BookOpen' },
  { id: 'all-lessons', title: 'ENTC Scholar', description: 'Complete every lesson in the library', icon: 'GraduationCap' },
  { id: 'lab-first', title: 'Lab Technician', description: 'Run your first Virtual Lab experiment', icon: 'FlaskConical' },
  { id: 'lab-ten', title: 'Circuit Wrangler', description: 'Run 10 lab experiments', icon: 'Gauge' },
  { id: 'gate-explore', title: 'Logic Artist', description: 'Evaluate 5 logic gate combinations', icon: 'Binary' },
  { id: 'doctor-first', title: 'Intern Diagnostician', description: 'Solve your first Circuit Doctor case', icon: 'Stethoscope' },
  { id: 'doctor-all', title: 'Circuit Doctor', description: 'Solve all Circuit Doctor cases', icon: 'Award' },
  { id: 'challenge-first', title: 'Challenger', description: 'Finish a Challenge Arena session', icon: 'Swords' },
  { id: 'challenge-perfect', title: 'Flawless Victory', description: 'Get a perfect score in a challenge session', icon: 'Target' },
  { id: 'project-first', title: 'Innovator', description: 'Complete an Innovation Studio project', icon: 'Lightbulb' },
  { id: 'project-all', title: 'Systems Builder', description: 'Complete all three Innovation projects', icon: 'Blocks' },
  { id: 'nova-3', title: 'AI Explorer', description: 'Ask NOVA 3 questions', icon: 'Sparkles' },
  { id: 'nova-10', title: 'NOVA Regular', description: 'Ask NOVA 10 questions', icon: 'MessageCircle' },
]

export const POINTS = {
  lesson: 25,
  lessonPerfectBonus: 10,
  labRun: 2,
  gateRun: 1,
  doctorSolve: 20,
  challengeCorrect: 4,
  challengePerfectBonus: 15,
  projectQuiz: 15,
  novaQuestion: 1,
}

export interface NovaProgressState {
  hydrated: boolean
  completedLessons: Record<string, LessonRecord>
  doctorResults: Record<string, DoctorRecord>
  challengeSessions: ChallengeSessionRecord[]
  projectActivities: Record<string, ProjectRecord>
  labRuns: number
  gateRuns: number
  novaQuestions: number
  points: number
  achievements: string[]
  activity: ActivityEvent[]
  lastView: ViewId | null
  lastLessonId: string | null
  // actions
  completeLesson: (lessonId: string, score: number, total: number) => void
  recordDoctor: (caseId: string, solved: boolean, attempts: number) => void
  recordChallengeSession: (session: Omit<ChallengeSessionRecord, 'id' | 'at'>) => void
  recordProject: (projectId: string, score: number, total: number) => void
  recordLabRun: () => void
  recordGateRun: () => void
  recordNovaQuestion: () => void
  setLastView: (view: ViewId) => void
  setLastLesson: (lessonId: string) => void
  markHydrated: () => void
  resetProgress: () => void
}

let activityCounter = 0

function pushActivity(
  activity: ActivityEvent[],
  kind: ActivityEvent['kind'],
  label: string
): ActivityEvent[] {
  const event: ActivityEvent = {
    id: `a-${Date.now()}-${activityCounter++}`,
    at: Date.now(),
    kind,
    label,
  }
  return [event, ...activity].slice(0, 60)
}

function evaluateAchievements(s: {
  completedLessons: Record<string, LessonRecord>
  doctorResults: Record<string, DoctorRecord>
  challengeSessions: ChallengeSessionRecord[]
  projectActivities: Record<string, ProjectRecord>
  labRuns: number
  gateRuns: number
  novaQuestions: number
}): string[] {
  const earned = new Set<string>()
  const lessonCount = Object.keys(s.completedLessons).length
  const doctorSolved = Object.values(s.doctorResults).filter((r) => r.solved).length
  const projectsDone = Object.values(s.projectActivities).filter((r) => r.quizDone).length

  if (lessonCount >= 1) earned.add('first-lesson')
  if (lessonCount >= 5) earned.add('five-lessons')
  if (lessonCount >= LESSONS_TOTAL) earned.add('all-lessons')
  if (s.labRuns >= 1) earned.add('lab-first')
  if (s.labRuns >= 10) earned.add('lab-ten')
  if (s.gateRuns >= 5) earned.add('gate-explore')
  if (doctorSolved >= 1) earned.add('doctor-first')
  if (doctorSolved >= DOCTOR_CASES.length) earned.add('doctor-all')
  if (s.challengeSessions.length >= 1) earned.add('challenge-first')
  if (s.challengeSessions.some((c) => c.score === c.total && c.total > 0)) earned.add('challenge-perfect')
  if (projectsDone >= 1) earned.add('project-first')
  if (projectsDone >= 3) earned.add('project-all')
  if (s.novaQuestions >= 3) earned.add('nova-3')
  if (s.novaQuestions >= 10) earned.add('nova-10')
  return Array.from(earned)
}

const initialState = {
  hydrated: false,
  completedLessons: {} as Record<string, LessonRecord>,
  doctorResults: {} as Record<string, DoctorRecord>,
  challengeSessions: [] as ChallengeSessionRecord[],
  projectActivities: {} as Record<string, ProjectRecord>,
  labRuns: 0,
  gateRuns: 0,
  novaQuestions: 0,
  points: 0,
  achievements: [] as string[],
  activity: [] as ActivityEvent[],
  lastView: null as ViewId | null,
  lastLessonId: null as string | null,
}

let syncTimer: ReturnType<typeof setTimeout> | null = null

function syncProgressToBackend(state: Partial<NovaProgressState>) {
  if (typeof window === 'undefined') return
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        points: state.points,
        labRuns: state.labRuns,
        gateRuns: state.gateRuns,
        novaQuestions: state.novaQuestions,
        achievements: state.achievements,
        completedLessons: state.completedLessons,
        doctorResults: state.doctorResults,
        challengeSessions: state.challengeSessions,
        projectActivities: state.projectActivities,
        activity: state.activity,
      }),
    }).catch((err) => {
      console.warn('Backend progress sync notice:', err)
    })
  }, 400)
}

export const useProgress = create<NovaProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeLesson: (lessonId, score, total) => {
        set((s) => {
          const prev = s.completedLessons[lessonId]
          const record: LessonRecord = { score, total, at: Date.now() }
          let pts = s.points
          if (!prev) pts += POINTS.lesson
          if (prev && score > prev.score) pts += score - prev.score
          if (!prev && total > 0 && score === total) pts += POINTS.lessonPerfectBonus
          const completedLessons = { ...s.completedLessons, [lessonId]: record }
          const activity = pushActivity(s.activity, 'lesson', `Completed lesson \u201C${lessonId}\u201D (${score}/${total})`)
          const achievements = evaluateAchievements({ ...s, completedLessons })
          return { completedLessons, points: pts, activity, achievements }
        })
        syncProgressToBackend(get())
      },

      recordDoctor: (caseId, solved, attempts) => {
        set((s) => {
          const prev = s.doctorResults[caseId]
          const record: DoctorRecord = {
            solved: (prev?.solved ?? false) || solved,
            attempts: Math.max(prev?.attempts ?? 0, attempts),
            at: Date.now(),
          }
          let pts = s.points
          if (solved && !prev?.solved) pts += POINTS.doctorSolve
          const doctorResults = { ...s.doctorResults, [caseId]: record }
          const activity = pushActivity(
            s.activity,
            'doctor',
            solved ? `Solved Circuit Doctor case (${attempts} attempt${attempts === 1 ? '' : 's'})` : 'Attempted a Circuit Doctor case'
          )
          const achievements = evaluateAchievements({ ...s, doctorResults })
          return { doctorResults, points: pts, activity, achievements }
        })
        syncProgressToBackend(get())
      },

      recordChallengeSession: (session) => {
        set((s) => {
          const record: ChallengeSessionRecord = { ...session, id: `ch-${Date.now()}`, at: Date.now() }
          const pts =
            s.points + record.score * POINTS.challengeCorrect + (record.total > 0 && record.score === record.total ? POINTS.challengePerfectBonus : 0)
          const challengeSessions = [record, ...s.challengeSessions].slice(0, 30)
          const activity = pushActivity(s.activity, 'challenge', `Challenge session: ${record.score}/${record.total} correct`)
          const achievements = evaluateAchievements({ ...s, challengeSessions })
          return { challengeSessions, points: pts, activity, achievements }
        })
        syncProgressToBackend(get())
      },

      recordProject: (projectId, score, total) => {
        set((s) => {
          const prev = s.projectActivities[projectId]
          const record: ProjectRecord = {
            quizDone: true,
            bestScore: Math.max(prev?.bestScore ?? 0, score),
            total,
            at: Date.now(),
          }
          let pts = s.points
          if (!prev?.quizDone) pts += POINTS.projectQuiz
          const projectActivities = { ...s.projectActivities, [projectId]: record }
          const activity = pushActivity(s.activity, 'project', `Completed project knowledge check (${score}/${total})`)
          const achievements = evaluateAchievements({ ...s, projectActivities })
          return { projectActivities, points: pts, activity, achievements }
        })
        syncProgressToBackend(get())
      },

      recordLabRun: () => {
        set((s) => {
          const labRuns = s.labRuns + 1
          const pts = s.labRuns < 10 ? s.points + POINTS.labRun : s.points
          const activity = pushActivity(s.activity, 'lab', 'Ran a Virtual Lab circuit experiment')
          const achievements = evaluateAchievements({ ...s, labRuns })
          return { labRuns, points: pts, activity, achievements }
        })
        syncProgressToBackend(get())
        if (typeof window !== 'undefined') {
          fetch('/api/lab', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'circuit', data: { at: Date.now() } }),
          }).catch(() => {})
        }
      },

      recordGateRun: () => {
        set((s) => {
          const gateRuns = s.gateRuns + 1
          const pts = s.gateRuns < 5 ? s.points + POINTS.gateRun : s.points
          const activity = pushActivity(s.activity, 'gate', 'Evaluated a logic gate combination')
          const achievements = evaluateAchievements({ ...s, gateRuns })
          return { gateRuns, points: pts, activity, achievements }
        })
        syncProgressToBackend(get())
      },

      recordNovaQuestion: () => {
        set((s) => {
          const novaQuestions = s.novaQuestions + 1
          const activity = pushActivity(s.activity, 'nova', 'Asked NOVA a question')
          const achievements = evaluateAchievements({ ...s, novaQuestions })
          return { novaQuestions, activity, achievements }
        })
        syncProgressToBackend(get())
      },

      setLastView: (view) => set({ lastView: view }),
      setLastLesson: (lessonId) => set({ lastLessonId: lessonId }),
      markHydrated: () => {
        set({ hydrated: true })
        if (typeof window !== 'undefined') {
          fetch('/api/progress')
            .then((r) => r.json())
            .then((res) => {
              if (res?.exists && res?.progress) {
                const p = res.progress
                set((curr) => ({
                  points: Math.max(curr.points, p.points || 0),
                  labRuns: Math.max(curr.labRuns, p.labRuns || 0),
                  gateRuns: Math.max(curr.gateRuns, p.gateRuns || 0),
                  novaQuestions: Math.max(curr.novaQuestions, p.novaQuestions || 0),
                  achievements: Array.from(new Set([...(curr.achievements || []), ...(p.achievements || [])])),
                  completedLessons: { ...(curr.completedLessons || {}), ...(p.completedLessons || {}) },
                  doctorResults: { ...(curr.doctorResults || {}), ...(p.doctorResults || {}) },
                  challengeSessions: (p.challengeSessions && p.challengeSessions.length > 0) ? p.challengeSessions : curr.challengeSessions,
                  projectActivities: { ...(curr.projectActivities || {}), ...(p.projectActivities || {}) },
                  activity: (p.activity && p.activity.length > 0) ? p.activity : curr.activity,
                }))
              } else {
                syncProgressToBackend(get())
              }
            })
            .catch(() => {})
        }
      },

      resetProgress: () => {
        set({ ...initialState, hydrated: true })
        if (typeof window !== 'undefined') {
          fetch('/api/progress', { method: 'DELETE' }).catch(() => {})
        }
      },
    }),
    {
      name: 'entc-nova-progress-v1',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        completedLessons: s.completedLessons,
        doctorResults: s.doctorResults,
        challengeSessions: s.challengeSessions,
        projectActivities: s.projectActivities,
        labRuns: s.labRuns,
        gateRuns: s.gateRuns,
        novaQuestions: s.novaQuestions,
        points: s.points,
        achievements: s.achievements,
        activity: s.activity,
        lastView: s.lastView,
        lastLessonId: s.lastLessonId,
      }),
    }
  )
)

// ─── Derived helpers ────────────────────────────────────────────────────────

export function lessonProgress(s: NovaProgressState, lessonId: string): { done: boolean; score: number; total: number } {
  const r = s.completedLessons[lessonId]
  return r ? { done: true, score: r.score, total: r.total } : { done: false, score: 0, total: 0 }
}

export function overallLessonPercent(s: NovaProgressState): number {
  const done = Object.keys(s.completedLessons).length
  return LESSONS_TOTAL === 0 ? 0 : Math.round((done / LESSONS_TOTAL) * 100)
}

export const CHALLENGE_TOTAL = CHALLENGE_QUESTIONS.length
