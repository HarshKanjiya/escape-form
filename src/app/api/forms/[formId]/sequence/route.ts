import { getSuccessMessage, MESSAGE } from "@/constants/messages";
import { getErrorResponse, getSuccessResponse, withErrorHandler } from "@/lib/api-response";
import { parseRequestBody, validateAuth } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { isValidUUID } from "@/lib/utils";
import { NextRequest } from "next/server";

type RouteParams = {
    params: Promise<{
        formId: string;
    }>
};


export const POST = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { user, error } = await validateAuth()
    if (error) return getErrorResponse(MESSAGE.AUTHENTICATION_REQUIRED)

    const { formId } = await params;
    if (!formId || !isValidUUID(formId)) return getErrorResponse('formId is required');

    const form = await prisma.form.findUnique({
        where: { id: formId },
    });
    if (!form) return getErrorResponse('Form not found');

    if (form.createdBy !== user.id) return getErrorResponse(MESSAGE.UNAUTHORIZED);

    const { sequence }: { sequence: Array<{ id: string; newOrder: number }> } = await parseRequestBody(request);

    if (!sequence || !Array.isArray(sequence)) {
        return getErrorResponse('Invalid sequence data');
    }

    await prisma.$transaction(
        sequence.map((item) =>
            prisma.question.update({
                where: { id: item.id },
                data: { sortOrder: item.newOrder },
            })
        )
    );

    return getSuccessResponse(null, getSuccessMessage('Question order updated successfully'));
});