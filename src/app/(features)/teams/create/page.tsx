import CreateTeam from "@/components/teams/createTeam";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Team - Advance Form Builder",
    description: "Create a new team to collaborate on form building",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Create Team - Advance Form Builder",
        description: "Create a new team to collaborate on form building",
        url: "https://dashboard.escform.com/teams/create",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function Page() {

    return (
        <CreateTeam />
    );
}
