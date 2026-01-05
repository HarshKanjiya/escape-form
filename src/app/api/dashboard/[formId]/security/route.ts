import { getErrorMessage, getSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';

type RouteParams = {
    params: Promise<{
        formId: string;
    }>
};

// Validation schema for security settings
const securitySchema = z.object({
    maxResponses: z.number().min(1).optional(),
    openAt: z.string().optional(),
    closeAt: z.string().optional(),
    requireConsent: z.boolean(),
    allowAnonymous: z.boolean(),
    multipleSubmissions: z.boolean(),
    passwordProtected: z.boolean(),
});

export const PUT = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error, user } = await validateAuth()
    if (error) return getAuthErrorResponse();
    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));

    const body = await parseRequestBody(request);

    const validationResult = securitySchema.safeParse(body);
    if (!validationResult.success) {
        const errors: Record<string, string[]> = {};
        for (const issue of validationResult.error.issues) {
            const key = issue.path.join('.') || 'form';
            if (!errors[key]) errors[key] = [];
            errors[key].push(issue.message);
        }
        return getErrorResponse('Invalid security settings data', { errors });
    }

    const settingsData = validationResult.data;

    try {
        // Check if form exists and user has access
        const existingForm = await prisma.form.findUnique({
            where: { id: formId },
            select: { id: true }
        });

        if (!existingForm) {
            return getErrorResponse(getErrorMessage('Form not found'), { status: 404 });
        }

        const updatedForm = await prisma.form.update({
            where: { id: formId },
            data: {
                maxResponses: settingsData.maxResponses,
                openAt: settingsData.openAt ? new Date(settingsData.openAt) : null,
                closeAt: settingsData.closeAt ? new Date(settingsData.closeAt) : null,
                requireConsent: settingsData.requireConsent,
                allowAnonymous: settingsData.allowAnonymous,
                multipleSubmissions: settingsData.multipleSubmissions,
                passwordProtected: settingsData.passwordProtected,
            },
            select: {
                id: true,
                maxResponses: true,
                openAt: true,
                closeAt: true,
                requireConsent: true,
                allowAnonymous: true,
                multipleSubmissions: true,
                passwordProtected: true,
                updatedAt: true
            }
        });

        return getSuccessResponse(updatedForm, getSuccessMessage('Security settings updated successfully'));
    } catch (error) {
        console.error('Error updating security settings:', error);
        return getErrorResponse('Failed to update security settings', { status: 500 });
    }
});
