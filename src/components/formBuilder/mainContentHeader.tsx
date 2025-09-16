"use client";

import { eFormStatus, eViewMode, eViewScreenMode } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, ArchiveRestore, Laptop, PencilRuler, Play, RefreshCcw, Rocket, Smartphone, TrendingUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddQuestionDialog from "./ui/addIQuestionDialog";
import { useRouter, useParams } from "next/navigation";

export default function MainContentHeader() {

    const params = useParams();

    const { viewMode, viewScreenMode, setViewMode, setViewScreenMode, isSaving, status } = useFormBuilder()

    const onPreviewClick = () => {
        try {
            const teamId = params?.["teamId"] as string | undefined;
            const projectId = params?.["projectId"] as string | undefined;
            const formId = params?.["formId"] as string | undefined;
            if (!teamId || !projectId || !formId) return;
            const previewUrl = `/${teamId}/${projectId}/forms/${formId}/preview`;
            window.open(previewUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {
            console.error('Failed to open preview', e);
        }
    }

    return (
        <div className="px-2 flex items-center justify-between py-2 w-full gap-3 border-b bg-accent/50">
            <div className="flex items-center gap-2">
                <AddQuestionDialog />
                <Separator orientation="vertical" className="!h-8" />
                <div className="flex items-center gap-1">
                    <AnimatePresence mode="sync" initial={false}>
                        {viewMode === eViewMode.Builder && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ type: 'tween', duration: 0.2 }}
                                key="view-toggle"
                                layout
                            >
                                <div>
                                    <Tooltip delayDuration={500}>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => setViewScreenMode(viewScreenMode === eViewScreenMode.Desktop ? eViewScreenMode.Mobile : eViewScreenMode.Desktop)}>
                                                {viewScreenMode === eViewScreenMode.Desktop ? <Laptop /> : <Smartphone />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>View Mode</TooltipContent>
                                    </Tooltip>
                                </div>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            key="play-button"
                            className="flex items-center gap-2"
                            layout
                        >
                            <div>
                                <Tooltip delayDuration={500}>
                                    <TooltipTrigger asChild>
                                        <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onPreviewClick}>
                                            <Play />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Preview</TooltipContent>
                                </Tooltip>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {
                    isSaving &&
                    <span className="animate-pulse flex items-center gap-3 mr-5">
                        <RefreshCcw className="animate-spin ml-1" size={14} />
                        <span className="italic text-sm">Sync</span>
                    </span>
                }
                <div className="flex items-center gap-1">
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                            <Button variant={viewMode == eViewMode.Builder ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewMode(eViewMode.Builder)}>
                                <PencilRuler />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Form Editor
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                            <Button variant={viewMode == eViewMode.Workflow ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setViewMode(eViewMode.Workflow)}>
                                <TrendingUpDown />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Work Flow
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Separator orientation="vertical" className="!h-8" />
                <div className="flex items-center gap-2">
                    {
                        status == eFormStatus.draft ?
                            <Button>
                                <Rocket className="mr-1" size={14} />
                                Publish
                            </Button>
                            : null
                    }
                    {
                        status == eFormStatus.archived ?
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
