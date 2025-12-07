import { getSuccessMessage, MESSAGE, updateSuccessMessage } from "@/constants/messages";
import { Form } from "@prisma/client";
import { getErrorResponse, getSuccessResponse, createValidationErrorResponse, validateRequiredFields, withErrorHandler } from "@/lib/api-response";
import { parseRequestBody, validateAuth } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { isValidUUID } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {

    const { error } = await validateAuth()
    if (error) return getErrorResponse(MESSAGE.AUTHENTICATION_REQUIRED)

    const { formId } = await params;
    if (!formId || !isValidUUID(formId)) return getErrorResponse('formId is required')

    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: {
            questions: {
                orderBy: {
                    sortOrder: "asc"
                }
            },
            edges: true
        }
    })

    return getSuccessResponse(form, getSuccessMessage('Form'));

})

export const PUT = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ formId: string }> }) => {

    const { user, error } = await validateAuth()
    if (error) return getErrorResponse(MESSAGE.AUTHENTICATION_REQUIRED)

    const { formId } = await params;
    if (!formId || !isValidUUID(formId)) return getErrorResponse('formId is required');

    const body: Partial<Form> & { id?: string } = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body,
        ['id']
    );
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);
    const existingForm = await prisma.form.findFirst({
        where: { id: body.id, createdBy: user!.id }
    });
    if (!existingForm) return getErrorResponse(MESSAGE.FORM_NOT_FOUND_OR_ACCESS_DENIED)
    const updatedForm = await prisma.form.update({
        where: { id: formId },
        data: {
            logoUrl: body.logoUrl?.trim() ?? existingForm.logoUrl,
            requireConsent: body.requireConsent ?? existingForm.requireConsent,
            maxResponses: body.maxResponses ?? existingForm.maxResponses,
            type: body.type ?? existingForm.type,
            formPageType: body.formPageType ?? existingForm.formPageType,
            multipleSubmissions: body.multipleSubmissions ?? existingForm.multipleSubmissions,
            customDomain: body.customDomain ?? existingForm.customDomain,
            uniqueSubdomain: body.uniqueSubdomain ?? existingForm.uniqueSubdomain,
            passwordProtected: body.passwordProtected ?? existingForm.passwordProtected,
            openAt: body.openAt ?? existingForm.openAt,
            closeAt: body.closeAt ?? existingForm.closeAt,
            status: body.status ?? existingForm.status,
            allowAnonymous: body.allowAnonymous ?? existingForm.allowAnonymous,
            analyticsEnabled: body.analyticsEnabled ?? existingForm.analyticsEnabled,
            description: body.description?.trim() ?? existingForm.description,
            name: body.name?.trim() ?? existingForm.name,
            theme: body.theme ?? existingForm.theme,
            updatedAt: new Date(),
        },
    });
    return getSuccessResponse(updatedForm, updateSuccessMessage('Form'));
});
