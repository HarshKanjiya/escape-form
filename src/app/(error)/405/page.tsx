import { Metadata } from "next";
import ErrorPage from "@/components/shared/errorPage";

export const metadata: Metadata = {
    title: 'Method Not Allowed - EscapeForm',
    description: 'The request method is not supported for this resource.',
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