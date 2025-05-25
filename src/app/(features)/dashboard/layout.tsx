import Header from "@/components/common/header";
import Sidebar from "@/components/common/sideBar";

export default function DashboardLayout({ children }: {
    children: React.ReactNode;
}) {

    return (
        // <SidebarProvider>
        <div className="flex h-screen w-full flex-col">
            <Header />
            <div className="flex flex-1 h-full w-full">
                <Sidebar />
                <main>
                    {children}
                </main>
            </div>
        </div>
        // </SidebarProvider>
    )
}