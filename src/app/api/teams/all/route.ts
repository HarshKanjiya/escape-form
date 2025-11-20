import { getSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { validateAuth } from '@/lib/helper';
import { prisma } from '@/lib/prisma';

export const GET = withErrorHandler(async () => {

    const { user, error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const teams = await prisma.team.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { projects: true },
            },
        },
    })

    return getSuccessResponse(teams, getSuccessMessage('Teams'));
});