import { createErrorMessage, createSuccessMessage, getSuccessMessage, MESSAGE } from '@/constants/messages';
import { createValidationErrorResponse, getAuthErrorResponse, getErrorResponse, getSuccessResponse, HttpStatus, validateRequiredFields, withErrorHandler } from '@/lib/api-response';
import { getPaginationParams, parseRequestBody, validateAuth } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return getAuthErrorResponse();

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

    const [teams, total] = await Promise.all([
        prisma.team.findMany({
            where,
            orderBy: { [orderBy]: orderDirection },
            take: limit,
            skip: offset,
        }),
        prisma.team.count({
            where,
        })
    ]);

    return getSuccessResponse(teams, getSuccessMessage('Teams'), total);
});

export const POST = withErrorHandler(async (request: NextRequest) => {

    const { user, error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const body = await parseRequestBody<{ name: string }>(request);
    const validationErrors = validateRequiredFields(body, ['name']);
    if (validationErrors) return createValidationErrorResponse(validationErrors, MESSAGE.MISSING_FIELDS_MESSAGE);

    const newTeam = await prisma.team.create({
        data: {
            name: body.name.trim(),
            ownerId: user!.id,
        },
    });
    if (!newTeam) return getErrorResponse(createErrorMessage('team'));
    return getSuccessResponse(newTeam, createSuccessMessage('Team'), HttpStatus.CREATED);
});