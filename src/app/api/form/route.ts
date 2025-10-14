import { getSuccessMessage, MESSAGE } from "@/constants/messages";
import { Form, FormStatus, FormType } from "@/generated/prisma";
import { createActionError, createActionSuccess, createValidationErrorResponse, validateRequiredFields, withErrorHandler } from "@/lib/api-response";
import { getPaginationParams, parseRequestBody, validateAuth } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/common";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Form[]>

    const { limit, offset } = getPaginationParams(request);
    const projectId = request.nextUrl.searchParams.get('projectId') || '';
    if (!projectId) return createActionError('projectId is required') as ActionResponse<Form[]>

    const forms = await prisma.form.findMany({
        where: { projectId: projectId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
    })

    return createActionSuccess(forms, getSuccessMessage('Forms'));

})


export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Form>

    const body: Partial<Form> = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body,
        ['name', 'projectId']
    );
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const form = prisma.form.create({
        data: {
            name: body.name!.trim(),
            description: body.description?.trim(),
            projectId: body.projectId!,
            allowAnonymous: body.allowAnonymous || false,
            theme: body.theme || 'light',
            analyticsEnabled: body.analyticsEnabled || false,
            logoUrl: body.logoUrl?.trim() || null,
            requireConsent: body.requireConsent || false,
            status: FormStatus.DRAFT,
            maxResponses: body.maxResponses || null,
            type: FormType.REACH_OUT,
            multipleSubmissions: body.multipleSubmissions || false,
            thankYouScreen: body.thankYouScreen || {},
            config: body.config || {},
            welcomeScreen: body.welcomeScreen || {},
            customDomain: null,
            uniqueSubdomain: null,
            passwordProtected: body.passwordProtected || false,
            openAt: body.openAt || null,
            closeAt: body.closeAt || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: user!.id,
        }
    })
    return createActionSuccess(form, getSuccessMessage('Form created successfully'));
});

export const PUT = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Form>
    const body: Partial<Form> & { id?: string } = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body,
        ['id', 'name', 'projectId']
    );
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);
    const existingForm = await prisma.form.findFirst({
        where: { id: body.id, createdBy: user!.id }
    });
    if (!existingForm) return createActionError(MESSAGE.FORM_NOT_FOUND_OR_ACCESS_DENIED) as ActionResponse<Form>
    const updatedForm = await prisma.form.update({
        where: { id: body.id },
        data: {
            ...body
        },
    });
    return createActionSuccess(updatedForm, getSuccessMessage('Form updated successfully'));
});
