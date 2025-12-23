"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { GripVerticalIcon, TrashIcon } from "lucide-react";
import QuestionIcon from "./questionIcon";

export default function LeftBarQuestionItem({ isExpanded, question }: { isExpanded: boolean, question: Question }) {

    const selectedQuestionId = useFormBuilder((state) => state.selectedQuestionId);
    const setSelectedQuestionId = useFormBuilder((state) => state.setSelectedQuestionId);
    const deleteQuestion = useFormBuilder((state) => state.deleteQuestion);

    return (
        <div className="w-full flex-1">
            {
                isExpanded ?
                    <li
                        className={cn('flex gap-2 items-center rounded-2xl corner-squircle py-1.5 px-2 justify-center select-none bg-background shadow-none transition-all duration-200 group border-2 border-accent',
                            selectedQuestionId == question.id ? 'border-primary-300 dark:bg-primary/20' : '')}
                        onClick={() => setSelectedQuestionId(question.id)}
                    >
                        <div className="flex gap-2 items-center flex-1">
                            <div className={cn('p-2 rounded-2xl corner-squircle cursor-grab group h-8 w-8', selectedQuestionId == question.id ? 'bg-primary/70 text-white' : 'bg-primary/20')}>
                                <span className="visible group-hover:hidden">
                                    <QuestionIcon questionType={question.type} />
                                </span>
                                <GripVerticalIcon size={16} className="hidden group-hover:block" />
                            </div>
                            <div className={cn('text-ellipsis line-clamp-1 flex-1 overflow-hidden')}>
                                {question.title}
                            </div>
                        </div>
                        {
                            isExpanded && (
                                <Button
                                    variant={'destructive'}
                                    size={'icon'}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={() => deleteQuestion(question.id)}
                                >
                                    <TrashIcon className="h-4! w-4!" />
                                </Button>
                            )
                        }
                    </li>
                    :
                    <Tooltip >
                        <TooltipTrigger>
                            <li
                                className={cn('flex gap-2 items-center py-1.5 px-1.5 justify-center select-none bg-white shadow-none dark:bg-accent transition-all duration-200 group border-2 border-accent rounded-md',
                                    selectedQuestionId == question.id ? 'border-primary-300 dark:bg-primary/20' : '')}
                                onClick={() => setSelectedQuestionId(question.id)}
                            >
                                <div className="flex gap-2 items-center flex-1">
                                    <div className={cn('p-2 rounded-sm', selectedQuestionId == question.id ? 'bg-primary/70 text-white' : 'bg-primary/20')}>
                                        <QuestionIcon questionType={question.type} />
                                    </div>
                                </div>
                                {
                                    isExpanded && (
                                        <Button
                                            variant={'destructive'}
                                            size={'icon'}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            onClick={() => deleteQuestion(question.id)}
                                        >
                                            <TrashIcon className="h-4! w-4!" />
                                        </Button>
                                    )
                                }
                            </li>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            {!isExpanded ? question.title : ''}
                        </TooltipContent>
                    </Tooltip>
            }
        </div>
    );
}
