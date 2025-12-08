import { getErrorMessage, getSuccessMessage } from '@/constants/messages';
import { Question } from '@prisma/client';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
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

    const questions = await prisma.question.findMany({
        where: { formId: formId },
        orderBy: { sortOrder: 'asc' },
    })

    return getSuccessResponse(questions, getSuccessMessage('Questions'));
});

export const POST = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const body = await parseRequestBody<{ data: Partial<Question>[] }>(request);
    if (!body?.data?.length) return getErrorResponse(getErrorMessage('Questions'));

    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));

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
    if (body.data[0].sortOrder) {
        const prevLastQuestion = await prisma.question.findFirst({
            where: { formId: formId, sortOrder: body.data[0].sortOrder - 1 },
        });
        await prisma.edge.create({
            data: {
                formId: formId,
                sourceNodeId: prevLastQuestion!.id,
                targetNodeId: questions[0].id,
            },
        })
    }
    if (questions.length > 1) {
        questions.slice(1).forEach(async (question, index) => {
            if (!question.sortOrder) return;
            const prevQuestion = questions[index];
            await prisma.edge.create({
                data: {
                    formId: formId,
                    sourceNodeId: prevQuestion.id,
                    targetNodeId: question.id,
                },
            })
        });
    }

    // const prevQuestions = await prisma.question.findMany({
    //     where: { formId: formId, sortOrder: question.sortOrder - 1 },
    // });

    return getSuccessResponse(questions, getSuccessMessage('Questions'));
});