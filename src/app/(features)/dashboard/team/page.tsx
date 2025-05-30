"use client";

import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/useTeam";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeamPage() {
  const { teams, loading, createPersonalTeam } = useTeam();
  const router = useRouter();

  useEffect(() => {
    async function initializeTeam() {
      if (!loading && teams.length === 0) {
        const team = await createPersonalTeam();
        if (team) {
          router.push(`/dashboard/team/${team.id}`);
        }
      } else if (!loading && teams.length > 0) {
        router.push(`/dashboard/team/${teams[0].id}`);
      }
    }

    initializeTeam();
  }, [loading, teams, createPersonalTeam, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-lg border p-4 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => router.push(`/dashboard/team/${team.id}`)}
          >
            <h2 className="font-semibold">{team.name}</h2>
            <p className="text-sm text-muted-foreground">
              Created {new Date(team.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}