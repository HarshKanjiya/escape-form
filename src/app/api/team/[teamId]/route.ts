import { deleteErrorMessage, deleteSuccessMessage, MESSAGE, updateSuccessMessage } from '@/constants/messages';
import { createActionError, createSuccessResponse, createValidationErrorResponse, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const PATCH = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const body = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body, ['name']);
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const teamId = request.nextUrl.pathname.split('/').pop() || null;
    if (!teamId) return createValidationErrorResponse({ id: ['Team Id is required'] }, MESSAGE.MISSING_FIELDS_MESSAGE);

    const { name, ownerId } = body;
    if (name?.length <= 3) return createValidationErrorResponse({ name: ['Name must be at least 4 characters long'] }, MESSAGE.INVALID_DATA_MESSAGE);

    const team = await prisma.team.findFirst({
        where: { id: teamId, ownerId: user!.id },
    });
    if (!team) return createActionError(MESSAGE.TEAM_NOT_FOUND_OR_ACCESS_DENIED);

    const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: {
            name: name.trim(),
            ownerId: ownerId || team.ownerId,
        },
    });
    return createSuccessResponse(updatedTeam, updateSuccessMessage('Team'));
});

export const DELETE = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const teamId = request.nextUrl.pathname.split('/').pop() || null;
    if (!teamId) return createValidationErrorResponse({ id: ['Team Id is required'] }, MESSAGE.MISSING_FIELDS_MESSAGE);

    const team = await prisma.team.findFirst({ where: { id: teamId, ownerId: user!.id } });
    if (!team) return createActionError(MESSAGE.TEAM_NOT_FOUND_OR_ACCESS_DENIED);

    const res = await prisma.team.delete({ where: { id: teamId } });
    if (!res) return createActionError(deleteErrorMessage('Team'));

    return createSuccessResponse(null, deleteSuccessMessage('Team'));
});