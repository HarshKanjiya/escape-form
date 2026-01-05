import { getErrorMessage, getSuccessMessage } from '@/constants/messages';
import { getAuthErrorResponse, getErrorResponse, getSuccessResponse, withErrorHandler } from '@/lib/api-response';
import { parseRequestBody, validateAuth } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';

type RouteParams = {
    params: Promise<{
        formId: string;
    }>
};

// Validation schema for creating active password
const createPasswordSchema = z.object({
    name: z.string().min(1, "Name is required"),
    password: z.string().min(1, "Password is required"),
    expireAt: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    usableUpto: z.number().int().min(1),
    isValid: z.boolean().optional().default(true),
});


export const GET = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error, user } = await validateAuth()
    if (error) return getAuthErrorResponse();
    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));

    try {
        // Check if form exists
        const existingForm = await prisma.form.findUnique({
            where: { id: formId },
            select: { id: true }
        });

        if (!existingForm) {
            return getErrorResponse(getErrorMessage('Form not found'), { status: 404 });
        }

        const passwords = await prisma.activePassword.findMany({
            where: { formId },
            select: {
                id: true,
                name: true,
                password: true,
                isValid: true,
                expireAt: true,
                usableUpto: true,
                createdAt: true
            }
        });

        return getSuccessResponse(passwords, getSuccessMessage('Passwords retrieved successfully'));
    } catch (error) {
        console.error('Error retrieving passwords:', error);
        return getErrorResponse('Failed to retrieve passwords', { status: 500 });
    }
});

export const POST = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
    const { error, user } = await validateAuth()
    if (error) return getAuthErrorResponse();
    const { formId } = await params;
    if (!formId) return getErrorResponse(getErrorMessage('Form ID'));

    const body = await parseRequestBody(request);

    const validationResult = createPasswordSchema.safeParse(body);
    if (!validationResult.success) {
        const errors: Record<string, string[]> = {};
        for (const issue of validationResult.error.issues) {
            const key = issue.path.join('.') || 'password';
            if (!errors[key]) errors[key] = [];
            errors[key].push(issue.message);
        }
        return getErrorResponse('Invalid password data', { errors });
    }

    const passwordData = validationResult.data;

    try {
        // Check if form exists
        const existingForm = await prisma.form.findUnique({
            where: { id: formId },
            select: { id: true }
        });

        if (!existingForm) {
            return getErrorResponse(getErrorMessage('Form not found'), { status: 404 });
        }

        const newPassword = await prisma.activePassword.create({
            data: {
                formId,
                name: passwordData.name,
                password: passwordData.password,
                expireAt: passwordData.expireAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year
                usableUpto: passwordData.usableUpto,
                isValid: passwordData.isValid ?? true,
            },
            select: {
                id: true,
                name: true,
                password: true,
                isValid: true,
                expireAt: true,
                usableUpto: true,
                createdAt: true
            }
        });

        return getSuccessResponse(newPassword, getSuccessMessage('Password created successfully'));
    } catch (error) {
        console.error('Error creating password:', error);
        return getErrorResponse('Failed to create password', { status: 500 });
    }
});
