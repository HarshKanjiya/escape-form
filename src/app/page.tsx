"use client"

import { useGlobalStore } from "@/store/useStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const teams = useGlobalStore((state) => state.teams);
  useEffect(() => {
    if (teams?.length) {
      redirect(teams[0].id)
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