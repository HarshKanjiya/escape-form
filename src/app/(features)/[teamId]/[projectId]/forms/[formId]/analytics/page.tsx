import AnalyticsWrapper from "@/components/forms/analytics/analyticsWrapper";
import { ERROR_ROUTES } from "@/constants/routes.constants";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Form Analytics - Escape Form",
    description: "Manage your teams and collaborate on form building",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Teams - Escape Form",
        description: "Manage your teams and collaborate on form building",
        url: "https://dashboard.escform.com/teams",
        siteName: "Escape Form",
        type: "website",
    }
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