import ErrorPage from "@/components/shared/errorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Method Not Allowed - Escape Form",
    description: "The request method is not supported for this resource.",
    applicationName: "Esacape Form",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    robots: "noindex, nofollow",
    openGraph: {
        title: "Method Not Allowed - Escape Form",
        description: "The request method is not supported for this resource.",
        url: "https://dashboard.escform.com/",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function MethodNotAllowedPage() {
    return (
        <ErrorPage
            errorCode={405}
            homeButtonText="Go Back"
            redirectPath="/"
        />
    );
}