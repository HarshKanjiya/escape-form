import Header from "@/components/common/header";
import DynamicSidebar from "@/components/common/dynamic-sidebar";

export default function DashboardLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <Header />
            <div className="flex flex-1 h-full w-full">
                <DynamicSidebar />
                <main className="flex-1 ml-16 lg:ml-64 transition-all duration-300 ease-in-out">
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}