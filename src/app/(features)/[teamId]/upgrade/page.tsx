import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Upgrade team plan - Escape Form",
    description: "Upgrade your team plan to unlock more features and capabilities.",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Upgrade team plan - Escape Form",
        description: "Upgrade your team plan to unlock more features and capabilities.",
        url: "https://dashboard.escform.com/upgrade",
        siteName: "Escape Form",
        type: "website",
    }
}

export default async function UpgradePage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-medium">Upgrade Page</h1>
            <p className="text-muted-foreground">
                This is where users can upgrade their plans.
            </p>
        </div>
    );
}