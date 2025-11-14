import { objToQueryString } from "@/lib/utils";

export const apiConstants = {
    team: {
        getTeams: (data: Record<string, any> = {}) => getUrlWithParams(`teams`, data),
        getAllTeams: () => `teams/all`,
        getUserTeams: () => `teams/byUserId`,
        createTeam: () => 'teams',
        updateTeam: (id: string) => `teams/${id}`,
        deleteTeam: (id: string) => `teams/${id}`
    },
    project: {
        getProjects: (data: Record<string, any>) => getUrlWithParams(`projects`, data),
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
    }

};

const getUrlWithParams = (baseUrl: string, params: Record<string, any>): string => {
    const paramStr = objToQueryString(params);
    return `${baseUrl}?${paramStr}`;
}