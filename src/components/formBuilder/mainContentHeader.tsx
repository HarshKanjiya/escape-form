"use client";

import { eMode, eViewType } from "@/enums/form";
import { Laptop, PencilRuler, Play, Plus, Smartphone, Workflow } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddItemDialog from "./addItemDialog";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    mode: eMode;
    setMode: (mode: eMode) => void;
    viewType: eViewType;
    setViewType: (viewType: eViewType) => void;
}

export default function MainContentHeader({ mode, setMode, viewType, setViewType }: Props) {

    const addItem = (id: string) => {
        console.log('id :>> ', id);
    }

    return (
        <div className="px-2 flex items-center justify-between py-2 w-full gap-3 border-b bg-background">
            <div className="flex items-center gap-2">
                <AddItemDialog onAddItem={addItem} />
                <Separator orientation="vertical" className="!h-8" />
                <div className="flex items-center gap-1">
                    <AnimatePresence mode="sync" initial={false}>
                        {mode === eMode.Form && (
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
                                            <Button variant="ghost" size="icon" onClick={() => setViewType(viewType === eViewType.Desktop ? eViewType.Mobile : eViewType.Desktop)}>
                                                {viewType === eViewType.Desktop ? <Laptop /> : <Smartphone />}
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
                        <Button variant={mode == eMode.Form ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setMode(eMode.Form)}>
                            <PencilRuler />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Form Editor
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <Button variant={mode == eMode.Flow ? 'secondary' : 'ghost'} size={'icon'} onClick={() => setMode(eMode.Flow)}>
                            <Workflow />
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
