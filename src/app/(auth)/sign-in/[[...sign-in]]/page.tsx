import SignInComponent from "@/components/base/signIn";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Sign In - Escape Form",
    description: "Welcome back to escForm. Log in securely to manage your forms, view submission data, and collaborate with your team",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Sign In - Escape Form",
        description: "Welcome back to escForm. Log in securely to manage your forms, view submission data, and collaborate with your team",
        url: "https://dashboard.escform.com/sign-in",
        siteName: "Escape Form",
        type: "website",
    }
}


export default function LoginPage() {

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <SignInComponent />
        </div>
    )
}
