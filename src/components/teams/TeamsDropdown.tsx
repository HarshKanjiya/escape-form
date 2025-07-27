"use client";

import { createTeam } from "@/actions/team";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Team } from "@/types/db";
import AddTeam from "./addTeam";

const formSchema = z.object({
    name: z.string().min(3, 'Team name must be at least 3 characters').max(30, 'Team name must be less than 30 characters'),
});

export default function TeamsDropdown() {

    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : (activeTeam?.name || "Select Team")}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
    )
}
