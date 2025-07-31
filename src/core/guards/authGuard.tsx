"use client";
import { useStore } from "@/store/useStore";
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useUser();
    const teams = useStore((state) => state.teams);
    const router = useRouter();

    useEffect(() => {
        // Wait for Clerk to finish loading
        if (!isLoaded || !window) return;

        const currentPath = window.location.pathname;

        if (!isSignedIn && !publicRoutes.includes(currentPath)) {
            router.push('/sign-in');
            return;
        }
        if (isSignedIn && currentPath === '/') {
            if (teams?.length) redirect(`/${teams[0].id}`);
            else redirect('/teams');
        }
    }, [isSignedIn, isLoaded, router, teams]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
                    <p className="text-muted-foreground">Redirecting to your dashboard</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}