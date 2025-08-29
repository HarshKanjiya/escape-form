"use client"

import { SignedIn, SignedOut, SignIn, SignOutButton } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <SignedIn>
                <SignOutButton />
                <p>You are signed in!</p>
            </SignedIn>
            <SignedOut>
                <SignIn
                    routing="hash"
                    signUpUrl="/sign-up"
                    fallbackRedirectUrl="/" />
            </SignedOut>
        </div>
    )
}
