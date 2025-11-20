import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { getAuthErrorResponse } from './api-response';

/**
 * Extract and validate user authentication
 */
export async function validateAuth() {
  const { userId } = await auth();

  if (!userId) {
    return { user: null, error: getAuthErrorResponse() };
  }

  return { user: { id: userId }, error: null };
}

/**
 * Parse request body with error handling
 */
export async function parseRequestBody<T = unknown>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Extract pagination parameters from URL search params
 */
export function getPaginationParams(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const orderBy = url.searchParams.get('orderBy') || 'createdAt';
  const orderDirection = url.searchParams.get('orderDirection') === 'asc' ? 'asc' : 'desc';

  // Ensure reasonable limits
  const validatedLimit = Math.min(Math.max(limit, 1), 100);
  const validatedPage = Math.max(page, 1);
  const validatedOffset = (validatedPage - 1) * validatedLimit;

  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: validatedOffset,
    orderBy,
    orderDirection,
  };
}

/**
 * Extract search parameters from URL
 */
export function getSearchParams(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

  return {
    search: search.trim(),
    sortBy,
    sortOrder,
  };
}

/**
 * Generate request ID for tracking
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log API request for debugging
 */
export function logApiRequest(
  method: string,
  path: string,
  userId?: string,
  requestId?: string
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${requestId}] ${method} ${path} - User: ${userId || 'Anonymous'}`);
  }
}