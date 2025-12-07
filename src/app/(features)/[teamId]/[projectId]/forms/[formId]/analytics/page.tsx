import AnalyticsWrapper from "@/components/forms/analytics/analyticsWrapper";
import { ERROR_ROUTES } from "@/constants/routes.constants";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Form Analytics",
}

interface AnalyticsPageProps {
    params: Promise<{
        teamId: string;
        projectId: string;
        formId: string;
    }>;
    searchParams: Promise<{
        tab?: string;
    }>
}

export default async function Page({ params, searchParams }: AnalyticsPageProps) {

    const paramsObj = await params;
    const formId = paramsObj?.formId;
    const projectId = paramsObj?.projectId;
    const teamId = paramsObj?.teamId;
    const tab = (await searchParams)?.tab;

    if (!formId || !projectId || !teamId) {
        redirect(ERROR_ROUTES.NOT_FOUND);
    }

    const formDetails = await prisma.form.findFirst({
        where: { id: formId }
    });

    if (!formDetails) {
        redirect(ERROR_ROUTES.NOT_FOUND);
    }

    return (
        <AnalyticsWrapper formDetails={formDetails} tab={tab} />
    );
}