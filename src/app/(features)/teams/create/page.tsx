import CreateTeam from "@/components/teams/createTeam";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Team",
}

export default function Page() {

    return (
        <CreateTeam />
    );
}
