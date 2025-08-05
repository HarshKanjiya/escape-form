"use server"

import { ACTION_ERRORS, TABLES } from "@/enums/common";
import { supabase } from "@/lib/supabase/supabase";
import { ActionResponse, createErrorResponse, createSuccessResponse } from "@/types/common";
import { Form, FormInsert, FormUpdate } from "@/types/db";
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

export const createNewForm = async (form: FormInsert): Promise<ActionResponse<FormInsert>> => {
    try {
        const { userId } = await auth()
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED)

        const { data: newForm, error } = await supabase
            .from(TABLES.FORMS)
            .insert({ ...form, created_by: userId })
            .single();

        if (error) {
            console.error('Error creating new form:', error)
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR)
        }

        return createSuccessResponse(newForm)
    } catch (error) {
        console.error('Unexpected error in createNewForm:', error)
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR)
    }
}

export const updateFormData = async (form: Partial<FormUpdate>): Promise<ActionResponse<FormUpdate>> => {
    try {
        const { userId } = await auth();
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED);
        if (!form.id) return createErrorResponse(ACTION_ERRORS.FORBIDDEN, 'Form ID is required');

        const { data: updatedForm, error } = await supabase
            .from(TABLES.FORMS)
            .update(form)
            .eq('id', form.id)
            .single();

        if (error) {
            console.error('Error updating form:', error)
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR)
        }

        return createSuccessResponse(updatedForm)
    } catch (error) {
        console.error('Unexpected error in updateForm:', error)
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR)
    }
}

export const getFormById = async (formId: string): Promise<ActionResponse<Form | null>> => {
    try {
        const { userId } = await auth();
        if (!userId) return createErrorResponse(ACTION_ERRORS.UNAUTHORIZED);

        const { data: form, error } = await supabase
            .from(TABLES.FORMS)
            .select('*')
            .eq('id', formId)
            .single();

        if (error) {
            console.error('Error fetching form by ID:', error);
            return createErrorResponse(ACTION_ERRORS.DATABASE_ERROR);
        }

        return createSuccessResponse(form || null);
    } catch (error) {
        console.error('Unexpected error in getFormById:', error);
        return createErrorResponse(ACTION_ERRORS.UNEXPECTED_ERROR);
    }
}