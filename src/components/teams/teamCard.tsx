"use client";

import { Button } from "@/components/ui/button";
import { CustomCard, CustomCardContent, CustomCardFooter } from "@/components/ui/custom-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Team } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Folders, FoldersIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface TeamCardProps {
    team: Team;
}

export function TeamCard({ team }: TeamCardProps) {

    return (
        <Link href={`/${team.id}`} className="block">
            <CustomCard hoverEffect className="group">
                <CustomCardContent className="h-34">
                    <div className="flex items-start space-x-4 w-full">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-foreground line-clamp-1 mb-1">
                                {team.name}
                            </h3>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted dark:hover:bg-background!"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/${team.id}/settings`}>
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    Delete Project
                                </DropdownMenuItem>
                            </DropdownMenuContent >
                        </DropdownMenu >
                    </div>
                </CustomCardContent>
                <CustomCardFooter className="px-6 pb-3">
                    <div className="flex items-center gap-2">
                        <FoldersIcon className="w-4 h-4 inline-block" />
                        {/* @ts-expect-error _count not added in generated type */}
                        <span>{team?._count?.projects || 0} Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {team?.createdAt && <span>Created at <span className="tracking-widest ml-1">{formatDate(team?.createdAt)}</span></span>}
                    </div>
                </CustomCardFooter>
            </CustomCard>
        </Link>
    );
}
