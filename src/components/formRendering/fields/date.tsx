'use client';

import { IQuestion } from "@/types/form";

interface Props {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
}

export default function RenderDateField({ }: Props) {
    return (
        <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            Date Field Placeholder
        </div>
    );
}