"use client";

import { eViewMode, eViewScreenType, eWorkflowDirection } from "@/enums/form";
import { IQuestion, IWorkflowConnection } from "@/types/form";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import MainContentHeader from "./mainContentHeader";
import FlowEditor from "./modes/flowEditor";
import FormEditor from "./modes/formEditor";


interface MainContentProps {
    viewMode: eViewMode;
    questions: IQuestion[];
    selectedQuestionId: string | null;
    selectedQuestion: IQuestion | null;
    connections: IWorkflowConnection[];
    onViewModeChange: (mode: eViewMode) => void;
    onSelectQuestion: (id: string | null) => void;
    onAddQuestion: (type: IQuestion['type']) => void;
    onUpdateQuestion: (id: string, updates: Partial<IQuestion>) => void;
    onDeleteQuestion: (id: string) => void;
    onMoveQuestion: (id: string, position: { x: number; y: number }) => void;
    onAddConnection: (connection: Omit<IWorkflowConnection, 'id'>) => void;
    onRemoveConnection: (id: string) => void;
}

export default function MainContent({
    viewMode,
    questions,
    selectedQuestionId,
    selectedQuestion,
    connections,
    onViewModeChange,
    onSelectQuestion,
    onAddQuestion,
    onUpdateQuestion,
    onDeleteQuestion,
    onMoveQuestion,
    onAddConnection,
    onRemoveConnection,
}: MainContentProps) {

    const [viewType, setViewType] = useState<eViewScreenType>(eViewScreenType.Desktop)

    return (
        <>
            <div className="flex-1 h-full w-full flex flex-col items-center">
                <MainContentHeader onAddQuestion={onAddQuestion} mode={viewMode} setMode={onViewModeChange} viewType={viewType} setViewType={setViewType} />
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
                                <FormEditor onAddQuestion={onAddQuestion} selectedQuestion={selectedQuestion} onActiveSlideChange={onSelectQuestion} questions={questions} />
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
        </>
    );
}
