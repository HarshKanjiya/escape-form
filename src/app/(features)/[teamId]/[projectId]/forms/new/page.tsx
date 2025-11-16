import { FormCreationStepper } from "@/components/forms/FormCreationStepper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Form - Escape Form",
    description: "Create a new form with Escape Form's intuitive form builder",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, escape form sign in, esc form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Create Form - Escape Form",
        description: "Create a new form with Escape Form's intuitive form builder",
        url: "https://dashboard.escform.com/forms/new",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function FormCreatePage() {
    return (
        <FormCreationStepper />
    )
}