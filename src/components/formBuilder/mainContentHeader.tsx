"use client";

import { eViewMode, eViewScreenMode } from "@/enums/form";
import { FormStatus } from "@prisma/client";
import { showSuccess } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Archive, ArchiveRestore, CopyIcon, ExternalLinkIcon, Laptop, PencilRuler, Play, RefreshCcw, Rocket, RocketIcon, Smartphone, TrendingUpDown, UndoDotIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddQuestionDialog from "./ui/addQuestionDialog";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import SignInRequired from "./signInRequired";

export default function MainContentHeader() {

    const viewMode = useFormBuilder((state) => state.viewMode);
    const viewScreenMode = useFormBuilder((state) => state.viewScreenMode);
    const setViewMode = useFormBuilder((state) => state.setViewMode);
    const setViewScreenMode = useFormBuilder((state) => state.setViewScreenMode);
    const savingCount = useFormBuilder((state) => state.savingCount);
    const dataSource = useFormBuilder((state) => state.dataSource);
    const changeStatus = useFormBuilder((state) => state.changeStatus);

    const [published, setPublished] = useState(false);

    const publishForm = async () => {
        const res = await changeStatus(FormStatus.PUBLISHED);
        if (!res) return;

        setPublished(true);
        showSuccess("Form Published");
    }

    const unpublishForm = async () => {
        const res = await changeStatus(FormStatus.DRAFT);
        if (!res) return;

        showSuccess("Form Unpublished");
    }

    const archiveForm = async () => {
        const res = await changeStatus(FormStatus.ARCHIVED);
        if (!res) return;

        showSuccess("Form Archived");
    }

    const restoreForm = async () => {
        const res = await changeStatus(FormStatus.DRAFT)
        if (!res) return;

        showSuccess("Form Restored");
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(`https://form.escform.com/f/${dataSource.uniqueSubdomain}`);
        showSuccess("URL Copied");
    }

    const openUrl = () => {
        window.open(`https://form.escform.com/f/${dataSource.uniqueSubdomain}`, '_blank');
    }

    return (
        <>
            <div className="px-2 flex items-center justify-between py-2 w-full gap-3 border-b bg-accent-bg">
                <div className="flex items-center gap-2">
                    <AddQuestionDialog />
                    <Separator orientation="vertical" className="h-8!" />
                    <div className="flex items-center gap-1">
                        <div className="flex items-center outline outline-secondary -outline-offset-1 rounded-md">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="rounded-r-none" variant={viewMode == eViewMode.Builder ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewMode(eViewMode.Builder)}>
                                        <PencilRuler />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <TooltipArrow />
                                    Form Editor
                                </TooltipContent>
                            </Tooltip>
                            <Separator orientation="vertical" className="h-[36px]! mx-0" />
                            {/* <Tooltip >
                                <TooltipTrigger asChild>
                                    <Button className="rounded-none" variant={viewMode == eViewMode.Workflow ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewMode(eViewMode.Workflow)}>
                                        <TrendingUpDown />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Work Flow
                                </TooltipContent>
                            </Tooltip>
                            <Separator orientation="vertical" className="h-[36px]! mx-0" /> */}
                            <Tooltip >
                                <TooltipTrigger asChild>
                                    <Button className="rounded-l-none" variant={viewMode == eViewMode.Preview ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewMode(eViewMode.Preview)}>
                                        <Play />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Preview
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <AnimatePresence mode="sync" initial={false}>
                            {
                                viewMode === eViewMode.Preview ? (
                                    <motion.div className="flex items-center gap-1"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ type: 'tween', duration: 0.150 }}
                                        key="view-toggle"
                                        layout
                                    >
                                        <Separator orientation="vertical" className="h-8! mx-1" />
                                        <div className="flex items-center outline outline-secondary -outline-offset-1 rounded-md">
                                            <Button className="rounded-r-none" variant={viewScreenMode == eViewScreenMode.Desktop ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewScreenMode(eViewScreenMode.Desktop)}>
                                                <Laptop />
                                            </Button>
                                            <Separator orientation="vertical" className="h-[36px]! mx-0" />
                                            <Button className="rounded-l-none" variant={viewScreenMode == eViewScreenMode.Mobile ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewScreenMode(eViewScreenMode.Mobile)}>
                                                <Smartphone />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : null
                            }
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {
                        savingCount > 0 &&
                        <span className="animate-pulse flex items-center gap-3 mr-5 text-muted-foreground/50">
                            <RefreshCcw className="animate-spin ml-1" size={14} />
                            <span className="italic text-sm">Saving...</span>
                        </span>
                    }

                    <div className="flex items-center gap-2">
                        {
                            dataSource.status == FormStatus.PUBLISHED ?
                                <SignInRequired>
                                    <Button onClick={unpublishForm} variant={'secondary'}>
                                        <UndoDotIcon className="mr-1" size={14} />
                                        Unpublish
                                    </Button>
                                </SignInRequired> :
                                null
                        }
                        {
                            dataSource.status == FormStatus.DRAFT ?
                                <SignInRequired>
                                    <Button onClick={publishForm}>
                                        <Rocket className="mr-1" size={14} />
                                        Publish
                                    </Button>
                                </SignInRequired> :
                                null
                        }
                        {
                            dataSource.status == FormStatus.ARCHIVED ?
                                <SignInRequired>
                                    <Button onClick={restoreForm}>
                                        <ArchiveRestore className="mr-1" size={14} />
                                        Restore
                                    </Button>
                                </SignInRequired>
                                : <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SignInRequired>
                                            <Button onClick={archiveForm} size={'icon'} className="p-1!" variant={'secondary'}>
                                                <Archive size={14} />
                                            </Button>
                                        </SignInRequired>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <TooltipArrow />
                                        Archive
                                    </TooltipContent>
                                </Tooltip>
                        }
                    </div>
                </div>
            </div>
            <Dialog open={published} onOpenChange={setPublished}>
                <DialogContent>
                    <DialogHeader className="sr-only">
                        <DialogTitle>Form Published</DialogTitle>
                        <DialogDescription>
                            Your form has been published successfully.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center flex-col gap-2">
                        <div className="flex items-center gap-8 flex-col py-8">
                            <div>
                                <RocketIcon size={48} className="animate-rocket-in-air" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold">Form Published</h2>
                                <p className="text-muted-foreground text-sm mt-2">Your form has been published successfully.</p>
                            </div>
                        </div>
                        <div className="w-full text-center">
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-sm flex items-center justify-center px-8 h-9 rounded-md border border-input">
                                    form.escform.com/f/{dataSource.uniqueSubdomain}
                                </p>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={'icon'} variant={'outline'} onClick={copyUrl}>
                                            <CopyIcon />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <TooltipArrow />
                                        Copy
                                    </TooltipContent>
                                </Tooltip>
                                <Separator orientation="vertical" className="h-[32px]! mx-0" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={'icon'} variant={'outline'} onClick={openUrl}>
                                            <ExternalLinkIcon />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <TooltipArrow />
                                        Open in new tab
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
