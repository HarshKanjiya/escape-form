import { getErrorMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import { Question } from '@/generated/prisma';
import { createActionError, createActionSuccess, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const { formId } = await params;
    if (!formId) return createActionError(getErrorMessage('Form ID'));

    const questions = await prisma.question.findMany({
        where: { formId: formId },
        orderBy: { sortOrder: 'asc' },
    })

    return createActionSuccess(questions, getSuccessMessage('Questions'));
});

export const POST = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const body = await parseRequestBody<{ data: Partial<Question>[] }>(request);
    if (!body?.data?.length) return createActionError(getErrorMessage('Questions'));

    const { formId } = await params;
    if (!formId) return createActionError(getErrorMessage('Form ID'));

    const questions = await prisma.question.createManyAndReturn({
        data: body.data.map((question) => ({
            formId: formId,
            posX: question.posX || 0,
            posY: question.posY || 0,
            sortOrder: question.sortOrder!,
            type: question.type!,
            title: question.title!,
            required: question.required || false,
            description: question.description || '',
            placeholder: question.placeholder || '',
            metadata: question.metadata || {},
        })),
    })

    return createActionSuccess(questions, getSuccessMessage('Questions'));
});