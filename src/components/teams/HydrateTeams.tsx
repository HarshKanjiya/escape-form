'use client';

import { REGEX } from '@/constants/common';
import { Team } from '@/generated/prisma';
import { isValidUUID } from '@/lib/utils';
import { useGlobalStore } from '@/store/useStore';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
    children: React.ReactNode;
    teams?: Team[];
}

export default function HydrateTeams({ children, teams }: Props) {
    const { isLoading, setTeams, setLoading, setActiveTeam } = useGlobalStore((state) => state);
    // const { userId, isLoaded } = useAuth();
    const router = useRouter();
    const path = usePathname();
    const params = useParams();
    const teamId = params.teamId as string;

    useEffect(() => {
        if (!teams?.length) {
            setTeams([]);
            router.push('/teams/create');
            return;
        }
        const pathSegments = path.split('/').filter(Boolean);
        if (!pathSegments.length) {
            router.push(teams[0].id);
            setActiveTeam(teams[0]);
        }
        else if (isValidUUID(teamId)) {
            const team = teams.find(team => team.id === teamId)!;
            if (!team) {
                router.push(teams[0].id);
                setActiveTeam(teams[0]);
            } else setActiveTeam(team);
        }
        // else if (pathSegments.length === 1) {
        //     if (REGEX.uuid.test(pathSegments[1])) {
        //         const teamExists = teams.some(team => team.id === pathSegments[1]);
        //         if (!teamExists) {
        //             router.push(teams[0].id);
        //             setActiveTeam(teams[0]);
        //         } else setActiveTeam(teams.find(team => team.id === pathSegments[1])!);
        //     } else if (pathSegments[0].split('-').length > 3) {
        //         router.push(teams[0].id);
        //         setActiveTeam(teams[0]);
        //     }
        // }
        setTeams(teams ?? []);


        // async function fetchTeams() {
        //     if (!isLoaded || !userId) {
        //         setLoading(false);
        //         return;
        //     }

        //     try {
        //         const res = await api.get<ActionResponse<Team[]>>(apiConstants.team.getTeams());
        //         if (!res?.data?.success || !res.data.data?.length) {
        //             setTeams([]);
        //             router.push('/teams/create');
        //             return;
        //         }
        //         const pathSegments = path.split('/').filter(Boolean);
        //         if (!pathSegments.length) {
        //             router.push(`/teams/${res.data.data[0].id}`);
        //             setActiveTeam(res.data.data[0]);
        //         } else if (pathSegments[0] === 'teams' && pathSegments.length === 2) {
        //             if (REGEX.uuid.test(pathSegments[1])) {
        //                 const teamExists = res.data.data.some(team => team.id === pathSegments[1]);
        //                 if (!teamExists) {
        //                     router.push(`/teams/${res.data.data[0].id}`);
        //                     setActiveTeam(res.data.data[0]);
        //                 }
        //             } else if (pathSegments[1].split('-').length > 3) {
        //                 router.push(`/teams/${res.data.data[0].id}`);
        //                 setActiveTeam(res.data.data[0]);
        //             }
        //         }

        //        
        //         setTeams(res.data.data ?? []);
        //     } catch (error) {
        //         showError(getErrorMessage('teams'), MESSAGE.PLEASE_TRY_AGAIN_LATER);
        //     } finally {
        //         setLoading(false);
        //     }
        // }

        // fetchTeams();
        // }, [userId, isLoaded]);
    }, []);

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
