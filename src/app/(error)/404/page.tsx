
import { Metadata } from "next";
import ErrorPage from "@/components/shared/errorPage";

export const metadata: Metadata = {
    title: 'Not Found - EscapeForm',
    description: 'The page you are looking for does not exist.',
}

export default function NotFoundPage() {
    return <ErrorPage errorCode={404} />;
}