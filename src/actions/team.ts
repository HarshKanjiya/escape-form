'use server'

import { ACTION_ERRORS, TABLES } from '@/enums/common'
import { supabase } from '@/lib/supabase/supabase'
import { ActionResponse, createErrorResponse, createSuccessResponse } from '@/types/common'
import { Team } from '@/types/db'
import { auth } from '@clerk/nextjs/server'

export async function getUserTeams(): Promise<ActionResponse<Team[]>> {
    try {
        const { userId } = await auth()
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED)
        // Get teams where user is either owner or member
        const { data: teams, error } = await supabase
            .from(TABLES.TEAMS)
            .select('*')
            .eq('owner_id', userId)
            .order('created_at', { ascending: false })
        if (error) {
            console.error('Error fetching user teams:', error)
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR)
        }

        return createSuccessResponse(teams || [])
    } catch (error) {
        console.error('Unexpected error in getUserTeams:', error)
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR)
    }
}

export async function createTeam(name: string): Promise<ActionResponse<Team>> {
    try {
        const { userId } = await auth()
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED)

        const { data, error } = await supabase
            .from(TABLES.TEAMS)
            .insert({ name, owner_id: userId })
            .select('*')
            .single()

        if (error) {
            console.error('Error creating team:', error)
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR)
        }

        return createSuccessResponse(data as Team)
    } catch (error) {
        console.error('Unexpected error in createTeam:', error)
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR)
    }
}