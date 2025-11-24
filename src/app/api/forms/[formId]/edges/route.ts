import { getErrorMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import { Edge } from '@/generated/prisma';
import { createValidationErrorResponse, getAuthErrorResponse, getErrorResponse, getSuccessResponse, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
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

    const edges = await prisma.edge.findMany({
        where: { formId: formId }
    })

    return getSuccessResponse(edges, getSuccessMessage('Edges'));
});

export const POST = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const body = await parseRequestBody<Partial<Edge>>(request);
    if (!body) return getErrorResponse(getErrorMessage('Edge'));

    const validationErrors = validateRequiredFields(body, ['sourceNodeId', 'targetNodeId']);
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));

    const edges = await prisma.edge.create({
        data: {
            formId: formId,
            sourceNodeId: body.sourceNodeId!,
            targetNodeId: body.targetNodeId!,
        }
    })

    return getSuccessResponse(edges, getSuccessMessage('Edges'));
});