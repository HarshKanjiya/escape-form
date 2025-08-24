"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Team } from "@/types/db";
import { Building2, Calendar, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface TeamCardProps {
    team: Team;
}

export function TeamCard({ team }: TeamCardProps) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Link href={`/${team.id}`} className="block">
            <Card className="group relative transition-all duration-200 cursor-pointer bg-secondary/50 backdrop-blur-2xl overflow-hidden rounded-xl hover:bg-secondary/70 hover:border-primary border-2 shadow-none">
                <CardContent className="px-4 sm:p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 border">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <div className="absolute -left-11 -bottom-5 -z-10 opacity-70">
                            <Building2 className="w-28 h-28 sm:w-36 sm:h-36 text-primary/10" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                                {team.name}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>Created {formatDate(team.created_at)}</span>
                            </div>
                        </div>

                        {/* Action Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </CardContent >
            </Card >
        </Link >
    );
}
