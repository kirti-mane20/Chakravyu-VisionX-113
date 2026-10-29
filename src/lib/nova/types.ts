// ─── ENTC NOVA — shared domain types ────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard'

export type ViewId =
  | 'landing'
  | 'dashboard'
  | 'learn'
  | 'lesson'
  | 'lab'
  | 'nova'
  | 'doctor'
  | 'challenges'
  | 'innovation'
  | 'progress'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type DiagramKind =
  | 'ohms-law-circuit'
  | 'resistor-color'
  | 'logic-gates'
  | 'half-adder'
  | 'diode-pn'
  | 'transistor-switch'
  | 'sensor-block'
  | 'arduino-led'
  | 'am-modulation'
  | 'digital-link'
  | 'sine-sampling'
  | 'filter-response'
  | 'embedded-stack'
  | 'iot-architecture'

export interface LessonSection {
  heading: string
  /** Each string is one paragraph. */
  body: string[]
}

export interface LessonTerm {
  term: string
  definition: string
}

export interface LessonApplication {
  title: string
  body: string
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  difficulty: Difficulty
  minutes: number
  summary: string
  sections: LessonSection[]
  terms: LessonTerm[]
  takeaways: string[]
  application: LessonApplication
  diagram: DiagramKind
  diagramCaption: string
  quiz: QuizQuestion[]
}

export interface LearningModule {
  id: string
  title: string
  tagline: string
  description: string
  icon: string
  lessons: Lesson[]
}

// ─── Challenge Arena ────────────────────────────────────────────────────────

export type ChallengeCategoryId =
  | 'digital-logic'
  | 'electronics-mcq'
  | 'component-id'
  | 'arduino-code'
  | 'circuit-puzzle'

export interface ChallengeCategory {
  id: ChallengeCategoryId
  title: string
  description: string
  icon: string
}

export interface ChallengeQuestion {
  id: string
  categoryId: ChallengeCategoryId
  difficulty: Difficulty
  prompt: string
  /** Optional code block shown above the prompt. */
  code?: string
  options: string[]
  correctIndex: number
  explanation: string
  /** Related lesson to revisit when wrong. */
  relatedLessonId?: string
}

// ─── Circuit Doctor ─────────────────────────────────────────────────────────

export interface DoctorClue {
  label: string
  detail: string
}

export interface DoctorCase {
  id: string
  order: number
  title: string
  difficulty: Difficulty
  scenario: string
  expectedBehavior: string
  observedBehavior: string
  diagram: DoctorDiagramKind
  clues: DoctorClue[]
  /** Fault identification choices. */
  faultOptions: { id: string; label: string }[]
  correctFaultId: string
  faultExplanation: string
  /** Proposed corrections shown after identifying the fault. */
  fixOptions: { id: string; label: string }[]
  correctFixId: string
  fixExplanation: string
  concepts: string[]
}

export type DoctorDiagramKind =
  | 'led-broken-wire'
  | 'led-open-switch'
  | 'led-wrong-resistor'
  | 'led-reversed'
  | 'gate-wrong-input'

// ─── Innovation Studio ──────────────────────────────────────────────────────

export interface ProjectMeta {
  id: 'smart-home' | 'iot-safety' | 'comm-network'
  title: string
  tagline: string
  icon: string
  concepts: string[]
  useCase: string
  knowledgeCheck: QuizQuestion[]
}

// ─── Progress / persistence ─────────────────────────────────────────────────

export interface ActivityEvent {
  id: string
  at: number
  kind: 'lesson' | 'lab' | 'gate' | 'doctor' | 'challenge' | 'project' | 'nova'
  label: string
}

export interface LessonRecord {
  score: number
  total: number
  at: number
}

export interface DoctorRecord {
  solved: boolean
  attempts: number
  at: number
}

export interface ChallengeSessionRecord {
  id: string
  at: number
  categoryId: ChallengeCategoryId | 'mixed'
  difficulty: Difficulty | 'mixed'
  score: number
  total: number
  timed: boolean
}

export interface ProjectRecord {
  quizDone: boolean
  bestScore: number
  total: number
  at: number
}
