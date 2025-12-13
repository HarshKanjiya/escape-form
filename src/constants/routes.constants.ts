export const ERROR_ROUTES = {
    NOT_FOUND: '/error/404',
    FORBIDDEN: '/error/403',
    UNAUTHORIZED: '/error/401',
}


export const ROUTES = {
    form: {
        list: (teamId: string, projectId: string) => `/${teamId}/${projectId}`,
        edit: (teamId: string, projectId: string, formId: string) => `/${teamId}/${projectId}/forms/${formId}/edit`,
        create: (teamId: string, projectId: string) => `/${teamId}/${projectId}/forms/new`,
        analytics: (teamId: string, projectId: string, formId: string) => `/${teamId}/${projectId}/forms/${formId}/analytics`,
    },
    project: {
        list: (teamId: string, projectId: string) => `/${teamId}/${projectId}`,
        settings: (teamId: string, projectId: string) => `/${teamId}/${projectId}`
    },
    team: {
        create: () => `/teams/create`,
    },
    home: () => `/`,
}