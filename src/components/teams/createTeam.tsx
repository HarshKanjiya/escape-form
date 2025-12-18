
"use client";

import { Button } from "@/components/ui/button";
import { CustomCard, CustomCardContent, CustomCardDescription, CustomCardFooter, CustomCardHeader, CustomCardTitle } from "@/components/ui/custom-card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiConstants } from "@/constants/api.constants";
import api from "@/lib/axios";
import { ActionResponse } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@prisma/client";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    name: z.string()
        .min(4, 'Team name must be at least 4 characters')
        .max(30, 'Team name must be less than 30 characters')
        .regex(/^[a-zA-Z0-9\s-_]+$/, 'Team name can only contain letters, numbers, spaces, hyphens, and underscores'),
});

export default function CreateTeam() {
    const router = useRouter();

    const teamForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });

    const { isSubmitting } = teamForm.formState;

    const onTeamFormSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await api.post<ActionResponse<Team>>(apiConstants.team.createTeam(), data);
            if (!res.data?.success) {
                toast.error(res.data?.message || "Failed to create team");
                return;
            }

            toast.success("Team created successfully!");
            teamForm.reset();
            router.push('/teams');
        } catch (error) {
            console.error('Error creating team:', error);
            toast.error("An error occurred while creating the team");
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* Header with back button */}
            <div className="mb-8">
                <Link
                    href="/teams"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Teams
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create New Team</h1>
                        <p className="text-muted-foreground">
                            Set up a new team to collaborate with others on your forms and projects.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main form card */}
            <Form {...teamForm}>
                <form onSubmit={teamForm.handleSubmit(onTeamFormSubmit)}>
                    <CustomCard className="w-full outline-none">
                        <CustomCardHeader>
                            {/* <CustomCardTitle className="text-lg text-white">Team Details</CustomCardTitle> */}
                            <CustomCardDescription>
                                Enter the name for your new team. You can always change these settings later.
                            </CustomCardDescription>
                        </CustomCardHeader>
                        <CustomCardContent wrapperClass="px-2">
                            <FormField
                                control={teamForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-base font-medium">
                                            Team Name <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your team name (e.g., Marketing Team, Dev Squad)"
                                                className="h-11 bg-muted! dark:bg-input!"
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CustomCardContent>
                        <CustomCardFooter className="px-1 pb-1 pt-0">
                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-1 w-full p-1 pt-0">
                                <Button
                                    type="submit"
                                    size={'lg'}
                                    className="flex-1 h-12 sm:ml-auto rounded-b-[10px] rounded-t-lg"
                                    loading={isSubmitting}
                                >
                                    {isSubmitting ? "Creating Team..." : "Create Team"}
                                </Button>
                            </div>

                        </CustomCardFooter>
                    </CustomCard>
                </form>
            </Form>
            {/* Helper info
            <div className="mt-6 rounded-lg bg-muted/50 p-4" >
                <h3 className="text-sm font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your team will be created and you&apos;ll be added as the owner</li>
                    <li>• You can invite members to join your team</li>
                    <li>• Team members can collaborate on forms and projects</li>
                    <li>• You can manage team settings and permissions</li>
                </ul>
            </div > */}
        </div >
    );
}
