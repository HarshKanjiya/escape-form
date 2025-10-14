import { createSuccessMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import { createActionError, createActionSuccess, createSuccessResponse, createValidationErrorResponse, HttpStatus, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { getPaginationParams, parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma, Team } from '@/lib/prisma';
import { ActionResponse } from '@/types/common';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Team[]>

    const { limit, offset } = getPaginationParams(request);

    const teams = await prisma.team.findMany({
        where: { ownerId: user!.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
    })

    return createActionSuccess(teams, getSuccessMessage('Teams'));
});

export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED) as ActionResponse<Team>

    const body = await parseRequestBody(request);
    const validationErrors = validateRequiredFields(body, ['name']);
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const newTeam = await prisma.team.create({
        data: {
            name: body.name.trim(),
            ownerId: user!.id,
        },
    });

    return createSuccessResponse(newTeam, createSuccessMessage('Team'), HttpStatus.CREATED);
});