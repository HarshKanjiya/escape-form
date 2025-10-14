"use client";

import { getFormById } from "@/actions/form";
import LeftBar from "@/components/formBuilder/leftBar";
import MainContent from "@/components/formBuilder/mainContent";
import RightBar from "@/components/formBuilder/rightBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormBuilder } from "@/store/useFormBuilder";
import { useParams } from "next/navigation";
import { useEffect } from "react";

// Loading skeleton component that mimics the form builder layout
function FormBuilderLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center h-full w-full flex-1">
            {/* Left Bar Skeleton */}
            <div className="w-80 h-full border-r bg-background p-4 space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-2">
                            <Skeleton className="h-8 w-8 rounded" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 h-full p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex space-x-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />

                    <div className="space-y-4 mt-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="border rounded p-4 space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Bar Skeleton */}
            <div className="w-80 h-full border-l bg-background p-4 space-y-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {

    const { initForm, setIsLoading, isLoading } = useFormBuilder();
    const params = useParams();

    useEffect(() => {
        setIsLoading(true);
        getForm();
    }, []);

    const getForm = async () => {
        const formId = params.formId;
        if (!formId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await getFormById(params["formId"] as string);
            if (response.success && response.data) {
                initForm(response.data);
            } else {
                console.error('Error fetching form:', response.isError);
            }
        } catch (error) {
            console.error('Error fetching form:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <FormBuilderLoadingSkeleton />;
    }

    return (
        <div className="flex items-center justify-center h-full w-full flex-1">
            <LeftBar />
            <MainContent />
            <RightBar />
        </div>
    );
}