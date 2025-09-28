'use client';

import { IQuestion } from "@/types/form";

interface Props {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
}

export default function RenderDetailField({ question, value, onChange }: Props) {
    return (
        <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            Address Field Placeholder
        </div>
    );
}