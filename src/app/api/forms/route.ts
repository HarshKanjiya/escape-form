import { getSuccessMessage, MESSAGE } from "@/constants/messages";
import { Form, FormStatus, FormType } from "@prisma/client";
import { getErrorResponse, getSuccessResponse, createValidationErrorResponse, validateRequiredFields, withErrorHandler } from "@/lib/api-response";
import { getPaginationParams, parseRequestBody, validateAuth } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { getRandomString } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { error } = await validateAuth()
    if (error) return getErrorResponse(MESSAGE.AUTHENTICATION_REQUIRED)

    const { limit, offset } = getPaginationParams(request);
    const projectId = request.nextUrl.searchParams.get('projectId') || '';
    if (!projectId) return getErrorResponse('projectId is required')

    const [forms, total] = await Promise.all([
        prisma.form.findMany({
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
        }),
        prisma.form.count({
            where: {
                projectId: projectId,
                valid: true
            }
        })
    ]);


    return getSuccessResponse(forms, getSuccessMessage('Forms'), total);

})


export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return getErrorResponse(MESSAGE.AUTHENTICATION_REQUIRED)

    const body: Partial<Form> = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body,
        ['name', 'projectId']
    );
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const project = await prisma.project.findUnique({
        where: { id: body.projectId! },
    });
    if (!project) return getErrorResponse('Project not found');

    let uniqueSubdomain = getRandomString(8);

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
            uniqueSubdomain: uniqueSubdomain,
            passwordProtected: body.passwordProtected || false,
            openAt: body.openAt || null,
            closeAt: body.closeAt || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: user!.id,
        }
    })
    return getSuccessResponse(form, getSuccessMessage('Form created successfully'));
});