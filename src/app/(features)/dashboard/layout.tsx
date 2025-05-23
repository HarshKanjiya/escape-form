import Header from "@/components/common/header";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: {
    children: React.ReactNode;
}) {

    return (
        <SidebarProvider>
            <Header />
            <Sidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}