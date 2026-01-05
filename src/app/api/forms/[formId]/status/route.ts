import { getSuccessMessage, MESSAGE } from "@/constants/messages";
import { FormStatus } from "@prisma/client";
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

    const { action }: { action: FormStatus } = await parseRequestBody(request);

    const res = await prisma.form.update({
        where: { id: formId },
        data: { status: action },
    })
    return getSuccessResponse(res, getSuccessMessage('Form status updated successfully'));
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { user, error } = await validateAuth()
    if (error) return getErrorResponse(MESSAGE.AUTHENTICATION_REQUIRED)

    const { formId } = await params;
    if (!formId || !isValidUUID(formId)) return getErrorResponse('formId is required');

    const form = await prisma.form.findUnique({
        where: { id: formId },
    });
    if (!form) return getErrorResponse('Form not found');

    if (form.createdBy !== user.id) return getErrorResponse(MESSAGE.UNAUTHORIZED);



    const res = await prisma.form.update({
        where: { id: formId },
        data: { valid: false },
    })
    return getSuccessResponse(res, getSuccessMessage('Form Deleted successfully'));
});