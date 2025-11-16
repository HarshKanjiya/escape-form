import FormBuilderWrapper from "@/components/formBuilder/formBuilderWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Form Editor - Escape Form",
    description: "Build and customize your forms with Escape Form's intuitive form editor.",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form editor, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Form Editor - Escape Form",
        description: "Build and customize your forms with Escape Form's intuitive form editor.",
        url: "https://dashboard.escform.com/teams",
        siteName: "Escape Form",
        type: "website",
    }
}


export default function Page() {
    return (
        <FormBuilderWrapper />
    );
}