import { ActionResponse } from '@/types/common';
import { NextResponse } from 'next/server';

// HTTP status codes enum for consistency
export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}

// Error types for better error handling
export enum ErrorType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
    CONFLICT_ERROR = 'CONFLICT_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
}

const headers = {
    'content-type': 'application/json'
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(
    data: T,
    message: string = 'Success',
    status: HttpStatus = HttpStatus.OK,
): NextResponse<ActionResponse<T>> {
    const response: ActionResponse<T> = {
        success: true,
        message,
        data,
    };

    return NextResponse.json(response, { status, headers });
}

/**
 * Create an error API response
 */
export function createErrorResponse(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: string,
    errors?: Record<string, string[]>,
): NextResponse<ActionResponse> {
    const response: ActionResponse = {
        success: false,
        message,
        isError: true,
    };

    return NextResponse.json(response, { status, headers });
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(
    errors: Record<string, string[]>,
    message: string = 'Validation failed'
): NextResponse<ActionResponse> {
    return createErrorResponse(
        message,
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorType.VALIDATION_ERROR,
        errors
    );
}

/**
 * Create an authentication error response
 */
export function createAuthErrorResponse(
    message: string = 'Authentication required'
): NextResponse<ActionResponse> {
    return createErrorResponse(
        message,
        HttpStatus.UNAUTHORIZED,
        ErrorType.AUTHENTICATION_ERROR
    );
}

/**
 * Create an authorization error response
 */
export function createForbiddenResponse(
    message: string = 'Insufficient permissions'
): NextResponse<ActionResponse> {
    return createErrorResponse(
        message,
        HttpStatus.FORBIDDEN,
        ErrorType.AUTHORIZATION_ERROR
    );
}

/**
 * Create a not found error response
 */
export function createNotFoundResponse(
    message: string = 'Resource not found'
): NextResponse<ActionResponse> {
    return createErrorResponse(
        message,
        HttpStatus.NOT_FOUND,
        ErrorType.NOT_FOUND_ERROR
    );
}

/**
 * Create a conflict error response
 */
export function createConflictResponse(
    message: string = 'Resource already exists'
): NextResponse<ActionResponse> {
    return createErrorResponse(
        message,
        HttpStatus.CONFLICT,
        ErrorType.CONFLICT_ERROR
    );
}

/**
 * Create a database error response
 */
export function createDatabaseErrorResponse(
    message: string = 'Database operation failed'
): NextResponse<ActionResponse> {
    return createErrorResponse(
        message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorType.DATABASE_ERROR
    );
}

/**
 * Handle Prisma errors and convert to standardized responses
 */
export function handlePrismaError(error: any): NextResponse<ActionResponse> {
    console.error('Prisma error:', error);

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
        // Unique constraint violation
        return createConflictResponse('A record with this data already exists');
    }

    if (error.code === 'P2025') {
        // Record not found
        return createNotFoundResponse('The requested record was not found');
    }

    if (error.code === 'P2003') {
        // Foreign key constraint violation
        return createValidationErrorResponse(
            { reference: ['Referenced record does not exist'] },
            'Invalid reference'
        );
    }

    if (error.code === 'P2014') {
        // Required relation violation
        return createValidationErrorResponse(
            { relation: ['Required relation is missing'] },
            'Missing required relation'
        );
    }

    // Generic database error
    return createDatabaseErrorResponse('An unexpected database error occurred');
}

/**
 * Create a paginated response with metadata
 */
export function createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully'
): NextResponse<ActionResponse<{ items: T[]; pagination: any }>> {
    const totalPages = Math.ceil(total / limit);

    const responseData = {
        items: data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };

    return createSuccessResponse(
        responseData,
        message,
        HttpStatus.OK
    );
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
    body: Record<string, any>,
    requiredFields: string[]
): Record<string, string[]> | null {
    const errors: Record<string, string[]> = {};

    requiredFields.forEach((field) => {
        if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
            errors[field] = [`${field} is required`];
        }
    });

    return Object.keys(errors).length > 0 ? errors : null;
}

// Helper functions for Server Actions (return ActionResponse directly, not NextResponse)

/**
 * Create a success response for server actions
 */
export function createActionSuccess<T>(
    data: T,
    message?: string,
    totalItems?: number
): NextResponse<ActionResponse<T>> {
    return NextResponse.json({
        success: true,
        data,
        message,
        totalItems
    });
}

/**
 * Create an error response for server actions
 */
export function createActionError(
    message: string,
    isWarning: boolean = false
): NextResponse<ActionResponse> {
    return NextResponse.json({
        success: false,
        message,
        isError: !isWarning,
        isWarning,
    },
        { headers }
    );
}

/**
 * Create a validation error response for server actions
 */
export function createActionValidationError(
    message: string = 'Validation failed'
): NextResponse<ActionResponse> {
    return NextResponse.json({
        success: false,
        message,
        isError: true,
    });
}

/**
 * Handle errors in server actions
 */
export function handleActionError(error: any): NextResponse<ActionResponse> {
    console.error('Server Action Error:', error);

    if (error.code && error.code.startsWith('P')) {
        // Handle Prisma errors
        if (error.code === 'P2002') {
            return createActionError('A record with this data already exists');
        }
        if (error.code === 'P2025') {
            return createActionError('The requested record was not found');
        }
        return createActionError('Database operation failed');
    }

    if (error.name === 'ValidationError') {
        return createActionValidationError(error.message || 'Validation failed');
    }

    return createActionError('An unexpected error occurred');
}

/**
 * Async error handler wrapper for server actions
 */
// export function withActionErrorHandler<T extends any[], R>(
//     fn: (...args: T) => Promise<ActionResponse<R>>
// ) {
//     return async (...args: T): Promise<ActionResponse<R | undefined>> => {
//         try {
//             return await fn(...args);
//         } catch (error: any) {
//             return handleActionError(error);
//         }
//     };
// }

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends any[], R>(
    fn: (...args: T) => Promise<R>
) {
    return async (...args: T): Promise<R | NextResponse<ActionResponse>> => {
        try {
            return await fn(...args);
        } catch (error: any) {
            console.error('API Error:', error);

            // Handle Prisma errors specifically
            if (error.code && error.code.startsWith('P')) {
                return handlePrismaError(error);
            }

            // Handle validation errors
            if (error.name === 'ValidationError') {
                return createValidationErrorResponse(
                    error.errors || {},
                    error.message || 'Validation failed'
                );
            }

            // Generic internal server error
            return createErrorResponse(
                'An unexpected error occurred',
                HttpStatus.INTERNAL_SERVER_ERROR,
                ErrorType.INTERNAL_ERROR
            );
        }
    };
}