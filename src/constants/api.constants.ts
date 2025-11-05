import { objToQueryString } from "@/lib/utils";

export const apiConstants = {
    team: {
        getTeams: (data: Record<string, any> = {}) => getUrlWithParams(`team`, data),
        getUserTeams: () => `team/byUserId`,
        createTeam: () => 'team',
        updateTeam: (id: string) => `team/${id}`,
        deleteTeam: (id: string) => `team/${id}`
    },
    project: {
        getProjects: (data: Record<string, any>) => getUrlWithParams(`project`, data),
        getProjectById: (id: string) => `project/${id}`,
        createProject: () => 'project',
        updateProject: (id: string) => `project/${id}`,
        deleteProject: (id: string) => `project/${id}`
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