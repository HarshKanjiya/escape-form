import { Team } from "@/generated/prisma";
import { Skeleton } from "../ui/skeleton";
import { TeamCard } from "./teamCard";

function TeamGridView({ teams, loading }: { teams: Team[]; loading: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                loading ?
                    Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-32 w-full" />
                    ))
                    :
                    teams.map((team) => <TeamCard key={team.id} team={team} />)
            }
        </div>
    );
}

export default TeamGridView;