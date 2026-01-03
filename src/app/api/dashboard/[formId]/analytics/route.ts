import { getErrorMessage, getSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

type RouteParams = {
    params: Promise<{
        formId: string;
    }>
};

export const GET = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {

    const { error } = await validateAuth()
    if (error) return getAuthErrorResponse();

    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));

    // Get all responses for this form
    const responses = await prisma.response.findMany({
        where: {
            formId: formId,
            valid: true
        },
        select: {
            id: true,
            startedAt: true,
            submittedAt: true,
            status: true
        }
    });

    // Calculate analytics
    const responseCount = responses.length;
    const opened = responses.filter(r => r.startedAt).length;
    const submitted = responses.filter(r => r.submittedAt).length;
    const completionRate = opened > 0 ? Math.round((submitted / opened) * 100) : 0;

    // Calculate average completion time (in seconds)
    const completedResponses = responses.filter(r => r.startedAt && r.submittedAt);
    const completionTimes = completedResponses.map(r => {
        const start = new Date(r.startedAt!).getTime();
        const end = new Date(r.submittedAt!).getTime();
        return (end - start) / 1000;
    });

    const avgCompletionTime = completionTimes.length > 0
        ? Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length)
        : 0;

    const minCompletionTime = completionTimes.length > 0
        ? Math.round(Math.min(...completionTimes))
        : 0;

    const maxCompletionTime = completionTimes.length > 0
        ? Math.round(Math.max(...completionTimes))
        : 0;

    // Calculate today's responses
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayResponseCount = responses.filter(r => {
        const startDate = r.startedAt ? new Date(r.startedAt) : null;
        return startDate && startDate >= today && startDate < tomorrow;
    }).length;

    // Generate last 12 months data
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const submitDataPoints = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthNames[date.getMonth()];
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        const monthResponses = responses.filter(r => {
            const startDate = r.startedAt ? new Date(r.startedAt) : null;
            return startDate && startDate >= date && startDate < nextMonth;
        });

        const completed = monthResponses.filter(r => r.submittedAt).length;
        const unfinished = monthResponses.filter(r => !r.submittedAt).length;

        submitDataPoints.push({
            month: monthName,
            Unfinished: unfinished,
            Completed: completed
        });
    }

    const analytics = {
        responseCount,
        avgCompletionTime,
        minCompletionTime,
        maxCompletionTime,
        opened,
        submitted,
        completionRate,
        todayResponseCount,
        submitDataPoints
    };


    return getSuccessResponse(analytics, getSuccessMessage('Analytics'));
});
