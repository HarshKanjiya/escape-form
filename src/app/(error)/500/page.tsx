
import { Metadata } from "next";
import ErrorPage from "@/components/shared/errorPage";

export const metadata: Metadata = {
    title: 'Server Error - EscapeForm',
    description: 'Something went wrong on our end.',
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