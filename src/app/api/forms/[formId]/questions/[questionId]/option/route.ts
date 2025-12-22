import { createErrorMessage, createSuccessMessage, deleteErrorMessage, deleteSuccessMessage, getErrorMessage, getSuccessMessage } from "@/constants/messages";
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from "@/lib/api-response";
import { parseRequestBody, validateAuth } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse } from "@/types/common";
import { QuestionOption } from "@prisma/client";
import { NextRequest } from "next/server";

type RouteParams = {
    params: Promise<{
        formId: string;
        questionId: string;
    }>
};

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    // Get optionId from query parameters
    const { searchParams } = new URL(request.url);
    const optionId = searchParams.get('optionId');

    if (!optionId) return getErrorResponse(getErrorMessage('Option ID'));

    const option = await prisma.questionOption.findUnique({ where: { id: optionId } });
    if (!option) return getErrorResponse(getErrorMessage('Option'));

    const res = await prisma.questionOption.delete({ where: { id: optionId } });
    if (!res) return getErrorResponse(deleteErrorMessage('Option'));

    return getSuccessResponse(res, deleteSuccessMessage('Option'));
});


export const POST = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const body = await parseRequestBody<QuestionOption>(request);
    if (!body) return getErrorResponse(getErrorMessage('Option'));

    const { formId, questionId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));
    if (!questionId) return getErrorResponse(getErrorMessage('Question ID'));

    // Check if id is null or empty - if so, create new option, otherwise update
    if (!body.id || body.id === '') {
        // Create new option
        const newOption = await prisma.questionOption.create({
            data: {
                questionId: body.questionId,
                label: body.label!,
                value: body.value!,
                sortOrder: body.sortOrder!,
            }
        });

        if (!newOption) return getErrorResponse(createErrorMessage('Option'));
        return getSuccessResponse(newOption, createSuccessMessage('Option'));
    } else {
        // Update existing option
        const updatedOption = await prisma.questionOption.update({
            where: { id: body.id },
            data: {
                label: body.label!,
                value: body.value!,
                sortOrder: body.sortOrder!,
            }
        });

        if (!updatedOption) return getErrorResponse('Failed to update option');
        return getSuccessResponse(updatedOption, 'Option updated successfully');
    }
});


export const GET = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { questionId } = await params;
    if (!questionId) return getErrorResponse(getErrorMessage('Question ID'));

    const questions = await prisma.questionOption.findMany({
        where: { questionId: questionId },
        orderBy: { sortOrder: 'asc' },
    })

    return getSuccessResponse(questions, getSuccessMessage('Question options'));
});
