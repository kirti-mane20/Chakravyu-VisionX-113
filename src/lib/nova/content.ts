import type { LearningModule, Lesson } from './types'
import { basicsModule } from './modules/basics'
import { digitalModule } from './modules/digital'
import { semiconductorsModule } from './modules/semiconductors'
import { sensorsModule } from './modules/sensors'
import { communicationsModule } from './modules/communications'
import { signalsModule } from './modules/signals'
import { embeddedModule } from './modules/embedded'

export const MODULES: LearningModule[] = [
  basicsModule,
  digitalModule,
  semiconductorsModule,
  sensorsModule,
  communicationsModule,
  signalsModule,
  embeddedModule,
]

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons)

export const LESSONS_TOTAL = ALL_LESSONS.length

export function findLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id)
}

export function findModuleOf(lessonId: string): LearningModule | undefined {
  return MODULES.find((m) => m.lessons.some((l) => l.id === lessonId))
}

export function nextLessonAfter(lessonId: string): Lesson | undefined {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId)
  if (idx === -1) return ALL_LESSONS[0]
  return ALL_LESSONS[idx + 1]
}

export function lessonNumber(id: string): { module: number; lesson: number } {
  const mIdx = MODULES.findIndex((m) => m.lessons.some((l) => l.id === id))
  if (mIdx === -1) return { module: 0, lesson: 0 }
  const lIdx = MODULES[mIdx].lessons.findIndex((l) => l.id === id)
  return { module: mIdx + 1, lesson: lIdx + 1 }
}

/** Lightweight lesson search across title, summary, section text and terms. */
export function searchLessons(query: string): Lesson[] {
  const q = query.trim().toLowerCase()
  if (!q) return ALL_LESSONS
  return ALL_LESSONS.filter((l) => {
    const haystack = [
      l.title,
      l.summary,
      ...l.sections.map((s) => s.heading + ' ' + s.body.join(' ')),
      ...l.terms.map((t) => t.term + ' ' + t.definition),
      ...l.takeaways,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}
