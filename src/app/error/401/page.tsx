import ErrorPage from "@/components/shared/errorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unauthorized - Escape Form",
    description: "You are not authorized to access this page",
    applicationName: "Esacape Form",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    robots: "noindex, nofollow",
    openGraph: {
        title: "Unauthorized - Escape Form",
        description: "You are not authorized to access this page",
        url: "https://dashboard.escform.com/",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function UnAuthorizedPage() {
    return (
        <ErrorPage
            errorCode={401}
            homeButtonText="Back to Login"
            redirectPath="/sign-in"
        />
    );
}