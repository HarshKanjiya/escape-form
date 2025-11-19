import { getSuccessMessage, MESSAGE } from "@/constants/messages";
import { Form, FormStatus, FormType } from "@/generated/prisma";
import { createActionError, createActionSuccess, createValidationErrorResponse, validateRequiredFields, withErrorHandler } from "@/lib/api-response";
import { getPaginationParams, parseRequestBody, validateAuth } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED)

    const { limit, offset } = getPaginationParams(request);
    const projectId = request.nextUrl.searchParams.get('projectId') || '';
    if (!projectId) return createActionError('projectId is required')

    const forms = await prisma.form.findMany({
        where: { projectId: projectId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
            _count: {
                select: {
                    responses: true
                }
            }
        }
    })

    return createActionSuccess(forms, getSuccessMessage('Forms'));

})


export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED)

    const body: Partial<Form> = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body,
        ['name', 'projectId']
    );
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const project = await prisma.project.findUnique({
        where: { id: body.projectId! },
    });
    if (!project) return createActionError('Project not found');

    const form = await prisma.form.create({
        data: {
            name: body.name!.trim(),
            description: body.description?.trim(),
            projectId: body.projectId!,
            teamId: project.teamId,
            allowAnonymous: body.allowAnonymous || false,
            theme: body.theme || 'light',
            analyticsEnabled: body.analyticsEnabled || false,
            logoUrl: body.logoUrl?.trim() || null,
            requireConsent: body.requireConsent || false,
            status: FormStatus.DRAFT,
            maxResponses: body.maxResponses || null,
            type: FormType.REACH_OUT,
            multipleSubmissions: body.multipleSubmissions || false,
            
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