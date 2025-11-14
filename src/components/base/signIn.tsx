"use client"

import { ROUTES } from "@/constants/routes.constants";
import { SignedOut, SignIn, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignInComponent() {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        redirect(ROUTES.home());
    }

    return (
        <>
            <SignedOut>
                <SignIn
                    routing="hash"
                    signUpUrl="/sign-up"
                    fallbackRedirectUrl="/" />
            </SignedOut>
        </>
    )
}
