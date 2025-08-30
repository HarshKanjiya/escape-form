"use client";

import { eQuestionType, eViewMode, eViewScreenMode } from "@/enums/form";
import { AnimatePresence, motion } from "framer-motion";
import { Laptop, PencilRuler, Play, Smartphone, TrendingUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddItemDialog from "./addItemDialog";
import { useFormBuilder } from "@/store/useFormBuilder";

export default function MainContentHeader() {

    const { viewMode, viewScreenMode, setViewMode, setViewScreenMode } = useFormBuilder()
    return (
        <div className="px-2 flex items-center justify-between py-2 w-full gap-3 border-b bg-background">
            <div className="flex items-center gap-2">
                <AddItemDialog />
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
                            layout
                        >
                            <div>
                                <Tooltip delayDuration={500}>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon">
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
        </div>
    );
}
