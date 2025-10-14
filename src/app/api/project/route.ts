import { createSuccessMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import {
    createActionError,
    createActionSuccess,
    createNotFoundResponse,
    createSuccessResponse,
    createValidationErrorResponse,
    HttpStatus,
    validateRequiredFields,
    withErrorHandler,
} from '@/lib/api-response';
import { getPaginationParams, parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma, Project } from '@/lib/prisma';
import { ActionResponse } from '@/types/common';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Project[]>

    const { limit, offset } = getPaginationParams(request);
    const teamId = request.nextUrl.searchParams.get('teamId') || '';

    if (!teamId) return createValidationErrorResponse({ teamId: ['teamId is required'] }, MESSAGE.MISSING_FIELDS_MESSAGE);

    const projects = await prisma.project.findMany({
        where: { teamId: teamId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
    })

    return createActionSuccess(projects, getSuccessMessage('Projects'));
});

export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Project>

    const body = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body, ['name', 'teamId']);

    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const { name, description, teamId } = body;

    const team = await prisma.team.findFirst({
        where: { id: teamId, ownerId: user!.id },
    });

    if (!team) return createNotFoundResponse(MESSAGE.TEAM_NOT_FOUND_OR_ACCESS_DENIED);

    const newProject = await prisma.project.create({
        data: {
            name: name.trim(),
            description: description?.trim(),
            teamId,
        }
    });

    return createSuccessResponse(newProject, createSuccessMessage('Project'), HttpStatus.CREATED);
});
