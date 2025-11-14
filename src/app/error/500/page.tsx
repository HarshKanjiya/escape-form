
import ErrorPage from "@/components/shared/errorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Server Error - Escape Form",
    description: "Something went wrong on our end.",
    applicationName: "Esacape Form",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    robots: "noindex, nofollow",
    openGraph: {
        title: "Server Error - Escape Form",
        description: "Something went wrong on our end.",
        url: "https://dashboard.escform.com/",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function InternalServerErrorPage() {
    return (
        <ErrorPage
            errorCode={500}
            homeButtonText="Try Again"
            redirectPath="/"
        />
    );
}