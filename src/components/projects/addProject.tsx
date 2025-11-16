"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import api from "@/lib/axios";
import { ActionResponse } from "@/types/common";
import { Project } from "@/generated/prisma";
import { apiConstants } from "@/constants/api.constants";
import { createErrorMessage } from "@/constants/messages";

const formSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters').max(30, 'Project name must be less than 30 characters'),
    description: z.string().max(200, 'Project description must be less than 200 characters').optional(),
});

interface Props {
    onSuccess?: () => void;
}

export default function AddProject({ onSuccess }: Props = {}) {
    const { teamId }: { teamId: string } = useParams();
    const [dialogOpen, setDialogOpen] = useState(false);

    const projectForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const { isSubmitting } = projectForm.formState;

    const onProjectFormSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!teamId) {
            toast.error("Team ID is required");
            return;
        }
        try {
            const dto = { ...data, teamId };
            const res = await api.post<ActionResponse<Project>>(apiConstants.project.createProject(), dto);
            if (!res.data.success) {
                toast.error(res.data.message || createErrorMessage("Project"));
                return;
            }
            projectForm.reset();
            setDialogOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }


    // Handle dialog close - reset form to pristine state
    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            projectForm.reset();
            projectForm.clearErrors();
        }
    }

    return (
        <div>
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>New Project</DialogTitle>
                    </DialogHeader>
                    <Form {...projectForm}>
                        <form onSubmit={projectForm.handleSubmit(onProjectFormSubmit)} className="space-y-4">
                            <FormField
                                control={projectForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="required">Project Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter project name"
                                                {...field}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        projectForm.handleSubmit(onProjectFormSubmit)();
                                                    }
                                                }}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>Project name can be changed afterwards.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={projectForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter project description"
                                                className="resize-none"
                                                rows={5}
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
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
                                    {isSubmitting ? "Creating..." : "Create Project"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
