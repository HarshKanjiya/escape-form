import { getSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteParams = {
    params: Promise<{
        formId: string;
        id: string;
    }>
};

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error, user } = await validateAuth()
    if (error) return getAuthErrorResponse();
    
    const { formId, id } = await params;
    
    if (!formId) return getErrorResponse('Form ID is required');
    if (!id) return getErrorResponse('Password ID is required');

    try {
        // Check if form exists
        const existingForm = await prisma.form.findUnique({
            where: { id: formId },
            select: { id: true }
        });

        if (!existingForm) {
            return getErrorResponse('Form not found', { status: 404 });
        }

        // Check if password exists and belongs to the form
        const existingPassword = await prisma.activePassword.findUnique({
            where: { id },
            select: { formId: true }
        });

        if (!existingPassword) {
            return getErrorResponse('Password not found', { status: 404 });
        }

        if (existingPassword.formId !== formId) {
            return getErrorResponse('Password does not belong to this form', { status: 403 });
        }

        await prisma.activePassword.delete({
            where: { id }
        });

        return getSuccessResponse(null, getSuccessMessage('Password deleted successfully'));
    } catch (error) {
        console.error('Error deleting password:', error);
        return getErrorResponse('Failed to delete password', { status: 500 });
    }
});
