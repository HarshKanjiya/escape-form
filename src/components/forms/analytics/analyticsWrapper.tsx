"use client";

import FormOverview from "@/components/forms/analytics/overview";
import FormResponses from "@/components/forms/analytics/responses";
import FormSecurity from "@/components/forms/analytics/security";
import FormSettings from "@/components/forms/analytics/settings";
import { IconCard } from "@/components/shared/iconCard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ERROR_ROUTES, ROUTES } from "@/constants/routes.constants";
import { Form } from "@prisma/client";
import { ArchiveIcon, ArchiveRestoreIcon, ChartAreaIcon, Loader2, MoreVerticalIcon, PencilRulerIcon, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiConstants } from "@/constants/api.constants";
import api from "@/lib/axios";
import { showError, showSuccess } from "@/lib/utils";
import { ActionResponse } from "@/types/common";

interface AnalyticsWrapperProps {
    formDetails: Form;
    tab?: string;
}

export default function AnalyticsWrapper({ formDetails, tab }: AnalyticsWrapperProps) {
    const [activeTab, setActiveTab] = useState(tab || 'overview');
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const params = useParams();
    const router = useRouter();
    const teamId = params.teamId as string;
    const projectId = params.projectId as string;
    const formId = params.formId as string;

    if (!teamId || !projectId || !formId) {
        redirect(ERROR_ROUTES.NOT_FOUND);
    }

    const isArchived = formDetails.status === 'ARCHIVED';

    const handleArchive = async () => {
        setIsArchiving(true);
        const action = isArchived ? 'PUBLISHED' : 'ARCHIVED';
        const successMessage = isArchived ? 'Form unarchived successfully' : 'Form archived successfully';
        const errorMessage = isArchived ? 'Failed to unarchive form' : 'Failed to archive form';
        
        try {
            const response = await api.post<ActionResponse>(apiConstants.form.archiveForm(formId), {
                action
            });
            
            if (response.data?.success) {
                showSuccess(successMessage);
                router.refresh();
            } else {
                showError(response.data?.message || errorMessage);
            }
        } catch (error: any) {
            showError(error.response?.data?.message || errorMessage);
        } finally {
            setIsArchiving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await api.delete<ActionResponse>(apiConstants.form.softDeleteForm(formId));
            
            if (response.data?.success) {
                showSuccess('Form deleted successfully');
                router.push(ROUTES.project.list(teamId, projectId));
            } else {
                showError(response.data?.message || 'Failed to delete form');
            }
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to delete form');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRefetchForm = () => {
        router.refresh();
    };


    return (
        <div className="container mx-auto px-4 py-6 h-full">
            <div className="space-y-6 py-4 sm:py-6">
                <div className="flex gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <IconCard icon={ChartAreaIcon} />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-medium">{formDetails.name} Analytics</h1>
                                {isArchived && (
                                    <Badge variant="secondary" className="text-xs">
                                        <ArchiveIcon className="h-3 w-3" />
                                        Archived
                                    </Badge>
                                )}
                            </div>
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
                                <Button 
                                    variant='outline' 
                                    size='icon' 
                                    className="rounded-lg shadow-none"
                                    disabled={isArchiving || isDeleting}
                                >
                                    <MoreVerticalIcon className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                    onClick={handleArchive}
                                    disabled={isArchiving || isDeleting}
                                >
                                    {isArchiving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : isArchived ? (
                                        <ArchiveRestoreIcon className="mr-2 h-4 w-4" />
                                    ) : (
                                        <ArchiveIcon className="mr-2 h-4 w-4" />
                                    )}
                                    {isArchived ? 'Unarchive' : 'Archive'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={handleDelete}
                                    disabled={isArchiving || isDeleting}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-destructive" />
                                    ) : (
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                    )}
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b  p-2 sm:pb-3 px-0 pt-0">
                    <TabsList className="bg-accent h-11 flex items-center justify-between w-full py-1 px-1">
                        <TabsTrigger value="overview" className=" h-full flex-1 text-center shadow-none!">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="submissions" className=" h-full flex-1 text-center shadow-none!">
                            Submissions
                        </TabsTrigger>
                        <TabsTrigger value="security" className=" h-full flex-1 text-center shadow-none!">
                            Security
                        </TabsTrigger>
                        {/* <TabsTrigger value="connect" className=" h-full flex-1 text-center shadow-none!">
                            Connect
                        </TabsTrigger> */}
                        <TabsTrigger value="settings" className=" h-full flex-1 text-center shadow-none!">
                            Settings
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="overview" className="px-0 py-4">
                    <motion.div
                        key="overview-tab"
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FormOverview form={formDetails} />
                    </motion.div>
                </TabsContent>
                <TabsContent value="submissions" className="px-0 py-4">
                    <motion.div
                        key="submissions-tab"
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FormResponses form={formDetails} />
                    </motion.div>
                </TabsContent>
                <TabsContent value="security" className="px-0 py-4">
                    <motion.div
                        key="security-tab"
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FormSecurity form={formDetails} refetchForm={handleRefetchForm} />
                    </motion.div>
                </TabsContent>
                <TabsContent value="settings" className="px-0 py-4">
                    <motion.div
                        key="settings-tab"
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FormSettings form={formDetails} refetchForm={handleRefetchForm} />
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div >
    );
}