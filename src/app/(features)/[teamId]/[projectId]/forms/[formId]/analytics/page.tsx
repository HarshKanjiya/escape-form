"use client";

import LeadCards from "@/components/forms/analytics/LeadCards";
import { IconCard } from "@/components/shared/iconCard";
import { Button } from "@/components/ui/button";
import { ERROR_ROUTES, ROUTES } from "@/constants/routes.constants";
import { BoltIcon, ChartAreaIcon, FolderOutputIcon, PencilRulerIcon } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";

export default function Page() {
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
                            <h1 className="text-2xl font-medium">Form Analytics</h1>
                            <p className="text-muted-foreground">
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
                        <Button variant='secondary' >
                            <FolderOutputIcon className="mr-2 h-4 w-4" />
                            Export Data
                        </Button>
                        <Button variant='secondary' >
                            <BoltIcon className="mr-2 h-4 w-4" />
                            Configure
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
                <LeadCards />
            </div>
        </div >
    );
}