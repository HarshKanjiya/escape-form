"use client";

import { Question, ViewMode, WorkflowConnection, WorkflowDirection } from "@/types/form";


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
    return (
        <div className="flex-1 h-full w-full overflow-y-auto relative">
            {/* SVG background behind all content */}
            <div className='fixed inset-0 pointer-events-none z-0 border rounded-2xl custom-bg opacity-20 h-full'>
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
    );
}
