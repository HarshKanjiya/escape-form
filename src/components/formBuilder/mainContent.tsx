"use client";

import { eViewMode } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "motion/react";
import MainContentHeader from "./mainContentHeader";
import FlowEditor from "./modes/flowEditor";
import FormEditor from "./modes/formEditor";
import FormPreview from "./modes/formPreview";
import { ReactFlowProvider } from "@xyflow/react";

export default function MainContent() {
    const { viewMode } = useFormBuilder()
    return (
        <div className="flex-1 h-full w-full flex flex-col items-center">
            <MainContentHeader />
            <div className="h-full w-full flex-1 overflow-hidden">
                <div className="bg-accent-bg p-3 h-full w-full overflow-hidden">
                    <div className="bg-background rounded-xl h-full w-full overflow-hidden">
                        <AnimatePresence initial={false} mode="wait">
                            {viewMode === eViewMode.Builder ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'tween' }}
                                    key="form-editor"
                                    layout
                                    className="w-full h-full"
                                >
                                    <FormEditor />
                                </motion.div>
                            ) : null}
                            {viewMode === eViewMode.Workflow ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'tween' }}
                                    key="flow-editor"
                                    layout
                                    className="w-full h-full"
                                >
                                    <ReactFlowProvider>
                                        <FlowEditor />
                                    </ReactFlowProvider>
                                </motion.div>
                            ) : null}
                            {viewMode === eViewMode.Preview ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'tween' }}
                                    key="form-editor"
                                    layout
                                    className="w-full h-full"
                                >
                                    <FormPreview />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div >
                </div >
            </div >
        </div >
    );
}
