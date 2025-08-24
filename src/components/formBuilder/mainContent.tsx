"use client";

import { Question, ViewMode, WorkflowConnection, WorkflowDirection } from "@/types/form";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Laptop, Phone, Play, Plus, Smartphone } from "lucide-react";
import { useState } from "react";


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

enum eViewType {
    Desktop = 'desktop',
    Mobile = 'mobile',
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

    return (
        <>
            <div className="flex-1 h-full w-full overflow-y-auto relative">
                <div className="absolute w-full h-full z-[9]">
                    <div className="flex flex-col items-center w-full flex-1 h-full">
                        <div className="px-2 flex items-center py-2 w-full gap-3 border-b bg-background">
                            <Button variant={'secondary'} size={'sm'}>
                                <Plus className="mr-2" />
                                Add Item
                            </Button>
                            <Separator orientation="vertical" className="h-6 bg-border" />
                            <Button variant={'ghost'} size={'icon'} onClick={() => setViewType(viewType === eViewType.Desktop ? eViewType.Mobile : eViewType.Desktop)}>
                                {
                                    viewType === eViewType.Desktop ? <Laptop /> : <Smartphone />
                                }
                            </Button>
                            <Button variant={'ghost'}>
                                <Play />
                            </Button>
                        </div>
                        <hr className="border-muted-foreground" />
                    </div>
                </div>

                <div className="absolute inset-0 pointer-events-none border rounded-2xl opacity-20 custom-bg h-full z-auto">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 1440 900"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern id="lines135" patternUnits="userSpaceOnUse" width="34" height="34" patternTransform="rotate(135)">
                                <rect x="0" y="30" width="64" height="1" fill="#e5e7eb" opacity="0.05" />
                            </pattern>
                        </defs>
                        <rect x="0" y="0" width="1440" height="900" fill="url(#lines135)" />
                    </svg>
                </div>
            </div>
        </>
    );
}
