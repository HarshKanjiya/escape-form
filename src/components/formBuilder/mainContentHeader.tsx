"use client";

import { eViewMode, eViewScreenMode } from "@/enums/form";
import { FormStatus } from "@/generated/prisma";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "motion/react";
import { Archive, ArchiveRestore, Laptop, PencilRuler, Play, RefreshCcw, Rocket, Smartphone, TrendingUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddQuestionDialog from "./ui/addIQuestionDialog";

export default function MainContentHeader() {
    const { viewMode, viewScreenMode, savingCount, dataSource, setViewMode, setViewScreenMode } = useFormBuilder()

    return (
        <div className="px-2 flex items-center justify-between py-2 w-full gap-3 border-b bg-accent-bg">
            <div className="flex items-center gap-2">
                <AddQuestionDialog />
                <Separator orientation="vertical" className="!h-8" />
                <div className="flex items-center gap-1">
                    <div className="flex items-center outline outline-secondary -outline-offset-1 rounded-md">
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button className="rounded-r-none" variant={viewMode == eViewMode.Builder ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewMode(eViewMode.Builder)}>
                                    <PencilRuler />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Form Editor
                            </TooltipContent>
                        </Tooltip>
                        <Separator orientation="vertical" className="!h-[36px] mx-0" />
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button className="rounded-none" variant={viewMode == eViewMode.Workflow ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewMode(eViewMode.Workflow)}>
                                    <TrendingUpDown />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Work Flow
                            </TooltipContent>
                        </Tooltip>
                        <Separator orientation="vertical" className="!h-[36px] mx-0" />
                        <Tooltip delayDuration={100}>
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
                                    <Separator orientation="vertical" className="!h-8 mx-1" />
                                    <div className="flex items-center outline outline-secondary -outline-offset-1 rounded-md">
                                        <Button className="rounded-r-none" variant={viewScreenMode == eViewScreenMode.Desktop ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewScreenMode(eViewScreenMode.Desktop)}>
                                            <Laptop />
                                        </Button>
                                        <Separator orientation="vertical" className="!h-[36px] mx-0" />
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
                        dataSource.status == FormStatus.DRAFT ?
                            <Button>
                                <Rocket className="mr-1" size={14} />
                                Publish
                            </Button>
                            : null
                    }
                    {
                        dataSource.status == FormStatus.ARCHIVED ?
                            <Button>
                                <ArchiveRestore className="mr-1" size={14} />
                                Restore
                            </Button>
                            : <Button size={'icon'} className="!p-1" variant={'secondary'}>
                                <Archive size={14} />
                            </Button>
                    }
                </div>
            </div>
        </div>
    );
}
