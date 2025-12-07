"use client";

import { Team } from "@prisma/client";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Check, ChevronsUpDown, CopySlash, Plus, Search, X } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import AddTeam from "./addTeam";


export default function TeamsDropdown() {

    const { teams, activeTeam, isLoading, setActiveTeam } = useGlobalStore((state) => state);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTeams, setFilteredTeams] = useState<Team[]>(teams);

    const pathname = usePathname();

    useEffect(() => {
        if (teams.length === 0) return;

        const teamMatch = pathname.match(/^\/teams\/([^\/]+)/);
        const currentTeamId = teamMatch ? teamMatch[1] : null;

        if (currentTeamId) {
            const currentTeam = teams.find((team) => team.id === currentTeamId);
            if (currentTeam && (!activeTeam || activeTeam.id !== currentTeam.id)) {
                setActiveTeam(currentTeam);
            }
        } else if (!activeTeam && teams.length > 0) {
            setActiveTeam(teams[0]);
        }
    }, [teams, pathname, activeTeam, setActiveTeam]);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredTeams(teams);
        } else {
            setFilteredTeams(
                teams.filter((team) =>
                    team?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, teams]);

    const switchTeam = (team: Team) => {
        setActiveTeam(team);
        redirect(`/${team.id}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg">
                <div className="text-start flex items-center gap-2 leading-none w-[113px]">
                    <span className="text-sm leading-none truncate w-full">
                        {activeTeam?.name}
                    </span>
                </div>
                {
                    isLoading ?
                        <Spinner className="ml-6 h-4 w-4 text-muted-foreground" /> :
                        <ChevronsUpDown className="ml-6 h-4 w-4 text-muted-foreground" />
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="start">
                <div className="relative -m-1 bg-accent">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                        type="text"
                        autoFocus
                        placeholder="Search teams..."
                        className="pl-10 pr-10 shadow-none !border-none !outline-none focus-within:!ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")} className="absolute right-1 rounded-full top-1/2 -translate-y-1/2 h-7 w-7" >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <DropdownMenuSeparator className="dark:bg-zinc-700" />
                {filteredTeams.map((team) => (
                    <DropdownMenuItem
                        key={team.id}
                        onClick={() => switchTeam(team)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span>{team.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {/* {formatDate(team.createdAt)} */}
                                </span>
                            </div>
                        </div>
                        {activeTeam?.id === team.id && (
                            <Check className="ml-auto" />
                        )}
                    </DropdownMenuItem>
                ))}
                {
                    filteredTeams.length === 0 && !isLoading && (
                        <DropdownMenuLabel className="text-center flex flex-col gap-3 items-center justify-center py-6">
                            <CopySlash className="h-6 w-6 text-muted-foreground" />
                            {
                                searchTerm ?
                                    <div className="flex flex-col gap-1">
                                        <span className="text-muted-foreground">No teams found with</span>
                                        <span className="font-medium text-lg text-accent-foreground break-all"> &quot;{searchTerm}&quot;</span>
                                    </div>
                                    :
                                    "You are not part of any teams yet"
                            }
                        </DropdownMenuLabel>
                    )
                }
                <DropdownMenuSeparator className="dark:bg-zinc-700" />
                <div className="-m-1 bg-muted">
                    <AddTeam>
                        <Button variant="ghost" className="w-full justify-start">
                            <Plus className="mr-2" />
                            <span>Create New Team</span>
                        </Button>
                    </AddTeam>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
