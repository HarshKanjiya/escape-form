'use client'

import { Form, Project, Team } from '@prisma/client'
import { create } from 'zustand'

interface GlobalStore {
  teams: Team[]
  projects: Project[]
  activeTeam: Team | null
  activeProject: Project | null
  activeForm: Form | null
  isLoading: boolean

  // Actions
  setTeams: (teams: Team[]) => void
  setActiveTeam: (team: Team | null) => void
  setProjects: (projects: Project[]) => void
  setActiveProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
  setActiveForm: (form: Form | null) => void
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isLoading: false,
  teams: [],
  projects: [],
  activeTeam: null,
  activeProject: null,
  activeForm: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setTeams: (teams) => set({ teams }),
  setProjects: (projects) => set({ projects }),
  setActiveTeam: (team) => set({ activeTeam: team }),
  setActiveProject: (project) => set({ activeProject: project }),
  setActiveForm: (form) => set({ activeForm: form }),
}))