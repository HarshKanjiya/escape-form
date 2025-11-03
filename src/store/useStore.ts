'use client'

import { Project, Team } from '@/generated/prisma'
import { create } from 'zustand'

interface TeamStore {
  teams: Team[]
  projects: Project[]
  activeTeam: Team | null
  activeProject: Project | null
  isLoading: boolean

  // Actions
  setTeams: (teams: Team[]) => void
  setActiveTeam: (team: Team | null) => void
  setProjects: (projects: Project[]) => void
  setActiveProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
}

export const useStore = create<TeamStore>((set) => ({
  teams: [],
  projects: [],
  activeTeam: null,
  activeProject: null,
  isLoading: false,

  setTeams: (teams) => set({ teams }),
  setActiveTeam: (team) => set({ activeTeam: team }),
  setProjects: (projects) => set({ projects }),
  setActiveProject: (project) => set({ activeProject: project }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
