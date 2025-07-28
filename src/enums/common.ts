export const ACTION_ERRORS = {
    UNAUTHORIZED: 'User not authenticated',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Invalid input data',
    DATABASE_ERROR: 'Database operation failed',
    UNEXPECTED_ERROR: 'An unexpected error occurred',
    NETWORK_ERROR: 'Network connection failed'
} as const

// Common success messages
export const ACTION_MESSAGES = {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Data retrieved successfully'
} as const

export const TABLES = {
    TEAMS: 'teams',
    PROJECTS: 'projects',
    FORMS: 'forms'
} as const;