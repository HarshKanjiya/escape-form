"use client";

import { Team } from "@/generated/prisma";
import { useStore } from "@/store/useStore";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import AddTeam from "./addTeam";


export default function TeamsDropdown() {

    const { teams, activeTeam, isLoading, setActiveTeam } = useStore((state) => state);
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

    const switchTeam = (team: Team) => {
        setActiveTeam(team);
        redirect(`/${team.id}`);
    };

    return (
        <>
            {/* {activeTeam?.name}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="!px-1"
                        disabled={isLoading}
                    >
                        <ChevronsUpDownIcon className="w-2 px-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search teams..." />
                        <CommandList>
                            <CommandEmpty>No teams found.</CommandEmpty>
                            {teams.length > 0 && (
                                <CommandGroup>
                                    {teams.map((team) => (
                                        <CommandItem
                                            key={team.id}
                                            value={team.id}
                                            onSelect={() => {
                                                switchTeam(team)
                                                setOpen(false)
                                            }}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    activeTeam?.id === team.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {team.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                            <CommandItem className="w-full">
                                <AddTeam buttonWidth="w-full" triggerVariant="outline" />
                            </CommandItem>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover> */}

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 bg-accent py-2.5 px-3 rounded-lg">
                    <div className="text-start flex items-center gap-2 leading-none w-[120px]">
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
                    <DropdownMenuLabel>Teams</DropdownMenuLabel>
                    {teams.map((team) => (
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
                    <DropdownMenuSeparator className="dark:bg-zinc-600" />
                    <AddTeam>
                        <Button variant="ghost" className="w-full justify-start">
                            <Plus className="mr-2" />
                            <span>Create New Team</span>
                        </Button>
                    </AddTeam>
                    {/* <DropdownMenuItem className="p-1 w-full">
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    )
}
