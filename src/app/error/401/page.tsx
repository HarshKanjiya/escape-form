
import { Metadata } from "next";
import ErrorPage from "@/components/shared/errorPage";

export const metadata: Metadata = {
    title: 'Unauthorized - EscapeForm',
    description: 'You are not authorized to access this page.',
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