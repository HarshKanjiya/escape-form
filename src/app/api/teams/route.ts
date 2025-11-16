import { createErrorMessage, createSuccessMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import { createActionError, createActionSuccess, createSuccessResponse, createValidationErrorResponse, HttpStatus, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { getPaginationParams, parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const { limit, offset, orderBy, orderDirection } = getPaginationParams(request);
    const search = request.nextUrl.searchParams.get('search') || '';

    let where: Record<string, unknown> = { ownerId: user.id };
    if (search) {
        where = {
            ownerId: user.id,
            name: {
                contains: search,
                mode: 'insensitive'
            }
        };
    }

    const teams = await prisma.team.findMany({
        where,
        orderBy: { [orderBy]: orderDirection },
        take: limit,
        skip: offset,
    })

    return createActionSuccess(teams, getSuccessMessage('Teams'));
});

export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return createActionError(MESSAGE.AUTHENTICATION_REQUIRED);

    const body = await parseRequestBody<{ name: string }>(request);
    const validationErrors = validateRequiredFields(body, ['name']);
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const newTeam = await prisma.team.create({
        data: {
            name: body.name.trim(),
            ownerId: user!.id,
        },
    });
    if (!newTeam) return createActionError(createErrorMessage('team'));
    return createSuccessResponse(newTeam, createSuccessMessage('Team'), HttpStatus.CREATED);
});