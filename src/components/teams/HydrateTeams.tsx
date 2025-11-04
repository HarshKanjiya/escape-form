'use client';

import { apiConstants } from '@/constants/api.constants';
import { getErrorMessage, MESSAGE } from '@/constants/messages';
import { Team } from '@/generated/prisma';
import api from '@/lib/axios';
import { showError } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { ActionResponse } from '@/types/common';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
    children: React.ReactNode;
}

export default function HydrateTeams({ children }: Props) {
    const { isLoading, setTeams, setLoading } = useStore((state) => state);
    const { userId, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        async function fetchTeams() {
            if (!isLoaded || !userId) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get<ActionResponse<Team[]>>(apiConstants.team.getTeams());
                if (!res?.data?.success || !res.data.data?.length) {
                    setTeams([]);
                    router.push('/teams/create');
                    return;
                }
                setTeams(res.data.data ?? []);
            } catch (error) {
                showError(getErrorMessage('teams'), MESSAGE.PLEASE_TRY_AGAIN_LATER);
            } finally {
                setLoading(false);
            }
        }

        fetchTeams();
    }, [userId, isLoaded]);

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
