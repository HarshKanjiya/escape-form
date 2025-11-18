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
        deleteForm: (id: string) => `forms/${id}`
    },
    quesiton: {
        getQuestions: (formId: string) => `forms/${formId}/questions`,
        createQuestions: (formId: string) => `forms/${formId}/questions`,
        updateQuestions: (formId: string, questionId: string) => `forms/${formId}/questions/${questionId}`,
        deleteQuestions: (formId: string, questionId: string) => `forms/${formId}/questions/${questionId}`,
    }

};

const getUrlWithParams = (baseUrl: string, params: Record<string, string | number>): string => {
    const paramStr = objToQueryString(params);
    return `${baseUrl}?${paramStr}`;
}