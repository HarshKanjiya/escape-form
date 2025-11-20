import { deleteErrorMessage, deleteSuccessMessage, MESSAGE, updateSuccessMessage } from '@/constants/messages';
import { createValidationErrorResponse, getAuthErrorResponse, getErrorResponse, getSuccessResponse, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const PATCH = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ teamId: string }> }) => {

    const { user, error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const body = await parseRequestBody<{ name: string, ownerId?: string }>(request);
    const validationErrors = validateRequiredFields(body, ['name']);
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const { teamId } = await params;
    if (!teamId) return createValidationErrorResponse({ id: ['Team Id is required'] }, MESSAGE.MISSING_FIELDS_MESSAGE);

    const { name, ownerId } = body;
    if (name?.length <= 3) return createValidationErrorResponse({ name: ['Name must be at least 4 characters long'] }, MESSAGE.INVALID_DATA_MESSAGE);

    const team = await prisma.team.findFirst({
        where: { id: teamId, ownerId: user!.id },
    });
    if (!team) return getErrorResponse(MESSAGE.TEAM_NOT_FOUND_OR_ACCESS_DENIED);

    const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: {
            name: name.trim(),
            ownerId: ownerId || team.ownerId,
        },
    });
    return getSuccessResponse(updatedTeam, updateSuccessMessage('Team'));
});

export const DELETE = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const teamId = request.nextUrl.pathname.split('/').pop() || null;
    if (!teamId) return createValidationErrorResponse({ id: ['Team Id is required'] }, MESSAGE.MISSING_FIELDS_MESSAGE);

    const team = await prisma.team.findFirst({ where: { id: teamId, ownerId: user!.id } });
    if (!team) return getErrorResponse(MESSAGE.TEAM_NOT_FOUND_OR_ACCESS_DENIED);

    const res = await prisma.team.delete({ where: { id: teamId } });
    if (!res) return getErrorResponse(deleteErrorMessage('Team'));

    return getSuccessResponse(null, deleteSuccessMessage('Team'));
});