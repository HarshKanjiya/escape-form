"use client";

import { CreditIcon } from "@/components/shared/creditIcon";
import { FeedbackModel } from "@/components/shared/feedBack";
import TeamsDropdown from "@/components/teams/teamsDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGlobalStore } from "@/store/useStore";
import { Bell, CircleFadingArrowUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "./profileDropdown";
import NotificationDropdown from "./notificationDropdown";

export default function Header({ }) {

    const { teams, activeProject, activeTeam } = useGlobalStore((state) => state);

    return (
        <div className="fixed w-full flex items-center justify-between h-16 px-4 border-b bg-background z-10">
            <div className="flex items-center gap-6">
                <Link href={teams.length ? `/${teams[0].id}` : "/teams"} className="flex items-center gap-2">
                    <Image
                        src="/logo-light.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className=""
                    />
                </Link>

                <TeamsDropdown />
                {activeProject ? (
                    <span className="flex items-center gap-1">
                        <span className="mr-2">/</span>
                        <span className="text-sm font-medium text-ellipsis max-w-32 overflow-hidden line-clamp-1">{activeProject.name}</span>
                    </span>
                ) : null}
            </div>
            <div className="flex items-center gap-3">
                <FeedbackModel />
                <Separator orientation="vertical" className="!h-8" />
                {
                    true ? (
                        <Link href={`/${activeTeam?.id}/upgrade`} >
                            <Button variant='ghost' className="flex items-center justify-center gap-2 rounded-full !pl-2 pr-3 text-primary border-primary/30 border hover:bg-primary-100 hover:text-primary-500">
                                <CircleFadingArrowUpIcon className="!h-5 !w-5" />
                                Upgrade
                            </Button>
                        </Link>
                    ) : null
                }
                {
                    activeTeam ? (
                        <Link href={`/${activeTeam?.id}/wallet`} >
                            <Button variant='outline' className="flex items-center justify-center gap-2 rounded-full pl-2 pr-3">
                                <CreditIcon className="!h-5 !w-5 text-muted-foreground" />
                                133.54
                            </Button>
                        </Link>
                    ) : null}

                <NotificationDropdown />
                <ProfileDropdown />
            </div>
        </div>

    )
}