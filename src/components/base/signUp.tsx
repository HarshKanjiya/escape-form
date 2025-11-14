"use client"

import { ROUTES } from "@/constants/routes.constants";
import { SignedOut, SignUp, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignUpComponent() {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        redirect(ROUTES.home());
    }

    return (
        <>
            <SignedOut>
                <SignUp
                    routing="hash"
                    signInUrl="/sign-in"
                    fallbackRedirectUrl="/"
                />
            </SignedOut>
        </>
    )
}
