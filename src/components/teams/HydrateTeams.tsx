'use client';

import { Team } from '@/generated/prisma';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
    teams: Team[];
}

export default function HydrateTeams({ teams }: Props) {
    const setTeams = useStore((state) => state.setTeams);
    const router = useRouter();

    useEffect(() => {
        if (!teams.length) {
            router.push('/teams/create');
            return;
        }
        setTeams(teams);
    }, [teams, setTeams, router]);

    return null; // No visible UI, just sync state
}
