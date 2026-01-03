import { getErrorMessage, getSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { getPaginationParams, validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteParams = {
    params: Promise<{
        formId: string;
    }>
};

export const GET = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error, user } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));

    const form = await prisma.form.findUnique({
        where: { id: formId },
    });

    if (!form) return getErrorResponse(getErrorMessage('Form not found'));
    if (form.createdBy != user.id) return getAuthErrorResponse();

    let { limit, offset, orderBy, orderDirection } = getPaginationParams(request);
    if (orderBy == 'createdAt') orderBy = 'startedAt';

    // Get all responses for this form

    const where = {
        formId: formId,
        valid: true
    }

    const [responses, total] = await Promise.all([
        prisma.response.findMany({
            where,
            orderBy: { [orderBy]: orderDirection },
            take: limit,
            skip: offset,
        }),
        prisma.response.count({ where })
    ]);


    return getSuccessResponse(responses, getSuccessMessage('Responses'), total);
});
