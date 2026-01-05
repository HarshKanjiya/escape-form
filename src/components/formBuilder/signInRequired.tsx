"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFormBuilder } from "@/store/useFormBuilder";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { cloneElement, isValidElement, useState } from "react";
import { CustomDialog, CustomDialogBody, CustomDialogContent, CustomDialogDescription, CustomDialogFooter, CustomDialogHeader, CustomDialogTitle } from "../ui/custom-dialog";

interface SignInRequiredProps {
    children: React.ReactNode;
}

export default function SignInRequired({ children }: SignInRequiredProps) {
    const [showDialog, setShowDialog] = useState(false);
    const shouldSave = useFormBuilder((state) => state.shouldSave);

    // If shouldSave is true (user is logged in / normal mode), render children normally
    if (shouldSave) {
        return <>{children}</>;
    }

    // In tryout mode, intercept clicks and show dialog
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDialog(true);
    };

    // Clone the child element and override its onClick
    if (isValidElement(children)) {
        const childElement = cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
        });

        return (
            <>
                {childElement}

                <CustomDialog open={showDialog} onOpenChange={setShowDialog}>
                    <CustomDialogContent className="sm:max-w-md">
                        <CustomDialogHeader>
                            <CustomDialogTitle className="text-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                                    <LogInIcon className="h-6 w-6 text-primary" />
                                </div>
                                Sign In Required
                            </CustomDialogTitle>
                        </CustomDialogHeader>
                        <CustomDialogBody className="flex items-center flex-col gap-6 py-2">
                            <p className="text-center text-muted-foreground">
                                You&apos;re in tryout mode. Create an account to save your forms and unlock all features.
                            </p>
                            <div className="flex flex-col items-center gap-3 w-full">
                                <Link href="/sign-up" className="w-full">
                                    <Button className="w-full" size="lg">
                                        Sign Up to Continue
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowDialog(false)}
                                    className="w-full"
                                >
                                    Continue Exploring
                                </Button>
                            </div>
                        </CustomDialogBody>
                    </CustomDialogContent>
                </CustomDialog>
            </>
        );
    }

    // Fallback for non-element children
    return (
        <>
            <div onClick={handleClick}>
                {children}
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center space-y-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto">
                            <LogInIcon className="h-6 w-6 text-primary" />
                        </div>
                        <DialogTitle className="text-center">
                            Sign In Required
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            You&apos;re in tryout mode. Create an account to save your forms and unlock all features.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col gap-3 sm:flex-col">
                        <Link href="/sign-up" className="w-full">
                            <Button className="w-full" size="lg">
                                Sign Up to Continue
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={() => setShowDialog(false)}
                            className="w-full"
                        >
                            Continue Exploring
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
