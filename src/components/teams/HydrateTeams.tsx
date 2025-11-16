'use client';

import { apiConstants } from '@/constants/api.constants';
import { ROUTES } from '@/constants/routes.constants';
import { Form, Project, Team } from '@/generated/prisma';
import api from '@/lib/axios';
import { isValidUUID } from '@/lib/utils';
import { useGlobalStore } from '@/store/useGlobalStore';
import { ActionResponse } from '@/types/common';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
    children: React.ReactNode;
    teams?: Team[];
}

export default function HydrateTeams({ children, teams }: Props) {
    const { isLoading, activeTeam, activeProject, setTeams, setActiveTeam, setActiveProject, setActiveForm } = useGlobalStore((state) => state);
    const params = useParams();
    const router = useRouter();
    const [teamId, setTeamId] = useState<string | null>(params.teamId as string || null);
    const [projectId, setProjectId] = useState<string | null>(params.projectId as string || null);
    const [formId, setFormId] = useState<string | null>(params.formId as string || null);

    useEffect(() => {
        if (!teams?.length) {
            setTeams([]);
            router.replace(ROUTES.team.create());
        }
        setTeams(teams ?? []);
    }, []);

    useEffect(() => {
        if (params.teamId as string && isValidUUID(params.teamId as string)) {
            setTeamId(params.teamId as string);
        } else setTeamId(null);

        if (params.projectId as string && isValidUUID(params.projectId as string)) {
            setProjectId(params.projectId as string);
        } else setProjectId(null);

        if (params.formId as string && isValidUUID(params.formId as string)) {
            setFormId(params.formId as string);
        } else setFormId(null);
    }, [params]);

    useEffect(() => {
        if (!teamId) {
            setActiveTeam(null);
            return;
        }
        if (activeTeam) return;
        const team = teams?.find(team => team.id === teamId);
        if (team) {
            setActiveTeam(team);
        } else if (teams?.length) {
            router.replace(teams[0].id);
        } else {
            router.replace(ROUTES.team.create());
        }
    }, [teamId]);

    useEffect(() => {
        if (!projectId) {
            setActiveProject(null);
            return;
        }
        if (activeProject) return;

        const getProject = async () => {
            try {
                const response = await api.get<ActionResponse<Project>>(apiConstants.project.getProjectById(projectId));

                if (!response.data.success) {
                    return;
                }
                const project = response.data.data;
                if (project) {
                    setActiveProject(project);
                }
            } catch (error) {
                console.error('Error fetching form:', error);
            }
        }
        getProject();
    }, [projectId]);

    useEffect(() => {
        if (!formId) {
            setActiveForm(null);
            return;
        }

        const getForm = async () => {
            try {
                const response = await api.get<ActionResponse<Form>>(apiConstants.form.getFormById(formId));

                if (!response.data.success) {
                    return;
                }
                const form = response.data.data;
                if (form) {
                    setActiveForm(form);
                }
            } catch (error) {
                console.error('Error fetching form:', error);
            }
        }
        getForm();

    }, [formId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
                    <p className="text-muted-foreground">Redirecting to your dashboard</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}
