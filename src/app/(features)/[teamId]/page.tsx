import { ProjectList } from "@/components/projects/projectList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Teams - Escape Form",
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

export default async function ProjectsPage() {
    return (
        <div className="container mx-auto px-4 py-6 sm:pt-12">
            <ProjectList />
        </div>
    );
};
