"use client";

import { eViewMode } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import MainContentHeader from "./mainContentHeader";
import FlowEditor from "./modes/flowEditor";
import FormEditor from "./modes/formEditor";

export default function MainContent() {
    const { viewMode } = useFormBuilder()
    return (
        <div className="flex-1 h-full w-full flex flex-col items-center">
            <MainContentHeader />
            <div className="h-full w-full flex-1 overflow-auto">
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
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'tween' }}
                            key="flow-editor"
                            layout
                            className="w-full h-full"
                        >
                            <FlowEditor />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </div >
    );
}
