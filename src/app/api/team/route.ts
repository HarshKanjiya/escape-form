import { createSuccessMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import { createActionError, createActionSuccess, createSuccessResponse, createValidationErrorResponse, HttpStatus, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const teams = await prisma.team.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
    })

    return createActionSuccess(teams, getSuccessMessage('Teams'));
});

export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

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