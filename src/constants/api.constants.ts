import { objToQueryString } from "@/lib/utils";

export const apiConstants = {
    team: {
        getTeams: (data: Record<string, string | number> = {}) => getUrlWithParams(`teams`, data),
        getAllTeams: () => `teams/all`,
        getUserTeams: () => `teams/byUserId`,
        createTeam: () => 'teams',
        updateTeam: (id: string) => `teams/${id}`,
        deleteTeam: (id: string) => `teams/${id}`
    },
    project: {
        getProjects: (data: Record<string, string | number>) => getUrlWithParams(`projects`, data),
        getProjectById: (id: string) => `projects/${id}`,
        createProject: () => 'projects',
        updateProject: (id: string) => `projects/${id}`,
        deleteProject: (id: string) => `projects/${id}`
    },
    form: {
        getForms: (projectId: string) => `forms?projectId=${projectId}`,
        getFormById: (id: string) => `forms/${id}`,
        createForm: () => 'forms',
        updateForm: (id: string) => `forms/${id}`,
        deleteForm: (id: string) => `forms/${id}`,
        changeStatus: (id: string) => `forms/${id}/status`,
    },
    quesiton: {
        getQuestions: (formId: string) => `forms/${formId}/questions`,
        createQuestions: (formId: string) => `forms/${formId}/questions`,
        updateQuestions: (formId: string, questionId: string) => `forms/${formId}/questions/${questionId}`,
        deleteQuestions: (formId: string, questionId: string) => `forms/${formId}/questions/${questionId}`,
    },
    option: {
        getOptions: (formId: string, questionId: string) => `forms/${formId}/questions/${questionId}/option`,
        saveOption: (formId: string, questionId: string) => `forms/${formId}/questions/${questionId}/option`,
        deleteOption: (formId: string, questionId: string, optionId: string) => `forms/${formId}/questions/${questionId}/option?optionId=${optionId}`,
    },
    edge: {
        addEdge: (formId: string) => `forms/${formId}/edges`,
        updateEdge: (formId: string, edgeId: string) => `forms/${formId}/edges/${edgeId}`,
        deleteEdge: (formId: string, edgeId: string) => `forms/${formId}/edges/${edgeId}`,
    },
    dashboard: {
        getAnalytics: (formId: string) => `dashboard/${formId}/analytics`,
        getResponses: (formId: string, data: Record<string, string | number> = {}) => getUrlWithParams(`dashboard/${formId}/responses`, data),
        getQuestions: (formId: string) => `dashboard/${formId}/questions`,
        settings: (formId: string) => `dashboard/${formId}/settings`,
        security: (formId: string) => `dashboard/${formId}/security`,

    },

};

const getUrlWithParams = (baseUrl: string, params: Record<string, string | number>): string => {
    const paramStr = objToQueryString(params);
    return `${baseUrl}?${paramStr}`;
}