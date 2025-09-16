"use client";

import { Button } from "@/components/ui/button";
import { Eye, PencilRuler } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    const params = useParams();
    const router = useRouter();

    const handleBackToEditor = () => {
        const teamId = params?.["teamId"] as string | undefined;
        const projectId = params?.["projectId"] as string | undefined;
        const formId = params?.["formId"] as string | undefined;
        if (!teamId || !projectId || !formId) return;
        router.push(`/${teamId}/${projectId}/forms/${formId}/edit`);
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full bg-gradient-to-r from-yellow-200/40 via-amber-200/30 to-transparent dark:from-yellow-300/10 dark:via-amber-300/5 backdrop-blur border-b border-yellow-300/40 dark:border-yellow-700/40 px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-300 flex items-center justify-center">
                        <Eye className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base sm:text-lg font-semibold leading-tight flex items-center gap-2 text-yellow-900 dark:text-yellow-200">
                            Preview Mode
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">This is how your form will appear to respondents.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Separator orientation="vertical" className="h-6 hidden sm:block" />
                    <Button onClick={handleBackToEditor} className="gap-2" size="sm">
                        <PencilRuler className="h-4 w-4" />
                        Editor
                    </Button>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center text-sm text-muted-foreground">
                    <p>Form content preview coming soon.</p>
                </div>
            </div>
        </div>
    );
}