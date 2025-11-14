import Header from "@/core/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Escape Form - Advance Form Builder",
    description: "Create beautiful forms with team collaboration and advanced analytics",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Escape Form - Advance Form Builder",
        description: "Create beautiful forms with team collaboration and advanced analytics",
        url: "https://dashboard.escform.com/",
        siteName: "Escape Form",
        type: "website",
    }
}

export default async function Layout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="flex h-screen w-full flex-col bg-accent-bg">
            <div className="min-h-16 w-full">
                <Header />
            </div>
            <div className="flex flex-1 h-[calc(100vh-4rem)] w-full">
                <main className="flex-1 w-full transition-all duration-300 ease-in-out h-auto overflow-auto">
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}