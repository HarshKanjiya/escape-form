export const dynamic = 'force-dynamic';

import { deleteErrorMessage, deleteSuccessMessage, getErrorMessage, updateErrorMessage, updateSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { Question } from '@/types/form';
import { NextRequest } from 'next/server';

type RouteParams = {
    params: Promise<{
        questionId: string;
        formId: string;
    }>
};

export const PATCH = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { questionId } = await params;
    if (!questionId) return getErrorResponse(getErrorMessage('Question ID'));

    const body = await parseRequestBody<Partial<Question>>(request);
    if (!Object.keys(body).length) return getErrorResponse(updateSuccessMessage('Questions'));

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return getErrorResponse(getErrorMessage('Question'));

    let metadata = {
        ...Object(question.metadata),
    }
    if (body.metadata) metadata = { ...metadata, ...body.metadata, }

    const res = await prisma.question.update({
        where: { id: questionId },
        data: {
            title: body.title || question.title,
            description: body.description || question.description,
            placeholder: body.placeholder || question.placeholder,
            required: body.required || question.required,
            type: body.type || question.type,
            sortOrder: body.sortOrder || question.sortOrder,
            posX: body.posX || question.posX,
            posY: body.posY || question.posY,
            metadata: metadata
        }
    })

    if (!res) return getErrorResponse(updateErrorMessage('Question'));

    return getSuccessResponse(res, updateSuccessMessage('Question'));
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { questionId } = await params;
    if (!questionId) return getErrorResponse(getErrorMessage('Question ID'));

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return getErrorResponse(getErrorMessage('Question'));

    const res = await prisma.question.delete({ where: { id: questionId } });
    if (!res) return getErrorResponse(deleteErrorMessage('Question'));

    return getSuccessResponse(res, deleteSuccessMessage('Question'));
});