
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiConstants } from "@/constants/api.constants";
import { Team } from "@/generated/prisma";
import api from "@/lib/axios";
import { ActionResponse } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function CreateTeamPage() {
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
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Team Details</CardTitle>
                    <CardDescription>
                        Enter the basic information for your new team. You can always change these settings later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...teamForm}>
                        <form onSubmit={teamForm.handleSubmit(onTeamFormSubmit)} className="space-y-6">
                            <FormField
                                control={teamForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            Team Name <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your team name (e.g., Marketing Team, Dev Squad)"
                                                className="h-11"
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
                                        <FormDescription>
                                            Team name must be at least 4 characters long and can contain letters, numbers, spaces, hyphens, and underscores.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size={'lg'}
                                    className="flex-1 h-12"
                                    onClick={() => router.push('/teams')}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size={'lg'}
                                    className="flex-1 h-12 sm:ml-auto"
                                    loading={isSubmitting}
                                    disabled={!teamForm.formState.isValid || isSubmitting}
                                >
                                    {isSubmitting ? "Creating Team..." : "Create Team"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Helper info */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <h3 className="text-sm font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your team will be created and you'll be added as the owner</li>
                    <li>• You can invite members to join your team</li>
                    <li>• Team members can collaborate on forms and projects</li>
                    <li>• You can manage team settings and permissions</li>
                </ul>
            </div>
        </div>
    );
}
