"use server"

import { ACTION_ERRORS, TABLES } from "@/enums/common";
import { supabase } from "@/lib/supabase/supabase";
import { ActionResponse, createErrorResponse, createSuccessResponse } from "@/types/common";
import { Form } from "@/types/db";
import { auth } from "@clerk/nextjs/server";


export const getProjectForms = async (projectId: string): Promise<ActionResponse<Form[]>> => {
    try {
        const { userId } = await auth()
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED)

        // Get teams where user is either owner or member
        const { data: forms, error } = await supabase
            .from(TABLES.FORMS)
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user forms:', error)
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR)
        }

        return createSuccessResponse(forms || [])
    } catch (error) {
        console.error('Unexpected error in getTeamProjects:', error)
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR)
    }
}