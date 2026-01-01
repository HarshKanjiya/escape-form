"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface UnsavedChangesBarProps {
    hasChanges: boolean;
    onAction: (save: boolean) => void;
    isLoading?: boolean;
    saveLabel?: string;
    discardLabel?: string;
    message?: string;
}

export function UnsavedChangesBar({
    hasChanges,
    onAction,
    isLoading = false,
    saveLabel = "Save",
    discardLabel = "Reset",
    message = "Unsaved changes",
}: UnsavedChangesBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (hasChanges) {
            // Small delay for smooth animation
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [hasChanges]);

    if (!hasChanges) return null;

    return (
        <div
            className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
            )}
        >
            <div className="flex items-center gap-4 bg-background border border-border rounded-lg shadow-lg px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{message}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onAction(false)}
                        disabled={isLoading}
                    >
                        {discardLabel}
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => onAction(true)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : saveLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
