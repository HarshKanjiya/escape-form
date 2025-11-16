"use client";

import FormOverview from "@/components/forms/analytics/overview";
import FormResponses from "@/components/forms/analytics/responses";
import FormSecurity from "@/components/forms/analytics/security";
import FormSettings from "@/components/forms/analytics/settings";
import { IconCard } from "@/components/shared/iconCard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ERROR_ROUTES, ROUTES } from "@/constants/routes.constants";
import { Form } from "@/generated/prisma";
import { ArchiveIcon, ChartAreaIcon, MoreVerticalIcon, PencilRulerIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";

interface AnalyticsWrapperProps {
    formDetails: Form;
}

export default function AnalyticsWrapper({ formDetails }: AnalyticsWrapperProps) {
    const params = useParams();
    const teamId = params.teamId as string;
    const projectId = params.projectId as string;
    const formId = params.formId as string;

    if (!teamId || !projectId || !formId) {
        redirect(ERROR_ROUTES.NOT_FOUND);
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="space-y-6 py-4 sm:py-6">
                <div className="flex gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <IconCard icon={ChartAreaIcon} />
                        <div>
                            <h1 className="text-2xl font-medium">{formDetails.name} Analytics</h1>
                            <p className="text-muted-foreground italic">
                                View detailed analytics and insights for your form
                            </p>
                        </div>
                    </div>
                    <div className="space-x-3">
                        <Link href={ROUTES.form.edit(teamId, projectId, formId)}>
                            <Button>
                                <PencilRulerIcon className="mr-2 h-4 w-4" />
                                Edit Form
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' size='icon' className="rounded-lg shadow-none">
                                    <MoreVerticalIcon className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <ArchiveIcon className="mr-2 h-4 w-4" />
                                    Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <div className="border-b  p-2 sm:pb-3 px-0 pt-0">
                    <TabsList className="bg-accent h-11 flex items-center justify-between w-full py-1 px-1">
                        <TabsTrigger value="overview" className=" h-full flex-1 text-center !shadow-none">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="responses" className=" h-full flex-1 text-center !shadow-none">
                            Responses
                        </TabsTrigger>
                        <TabsTrigger value="security" className=" h-full flex-1 text-center !shadow-none">
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="settings" className=" h-full flex-1 text-center !shadow-none">
                            Settings
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="overview" className="px-0 py-4">
                    <FormOverview />
                </TabsContent>
                <TabsContent value="responses" className="px-0 py-4">
                    <FormResponses />
                </TabsContent>
                <TabsContent value="security" className="px-0 py-4">
                    <FormSecurity />
                </TabsContent>
                <TabsContent value="settings" className="px-0 py-4">
                    <FormSettings />
                </TabsContent>
            </Tabs>
        </div >
    );
}