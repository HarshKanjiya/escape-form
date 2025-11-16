import { getSuccessMessage, MESSAGE } from "@/constants/messages";
import { createActionError, createActionSuccess, withErrorHandler } from "@/lib/api-response";
import { validateAuth } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { isValidUUID } from "@/lib/utils";
import { NextRequest } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED)

    const { projectId } = await params;
    if (!projectId || !isValidUUID(projectId)) return createActionError('projectId is required');

    const project = await prisma.project.findFirst({
        where: { id: projectId },
        orderBy: { createdAt: 'desc' },
    })

    return createActionSuccess(project, getSuccessMessage('Project'));

})

// export const PUT = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) => {

//     const { user, error } = await validateAuth()
//     if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED)

//     const body: Partial<Form> & { id?: string } = await parseRequestBody(request);
//     const validationErrors = validateRequiredFields(body,
//         ['id', 'name', 'projectId']
//     );
//     if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);
//     const existingForm = await prisma.form.findFirst({
//         where: { id: body.id, createdBy: user!.id }
//     });
//     // if (!existingForm) return createActionError(MESSAGE.FORM_NOT_FOUND_OR_ACCESS_DENIED)
//     // const updatedForm = await prisma.form.update({
//     //     where: { id: formId },
//     //     data: {
//     //         name: body.name?.trim() ?? existingForm.name,
//     //         description: body.description?.trim() ?? existingForm.description,
//     //         allowAnonymous: body.allowAnonymous ?? existingForm.allowAnonymous,
//     //         theme: body.theme ?? existingForm.theme,
//     //         analyticsEnabled: body.analyticsEnabled ?? existingForm.analyticsEnabled,
//     //         logoUrl: body.logoUrl?.trim() ?? existingForm.logoUrl,
//     //         requireConsent: body.requireConsent ?? existingForm.requireConsent,
//     //         maxResponses: body.maxResponses ?? existingForm.maxResponses,
//     //         type: body.type ?? existingForm.type,
//     //         multipleSubmissions: body.multipleSubmissions ?? existingForm.multipleSubmissions,
//     //         thankYouScreen: body.thankYouScreen ?? (existingForm.thankYouScreen as any),
//     //         config: body.config === undefined ? existingForm.config : (body.config as any),
//     //         welcomeScreen: body.welcomeScreen ?? (existingForm.welcomeScreen as any),
//     //         customDomain: body.customDomain ?? existingForm.customDomain,
//     //         uniqueSubdomain: body.uniqueSubdomain ?? existingForm.uniqueSubdomain,
//     //         passwordProtected: body.passwordProtected ?? existingForm.passwordProtected,
//     //         openAt: body.openAt ?? existingForm.openAt,
//     //         closeAt: body.closeAt ?? existingForm.closeAt,
//     //         status: body.status ?? existingForm.status,
//     //         updatedAt: new Date(),
//     //     },
//     // });
//     return createActionSuccess(updatedForm, updateSuccessMessage('Form'));
// });
