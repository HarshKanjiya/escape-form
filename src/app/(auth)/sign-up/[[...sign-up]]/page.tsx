import SignUpComponent from "@/components/base/signUp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up - Escape Form",
    description: "Welcome to escForm. Log in securely to manage your forms, view submission data, and collaborate with your team",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign up, escape form sign up, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Sign Up - Escape Form",
        description: "Welcome to escForm. Log in securely to manage your forms, view submission data, and collaborate with your team",
        url: "https://dashboard.escform.com/sign-up",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <SignUpComponent />
        </div>
    )
}
