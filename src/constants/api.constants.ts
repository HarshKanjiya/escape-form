export const apiConstants = {
    team: {
        getTeams: () => 'team',
        getUserTeams: () => `team/byUserId`,
        createTeam: () => 'team',
        updateTeam: (id: string) => `team/${id}`,
        deleteTeam: (id: string) => `team/${id}`
    },
    project: {
        getProjects: (id: string) => `project?teamId=${id}`,
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