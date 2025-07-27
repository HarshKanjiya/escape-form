"use server";

import { ACTION_ERRORS, TABLES } from "@/enums/common";
import { supabase } from "@/lib/supabase/supabase";
import { ActionResponse, createErrorResponse, createSuccessResponse } from "@/types/common";
import { Project, ProjectInsert } from "@/types/db";
import { auth } from "@clerk/nextjs/server";

export const getTeamProjects = async (teamId: string): Promise<ActionResponse<Project[]>> => {
    try {
        const { userId } = await auth()
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED)

        // Get teams where user is either owner or member
        const { data: projects, error } = await supabase
            .from(TABLES.PROJECTS)
            .select('*')
            .eq('team_id', teamId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user teams:', error)
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR)
        }

        return createSuccessResponse(projects || [])
    } catch (error) {
        console.error('Unexpected error in getTeamProjects:', error)
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR)
    }
}


export async function createProject(project: ProjectInsert): Promise<ActionResponse<Project>> {
    try {
        const { userId } = await auth()
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED)

        const { data, error } = await supabase
            .from(TABLES.PROJECTS)
            .insert(project)
            .select('*')
            .single()

        if (error) {
            console.error('Error creating project:', error)
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR)
        }

        return createSuccessResponse(data as Project)
    } catch (error) {
        console.error('Unexpected error in createProject:', error)
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR)
    }
}