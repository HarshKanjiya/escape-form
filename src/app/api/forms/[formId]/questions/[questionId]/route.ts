import { createSuccessMessage, deleteErrorMessage, deleteSuccessMessage, getErrorMessage, getSuccessMessage, MESSAGE, updateErrorMessage, updateSuccessMessage } from '@/constants/messages';
import { createActionError, createActionSuccess, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { Question } from '@/types/form';
import { NextRequest } from 'next/server';

export const PATCH = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ questionId: string }> }) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const { questionId } = await params;
    if (!questionId) return createActionError(getErrorMessage('Question ID'));

    const body = await parseRequestBody<Partial<Question>>(request);
    if (!Object.keys(body).length) return createSuccessMessage(updateSuccessMessage('Questions'));

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return createActionError(getErrorMessage('Question'));

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

    if (!res) return createActionError(updateErrorMessage('Question'));

    return createActionSuccess(res, updateSuccessMessage('Question'));
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ questionId: string }> }) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const { questionId } = await params;
    if (!questionId) return createActionError(getErrorMessage('Question ID'));

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return createActionError(getErrorMessage('Question'));

    const res = await prisma.question.delete({ where: { id: questionId } });
    if (!res) return createActionError(deleteErrorMessage('Question'));

    return createActionSuccess(res, deleteSuccessMessage('Question'));
});