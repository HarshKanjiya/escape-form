import FormBuilderWrapper from "@/components/formBuilder/formBuilderWrapper";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const { userId } = await auth();

    if (userId) {
        redirect(ROUTES.home());
    }

    return (
        <div className="flex h-screen w-full flex-col bg-accent-bg">
            <div className="min-h-16 w-full">
                <div className="fixed w-full flex items-center justify-between h-16 px-4 border-b bg-background z-10">
                    <div className="flex items-center gap-0">
                        <Link href={"/"} className="flex items-center gap-2">
                            <Image
                                src="/logo-light.svg"
                                alt="Logo"
                                width={36}
                                height={36}
                                className="rounded-4xl corner-squircle overflow-hidden border-2 border-muted"
                            />
                        </Link>

                        <div className="text-muted-foreground flex items-center gap-1">
                            <span className="capitalize px-4">Try Out Form Editor</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/sign-up">
                            <Button variant="default" className="rounded-full">
                                Sign Up to Save
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 h-[calc(100vh-4rem)] w-full">
                <main className="flex-1 w-full transition-all duration-300 ease-in-out h-auto overflow-auto">
                    <div className="h-full overflow-auto">
                        <FormBuilderWrapper shouldSave={false} />
                    </div>
                </main>
            </div>
        </div>
    )
}