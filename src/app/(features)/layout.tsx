import Header from "@/core/components/Header";

export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <div className="min-h-16 w-full">
                <Header />
            </div>
            <div className="flex flex-1 h-[calc(100vh-4rem)] w-full">
                <main className="flex-1 w-full transition-all duration-300 ease-in-out h-auto overflow-auto">
                    <div className="h-full overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}