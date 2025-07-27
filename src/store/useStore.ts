'use client'

import { create } from 'zustand'
import { Team } from '@/types/db'

interface TeamStore {
  teams: Team[]
  activeTeam: Team | null
  isLoading: boolean

  // Actions
  setTeams: (teams: Team[]) => void
  setActiveTeam: (team: Team | null) => void
  setLoading: (loading: boolean) => void
}

export const useStore = create<TeamStore>((set) => ({
  teams: [],
  activeTeam: null,
  isLoading: false,

  setTeams: (teams) => set({ teams }),
  setActiveTeam: (team) => set({ activeTeam: team }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
