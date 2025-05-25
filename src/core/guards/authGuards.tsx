"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password"]; // Define public routes

    useEffect(() => {
        // Ensure this code runs only on the client
        setIsClient(true);

        if (isClient) {
            const currentPath = window.location.pathname; // Get the current route
            if (!isSignedIn && !publicRoutes.includes(currentPath)) {
                router.push("/sign-in"); // Redirect to the sign-in page
            }
        }
    }, [isSignedIn, router, isClient]);

    if (!isSignedIn && isClient && !publicRoutes.includes(window?.location.pathname)) {
        return null; // Optionally, show a loading spinner here
    }

    return <>{children}</>;
}