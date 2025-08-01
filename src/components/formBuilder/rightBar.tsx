"use client";

import { Question } from "@/types/form";


interface RightPanelProps {
    selectedQuestion: Question | null | undefined;
    onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
    onPublish: () => void;
    onPreview: () => void;
}

export default function RightBar({ selectedQuestion, onUpdateQuestion, onPublish, onPreview }: RightPanelProps) {
    return (
        <div className="fixed top-16 right-0 bg-background border-l z-30 overflow-visible">
            right bar
        </div>
    );
}
