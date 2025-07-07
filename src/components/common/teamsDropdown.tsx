"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { createTeam } from "@/actions/team";

const formSchema = z.object({
    name: z.string().min(3, 'Team name must be at least 3 characters').max(30, 'Team name must be less than 30 characters'),
});

export default function TeamsDropdown() {
    const [open, setOpen] = useState(false);
    const [teams, setTeams] = useState<any[]>([]);

    useEffect(() => {
        getTeams();
    }, []);

    const getTeams = async () => {
        // const { teams } = await getCurrentUserTeams();
        // setTeams(teams);
    }

    const teamForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const onTeamFormSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // const res = await createTeam(data);
            // console.log('res :>> ', res);

            teamForm.reset();
        } catch (error) {
            console.error('Error creating team:', error);
            // You can add toast notification here
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value={'test'}
                                onSelect={(currentValue) => {
                                    setOpen(false)
                                }}
                            >
                                <CheckIcon
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        // value === framework.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                test
                            </CommandItem>
                        </CommandGroup>
                        <CommandItem className="w-full">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full" variant="outline">Create New Team</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>New Team</DialogTitle>
                                    </DialogHeader>
                                    <Form {...teamForm}>
                                        <form onSubmit={teamForm.handleSubmit(onTeamFormSubmit)} className="space-y-4">
                                            <FormField
                                                control={teamForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Team Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter team name" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Team name can be changed afterwards.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </CommandItem>
                        {/* <CommandGroup>
                                </CommandGroup> */}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
