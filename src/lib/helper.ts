import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { toast } from 'sonner';
import { createAuthErrorResponse } from './api-response';

/**
 * Extract and validate user authentication
 */
export async function validateAuth() {
  const { userId } = await auth();

  if (!userId) {
    return { user: null, error: createAuthErrorResponse() };
  }

  return { user: { id: userId }, error: null };
}

/**
 * Parse request body with error handling
 */
export async function parseRequestBody<T = any>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
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

  // Ensure reasonable limits
  const validatedLimit = Math.min(Math.max(limit, 1), 100);
  const validatedPage = Math.max(page, 1);
  const validatedOffset = (validatedPage - 1) * validatedLimit;

  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: validatedOffset,
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

/**
 * Sanitize user input to prevent basic injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Deep merge objects
 */
// export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
//   const result = { ...target };

//   for (const key in source) {
//     if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
//       result[key] = deepMerge(result[key] || {}, source[key]);
//     } else {
//       result[key] = source[key] as T[typeof key];
//     }
//   }

//   return result;
// }