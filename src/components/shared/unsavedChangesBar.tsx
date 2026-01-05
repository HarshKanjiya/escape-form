"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    return (
        <AnimatePresence>
            {hasChanges && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 1 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
                    }}
                    className={cn(
                        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                    )}
                >
                    <div className="flex items-center gap-4 bg-background border border-border rounded-3xl corner-squircle shadow-[0px_12px_46px_25px_rgba(0,0,0,0.1)] px-4 py-3">
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
                </motion.div>
            )}
        </AnimatePresence>
    );
}
