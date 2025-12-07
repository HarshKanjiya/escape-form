import { TeamList } from "@/components/teams/teamList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Teams"
}

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-6 sm:pt-12">
            <TeamList />
        </div>
    );
}