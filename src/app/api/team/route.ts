import { createSuccessMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import { createActionError, createActionSuccess, createSuccessResponse, createValidationErrorResponse, HttpStatus, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { getPaginationParams, parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    const { userId } = await auth();
    console.log('userId :>> ', userId);
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);
    const { limit, offset } = getPaginationParams(request);
    
    const teams = await prisma.team.findMany({
        where: { ownerId: user!.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
    })
    
    console.log('teamssdf  :>> ', teams, user!.id, userId);

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