"use client";

import { FeedbackModel } from "@/components/shared/feedBack";
import TeamsDropdown from "@/components/teams/TeamsDropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes.constants";
import { useGlobalStore } from "@/store/useGlobalStore";
import { ChevronRightIcon, CircleFadingArrowUpIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationDropdown from "./notificationDropdown";
import ProfileDropdown from "./profileDropdown";

const paths = [
    'analytics',
    'edit',
    'settings',
]

export default function Header({ }) {
    const { teams, activeProject, activeTeam, activeForm } = useGlobalStore((state) => state);
    const path = usePathname();
    const [spPath, setSpPath] = useState<string | null>(null);

    useEffect(() => {
        if (!path) return;
        const segments = path.split('/').filter(Boolean);
        setSpPath(segments.find(segment => paths.includes(segment)) ?? null);
    }, [path]);

    return (
        <div className="fixed w-full flex items-center justify-between h-16 px-4 border-b bg-background z-10">
            <div className="flex items-center gap-6">
                <Link href={teams.length ? `/${teams[0].id}` : "/teams"} className="flex items-center gap-2">
                    <Image
                        src="/logo-light.svg"
                        alt="Logo"
                        width={36}
                        height={36}
                        className="rounded-4xl corner-squircle overflow-hidden border-2 border-muted"
                    />
                </Link>
                <TeamsDropdown />
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                    {
                        activeProject && activeTeam ? (
                            <>
                                <Link href={ROUTES.project.list(activeTeam.id, activeProject.id)}>
                                    <Button variant='ghost' className="flex items-center gap-1 shadow-none">
                                        <span className="capitalize">{activeProject.name}</span>
                                    </Button>
                                </Link>
                            </>
                        ) : null
                    }
                    {
                        activeForm && activeTeam && activeProject ? (
                            <>
                                <ChevronRightIcon className="h-4! w-4! text-muted-foreground/30" />
                                <Link href={ROUTES.form.analytics(activeTeam.id, activeProject.id, activeForm.id)}>
                                    <Button variant='ghost' className="flex items-center gap-1 shadow-none">
                                        <span className="capitalize">{activeForm.name}</span>
                                    </Button>
                                </Link>
                            </>
                        ) : null
                    }
                    {
                        spPath ? (
                            <>
                                <ChevronRightIcon className="h-4! w-4! text-muted-foreground/30" />
                                <span className="capitalize px-4">{spPath}</span>
                            </>
                        ) : null
                    }

                </div>
            </div>
            <div className="flex items-center gap-3">
                {
                    true ? (
                        <Link href={`/${activeTeam?.id}/upgrade`} >
                            <Button variant='ghost' className="flex shadow-none items-center justify-center gap-2 rounded-full text-primary-600 border-primary/20 border hover:bg-primary-400 hover:text-primary-500">
                                <CircleFadingArrowUpIcon className="h-5! w-5!" />
                                Upgrade
                            </Button>
                        </Link>
                    ) : null
                }
                {/* {
                    activeTeam ? (
                        <Link href={`/${activeTeam?.id}/wallet`} >
                            <Button variant='outline' className="flex shadow-none items-center justify-center gap-2 rounded-full">
                                <CreditIcon className="h-5! w-5! text-muted-foreground" />
                                133.54
                            </Button>
                        </Link>
                    ) : null} */}


                {/* <AssistantTrigger /> */}
                <NotificationDropdown />
                <Button variant='outline' size='icon' className="shadow-none">
                    <SparklesIcon className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-7!" />
                <FeedbackModel />
                <ProfileDropdown />
            </div>
        </div >

    )
}