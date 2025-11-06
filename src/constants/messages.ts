export const MESSAGE = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource conflict occurred',
    VALIDATION_ERROR: 'Validation error occurred',
    DATABASE_ERROR: 'Database error occurred',
    UNKNOWN_ERROR: 'An unknown error occurred',
    AUTHENTICATION_REQUIRED: 'Authentication required',
    MISSING_FIELDS_MESSAGE: 'Please provide all required fields',
    INVALID_DATA_MESSAGE: 'Provided data is invalid',
    TEAM_NOT_FOUND_OR_ACCESS_DENIED: 'Team not found or you do not have access to it',
    FORM_NOT_FOUND_OR_ACCESS_DENIED: 'Form not found or you do not have access to it',
    PLEASE_TRY_AGAIN_LATER: 'Please try again later',
}

export const getSuccessMessage = (name: string) => `${name} retrieved successfully`
export const createSuccessMessage = (name: string) => `${name} created successfully`
export const updateSuccessMessage = (name: string) => `${name} updated successfully`
export const deleteSuccessMessage = (name: string) => `${name} deleted successfully`

export const getErrorMessage = (name: string) => `Failed to retrieve ${name}`
export const createErrorMessage = (name: string) => `Failed to create ${name}`
export const updateErrorMessage = (name: string) => `Failed to update ${name}`
export const deleteErrorMessage = (name: string) => `Failed to delete ${name}`