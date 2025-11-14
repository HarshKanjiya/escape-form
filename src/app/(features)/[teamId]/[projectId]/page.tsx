import { FormList } from "@/components/forms/formList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects - Escape Form",
    description: "Manage your projects and collaborate on form building",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Projects - Escape Form",
        description: "Manage your projects and collaborate on form building",
        url: "https://dashboard.escform.com/projects",
        siteName: "Escape Form",
        type: "website",
    }
}

export default async function FormsPage() {

    return (
        <div className="container mx-auto px-4 py-6 sm:pt-12">
            <FormList />
        </div>
    );
};
