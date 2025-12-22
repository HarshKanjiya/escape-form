"use client";

import { CustomDialog, CustomDialogBody, CustomDialogClose, CustomDialogContent, CustomDialogDescription, CustomDialogFooter, CustomDialogHeader, CustomDialogTitle, CustomDialogTrigger } from "@/components/ui/custom-dialog";
import { apiConstants } from "@/constants/api.constants";
import { createErrorMessage } from "@/constants/messages";
import api from "@/lib/axios";
import { ActionResponse } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
            <CustomDialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <CustomDialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                    </Button>
                </CustomDialogTrigger>
                <CustomDialogContent className="sm:max-w-[425px]">
                    <Form {...projectForm}>
                        <form onSubmit={projectForm.handleSubmit(onProjectFormSubmit)}>
                            <CustomDialogHeader>
                                <CustomDialogTitle>New Project</CustomDialogTitle>
                                <CustomDialogDescription>Fill out the form below to create a new project.</CustomDialogDescription>
                            </CustomDialogHeader>
                            <CustomDialogBody>
                                <FormField
                                    control={projectForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="required">Project Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter project name"
                                                    className="bg-muted! dark:bg-input!"
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={projectForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Project Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter project description"
                                                    className="resize-none bg-muted! dark:bg-input!"
                                                    rows={5}
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CustomDialogBody>
                            <CustomDialogFooter className="px-5 pb-4 pt-3">
                                <CustomDialogClose asChild>
                                    <Button type="button" variant="ghost" disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </CustomDialogClose>
                                <Button type="submit" loading={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Project"}
                                </Button>
                            </CustomDialogFooter>
                        </form>
                    </Form>
                </CustomDialogContent>
            </CustomDialog>
        </div>
    );
}
