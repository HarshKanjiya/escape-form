"use client";

import { eMode, eViewType } from "@/enums/form";
import { Question, ViewMode, WorkflowConnection, WorkflowDirection } from "@/types/form";
import { useState } from "react";
import MainContentHeader from "./mainContentHeader";
import { Separator } from "../ui/separator";
import FormEditor from "./modes/formEditor";
import FlowEditor from "./modes/flowEditor";
import { AnimatePresence, motion } from "framer-motion";


interface MainContentProps {
    viewMode: ViewMode;
    questions: Question[];
    selectedQuestionId: string | null;
    workflowDirection: WorkflowDirection;
    connections: WorkflowConnection[];
    onViewModeChange: (mode: ViewMode) => void;
    onSelectQuestion: (id: string | null) => void;
    onAddQuestion: (type: Question['type']) => void;
    onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
    onDeleteQuestion: (id: string) => void;
    onMoveQuestion: (id: string, position: { x: number; y: number }) => void;
    onWorkflowDirectionChange: (direction: WorkflowDirection) => void;
    onAddConnection: (connection: Omit<WorkflowConnection, 'id'>) => void;
    onRemoveConnection: (id: string) => void;
}

export default function MainContent({
    viewMode,
    questions,
    selectedQuestionId,
    workflowDirection,
    connections,
    onViewModeChange,
    onSelectQuestion,
    onAddQuestion,
    onUpdateQuestion,
    onDeleteQuestion,
    onMoveQuestion,
    onWorkflowDirectionChange,
    onAddConnection,
    onRemoveConnection,
}: MainContentProps) {

    const [viewType, setViewType] = useState<eViewType>(eViewType.Desktop)
    const [mode, setMode] = useState<eMode>(eMode.Form)

    return (
        <>
            <div className="flex-1 h-full w-full flex flex-col items-center">
                <MainContentHeader mode={mode} setMode={setMode} viewType={viewType} setViewType={setViewType} />

                <AnimatePresence initial={false} mode="wait">
                    {mode === eMode.Form ? (
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
        </>
    );
}
