"use client";

import { apiConstants } from "@/constants/api.constants";
import { Team } from "@/generated/prisma";
import api from "@/lib/axios";
import { ActionResponse } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface Props {
    buttonWidth?: 'w-full' | 'w-auto';
    triggerVariant?: 'default' | 'outline';
    onSuccess?: () => void;
}

const formSchema = z.object({
    name: z.string().min(3, 'Team name must be at least 3 characters').max(30, 'Team name must be less than 30 characters'),
});

export default function AddTeam({ buttonWidth, triggerVariant, onSuccess }: Props = { buttonWidth: 'w-full', triggerVariant: 'outline' }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const teamForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const { isSubmitting } = teamForm.formState;

    const onTeamFormSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await api.post<ActionResponse<Team>>(apiConstants.team.createTeam(), data);
            if (!res.data?.success) {
                toast.error(res.data?.message || "Failed to create team");
                return;
            }
            teamForm.reset();
            setDialogOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error creating team:', error);
        }
    }

    // Handle dialog close - reset form to pristine state
    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            teamForm.reset();
            teamForm.clearErrors();
        }
    }

    return (
        <div className={buttonWidth}>
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                    <Button className={`${triggerVariant === 'outline' ? 'border' : ''}`} variant={triggerVariant}>
                        <Plus className="mr-2" />
                        Create New Team
                    </Button>
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
                                            <Input
                                                placeholder="Enter team name"
                                                {...field}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        teamForm.handleSubmit(onTeamFormSubmit)();
                                                    }
                                                }}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>Team name can be changed afterwards.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" loading={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Team"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
