"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { IQuestion } from "@/types/form";
import { TrashIcon } from "lucide-react";
import QuestionIcon from "./questionIcon";

export default function LeftBarQuestionItem({ question }: { question: IQuestion }) {
    const { selectedQuestionId, setSelectedQuestionId, deleteQuestion } = useFormBuilder();
    return (
        <li
            className={cn('flex gap-2 items-center py-2 px-2 select-none cursor-grab bg-white shadow-md dark:bg-accent transition-all duration-200 rounded-sm group',
                selectedQuestionId == question.id ? 'bg-primary/10 dark:bg-primary/30' : '')}
            onClick={() => setSelectedQuestionId(question.id)}
        >
            <div className="flex gap-2 items-center flex-1">
                <div className={cn('p-2 rounded-sm', selectedQuestionId == question.id ? 'bg-primary/70 text-white' : 'bg-primary/20')}>
                    <QuestionIcon questionType={question.type} />
                </div>
                <div className='text-ellipsis line-clamp-1 overflow-hidden'>
                    {question.question}
                </div>
            </div>
            <Button
                variant={'destructive'}
                size={'icon'}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => deleteQuestion(question.id)}
            >
                <TrashIcon className="!h-4 !w-4" />
            </Button>
        </li>
    );
}
