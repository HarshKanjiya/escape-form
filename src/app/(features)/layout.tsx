
import Header from "@/core/components/Header";
import Sidebar from "@/core/components/SideBar";
import HydrateTeams from "@/components/teams/HydrateTeams";
import { getUserTeams } from "@/actions/team";

export default async function Layout({ children }: { children: React.ReactNode; }) {


    return (
        <div className="flex h-screen w-full flex-col bg-background">
            {/* Hydrate teams data into Zustand store */}

            <Header />
            <div className="flex flex-1 h-full w-full">
                <Sidebar />
                <main className="flex-1 w-full transition-all duration-300 ease-in-out p-2 sm:p-4">
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}