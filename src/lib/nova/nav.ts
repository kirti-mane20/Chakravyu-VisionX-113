'use client'

import { create } from 'zustand'
import type { Difficulty, ViewId } from './types'

export interface ChallengePreset {
  categoryId?: string
  difficulty?: Difficulty | 'mixed'
  timed?: boolean
}

interface NavState {
  view: ViewId
  lessonId: string | null
  projectId: string | null
  challengePreset: ChallengePreset | null
  go: (view: ViewId, opts?: { lessonId?: string | null; projectId?: string | null; challengePreset?: ChallengePreset | null }) => void
}

export const useNav = create<NavState>((set) => ({
  view: 'landing',
  lessonId: null,
  projectId: null,
  challengePreset: null,
  go: (view, opts) =>
    set(() => ({
      view,
      ...(opts?.lessonId !== undefined ? { lessonId: opts.lessonId } : {}),
      ...(opts?.projectId !== undefined ? { projectId: opts.projectId } : {}),
      ...(opts?.challengePreset !== undefined ? { challengePreset: opts.challengePreset } : {}),
    })),
}))
