import { getErrorMessage, getSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteParams = {
    params: Promise<{
        formId: string;
    }>
};

export const GET = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));


    // Get all responses for this form
    const responses = await prisma.question.findMany({
        where: {
            formId: formId,
        },
        orderBy: {
            sortOrder: 'asc'
        },
        include: {
            options: true
        }
    });


    return getSuccessResponse(responses, getSuccessMessage('Questions'));
});
