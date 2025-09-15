"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Team } from "@/types/db";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import AddTeam from "./addTeam";


export default function TeamsDropdown() {

    const [open, setOpen] = useState(false);
    const { teams, activeTeam, setActiveTeam } = useStore((state) => state);
    const pathname = usePathname();

    const isLoading = false;

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
            {activeTeam?.name}
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
            </Popover>
        </>
    )
}
