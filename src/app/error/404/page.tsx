import ErrorPage from "@/components/shared/errorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Not Found - Escape Form",
    description: "The page you are looking for does not exist.",
    applicationName: "Esacape Form",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    robots: "noindex, nofollow",
    openGraph: {
        title: "Not Found - Escape Form",
        description: "The page you are looking for does not exist.",
        url: "https://dashboard.escform.com/",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function NotFoundPage() {
    return <ErrorPage errorCode={404} />;
}