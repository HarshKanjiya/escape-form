'use server'

import { getSuccessMessage, MESSAGE } from '@/constants/messages'
import { createActionError, createActionSuccess, withActionErrorHandler } from '@/lib/api-response'
import { validateAuth } from '@/lib/helper'
import { prisma, Team } from '@/lib/prisma'
import { ActionResponse } from '@/types/common'

export const getUserTeams = withActionErrorHandler(async (): Promise<ActionResponse<Team[]>> => {
    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Team[]>


    const teams = await prisma.team.findMany({
        where: { ownerId: user!.id },
        orderBy: { createdAt: 'desc' },
    })

    return createActionSuccess(teams, getSuccessMessage('Teams'));
})


export const createTeam = withActionErrorHandler(async (name: string): Promise<ActionResponse<Team>> => {
    // Validate authentication
    const { user, error } = await validateAuth()
    if (error) {
        return createActionError('Authentication required') as ActionResponse<Team>
    }

    // Validate input
    if (!name || name.trim().length === 0) {
        return createActionError('Team name is required') as ActionResponse<Team>
    }

    // Create team
    const team = await prisma.team.create({
        data: {
            name: name.trim(),
            ownerId: user!.id,
        },
    })

    return createActionSuccess(team, 'Team created successfully')
})