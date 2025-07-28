
import Header from "@/core/components/Header";
import Sidebar from "@/core/components/SideBar";

export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: React.ReactNode; }) {


    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <div className="h-16 w-full">
                <Header />
            </div>
            <div className="flex flex-1 h-full w-full">
                <Sidebar />
                <main className="flex-1 w-full transition-all duration-300 ease-in-out mt-16">
                    <div className="h-full overflow-auto p-2 sm:p-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}