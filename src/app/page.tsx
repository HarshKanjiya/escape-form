"use client";

import { useStore } from "@/store/useStore";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default async function Home() {

  const { isLoaded } = useUser();

  if (!isLoaded) {
    redirect('/sign-in');
    return null;
  }

  const teams = useStore((state) => state.teams);

  useEffect(() => {
    if (teams?.length) {
      redirect(teams[0].id)
    } else {
      redirect("/teams");
    }
  }, [teams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
        <p className="text-muted-foreground">Redirecting to your dashboard</p>
      </div>
    </div>
  );
}