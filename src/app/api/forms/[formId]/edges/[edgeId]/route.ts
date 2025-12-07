export const dynamic = 'force-dynamic';

import { deleteErrorMessage, deleteSuccessMessage, getErrorMessage, updateErrorMessage, updateSuccessMessage } from '@/constants/messages';
import { Edge } from '@prisma/client';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteParams = {
    params: Promise<{
        edgeId: string;
        formId: string;
    }>
};

export const PATCH = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { edgeId } = await params;
    if (!edgeId) return getErrorResponse(getErrorMessage('Edge ID'));

    const body = await parseRequestBody<Partial<Edge>>(request);
    if (!Object.keys(body).length) return getErrorResponse(updateSuccessMessage('Edges'));

    const edge = await prisma.edge.findUnique({ where: { id: edgeId } });
    if (!edge) return getErrorResponse(getErrorMessage('Edge'));

    const res = await prisma.edge.update({
        where: { id: edgeId },
        data: {
            sourceNodeId: body.sourceNodeId ?? edge.sourceNodeId,
            targetNodeId: body.targetNodeId ?? edge.targetNodeId,
            // @ts-expect-error json check
            condition: body.condition ?? edge.condition,
        }
    })

    if (!res) return getErrorResponse(updateErrorMessage('Edge'));

    return getSuccessResponse(res, updateSuccessMessage('Edge'));
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { edgeId } = await params;
    if (!edgeId) return getErrorResponse(getErrorMessage('Edge ID'));

    const edge = await prisma.edge.findUnique({ where: { id: edgeId } });
    if (!edge) return getErrorResponse(getErrorMessage('Edge'));

    const res = await prisma.edge.delete({ where: { id: edgeId } });
    if (!res) return getErrorResponse(deleteErrorMessage('Edge'));

    return getSuccessResponse(res, deleteSuccessMessage('Edge'));
});