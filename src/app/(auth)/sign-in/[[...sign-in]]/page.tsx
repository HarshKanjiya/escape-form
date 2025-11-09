"use client"

import { ROUTES } from "@/constants/routes.constants";
import { SignedOut, SignIn, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function LoginPage() {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        redirect(ROUTES.home());
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <SignedOut>
                <SignIn
                    routing="hash"
                    signUpUrl="/sign-up"
                    fallbackRedirectUrl="/" />
            </SignedOut>
        </div>
    )
}
