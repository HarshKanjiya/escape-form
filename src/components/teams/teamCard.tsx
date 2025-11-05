"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Team } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { Building2, Calendar, Folders, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface TeamCardProps {
    team: Team;
}

export function TeamCard({ team }: TeamCardProps) {

    return (
        <Link href={`/${team.id}`} className="block">
            <Card className="p-6 group relative transition-all duration-200 cursor-pointer bg-white dark:bg-accent overflow-hidden rounded-xl hover:bg-secondary/70 hover:border-primary border shadow-[0px_4px_33px_-10px_rgba(0,_0,_0,_0.05)] dark:shadow-none">
                <CardContent className="p-0 flex flex-col items-center justify-between h-28">
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
                                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:!bg-accent-bg"
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
                    <div className="text-sm text-muted-foreground flex items-center justify-between w-full border-t pt-4">
                        <div className="flex items-center gap-2">
                            <Folders className="w-4 h-4 inline-block" />
                            {/* @ts-ignore */}
                            <span>{team?._count?.projects || 0} Projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {team?.createdAt && <span>Created at <span className="tracking-widest ml-1">{formatDate(team?.createdAt)}</span></span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
