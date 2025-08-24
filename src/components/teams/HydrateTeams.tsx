'use client';

import { useStore } from '@/store/useStore';
import { Team } from '@/types/db';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
    teams: Team[];
}

export default function HydrateTeams({ teams }: Props) {
    const setTeams = useStore((state) => state.setTeams);

    useEffect(() => {
        setTeams(teams);
        // if (teams?.length) {
        //     redirect(teams[0].id)
        // } else {
        //     redirect("/teams");
        // }
    }, [teams, setTeams]);

    return null; // No visible UI, just sync state
}
