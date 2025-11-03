export const apiConstants = {
    team: {
        getTeams: () => 'team',
        getTeamById: (id: string) => `team/${id}`,
        createTeam: () => 'team',
        updateTeam: (id: string) => `team/${id}`,
        deleteTeam: (id: string) => `team/${id}`
    },
    project: {
        getProjects: (id: string) => `projects?teamId=${id}`,
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