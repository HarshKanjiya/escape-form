"use client";

import RenderMultiStepForm from "@/components/formRendering/multiStepForm";
import RenderSinglePageForm from "@/components/formRendering/singlePageForm";
import { eFormPageType, eViewScreenMode } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import { motion, AnimatePresence } from "framer-motion";
import { BatteryFull } from "lucide-react";

// Animation variants
const desktopVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 }
}

const mobileVariants = {
    initial: { opacity: 0, scale: 0.8, rotateY: -15, y: 30 },
    animate: { opacity: 1, scale: 1, rotateY: 0, y: 0 },
    exit: { opacity: 0, scale: 0.8, rotateY: 15, y: -30 }
}

export default function FormPreview() {
    const { questions, viewScreenMode, formPageType } = useFormBuilder()


    return (
        <div className="h-full flex items-center justify-center mx-auto w-full">
            <AnimatePresence mode="wait">
                {viewScreenMode === eViewScreenMode.Desktop ? (
                    <motion.div
                        key="desktop"
                        variants={desktopVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            duration: 0.2,
                            ease: "easeOut"
                        }}
                        className="w-full px-3 py-2"
                    >
                        {
                            formPageType === eFormPageType.SinglePage ?
                                <RenderSinglePageForm questions={questions} /> :
                                <RenderMultiStepForm questions={questions || []} />
                        }
                    </motion.div>
                ) : (
                    <motion.div
                        key="mobile"
                        variants={mobileVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            duration: 0.2,
                            ease: "easeOut"
                        }}
                        className="relative flex items-center justify-center w-full"
                        style={{ perspective: 1000 }}
                    >
                        <div className="relative bg-accent rounded-3xl px-2 pt-2 pb-2 flex items-center justify-center">
                            <div className="rounded-2xl overflow-hidden w-[375px] h-[667px] relative">
                                <div className="bg-accent flex items-center justify-between px-6 py-1 text-xs font-medium text-foreground">
                                    <span>9:41</span>
                                    <div className="flex items-center space-x-1">
                                        <BatteryFull className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="h-[641px] overflow-auto bg-accent-bg rounded">
                                    {
                                        formPageType === eFormPageType.SinglePage ?
                                            <RenderSinglePageForm questions={questions} /> :
                                            <RenderMultiStepForm questions={questions || []} />
                                    }
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-foreground rounded-full opacity-30"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}