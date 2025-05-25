"use client";

import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
    // const { user, loading } = useUser();
    const { user, isLoaded, isSignedIn } = useUser()


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {user?.imageUrl || user?.username}

        </div>
    );
}