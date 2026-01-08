"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { GripVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import QuestionIcon from "./questionIcon";
import { Reorder, useDragControls, AnimatePresence, motion } from "framer-motion"


export default function LeftBarQuestionItem({ isExpanded, question }: { isExpanded: boolean, question: Question }) {

    const selectedQuestionId = useFormBuilder((state) => state.selectedQuestionId);
    const setSelectedQuestionId = useFormBuilder((state) => state.setSelectedQuestionId);
    const deleteQuestion = useFormBuilder((state) => state.deleteQuestion);
    const [isHovered, setIsHovered] = useState(false);
    const controls = useDragControls()


    return (
        <Reorder.Item
            className="w-full flex-1 relative"
            value={question}
            dragControls={controls}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.2 }
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileDrag={{
                scale: 1.03,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                zIndex: 50,
                cursor: "grabbing"
            }}
            layout
            transition={{
                layout: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }
            }}
        >
            {
                isExpanded ?
                    <div
                        className={cn('flex gap-2 items-center rounded-2xl corner-squircle py-2 px-2 pl-3 justify-center select-none bg-background shadow-none transition-all duration-200 group border-2 border-accent',
                            selectedQuestionId == question.id ? 'border-primary-100 dark:bg-primary-50' : '')}
                        onClick={() => setSelectedQuestionId(question.id)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="flex gap-2 items-center flex-1">
                            <div
                                className={cn('p-1.5 rounded-xl corner-squircle cursor-grab active:cursor-grabbing relative flex items-center justify-center ring ring-primary/50 ', selectedQuestionId == question.id ? 'bg-primary/70 text-white' : 'bg-primary/20')}
                                onPointerDown={(e) => controls.start(e)}
                            >
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {!isHovered ? (
                                        <motion.span
                                            key="question-icon"
                                            initial={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                            animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                                            exit={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <QuestionIcon questionType={question.type} />
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="grip-icon"
                                            initial={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                            animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                                            exit={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <GripVerticalIcon size={16} />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
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
                    </div>
                    :
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                    'flex gap-2 items-center py-2 px-2 justify-center select-none bg-background shadow-sm transition-all duration-200 group border-2 rounded-lg cursor-pointer hover:shadow-md',
                                    selectedQuestionId == question.id
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                        : 'border-accent hover:border-primary/30'
                                )}
                                onClick={() => setSelectedQuestionId(question.id)}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <div className="flex gap-2 items-center justify-center w-full">
                                    <div className={cn(
                                        'p-2 rounded-lg transition-all duration-200 cursor-grab',
                                        selectedQuestionId == question.id
                                            ? 'bg-primary/70 text-white ring-2 ring-primary/30'
                                            : 'bg-primary/20 hover:bg-primary/30'
                                    )}
                                        onPointerDown={(e) => controls.start(e)}
                                    >
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            {!isHovered ? (
                                                <motion.span
                                                    key="question-icon-collapsed"
                                                    initial={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                                    animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                                                    exit={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <QuestionIcon questionType={question.type} />
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="grip-icon-collapsed"
                                                    initial={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                                    animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                                                    exit={{ scale: 0.95, filter: 'blur(1px)', opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <GripVerticalIcon size={16} />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">{question.title}</span>
                                <span className="text-xs text-muted-foreground capitalize">{question.type.replace('_', ' ')}</span>
                            </div>
                        </TooltipContent>
                    </Tooltip>
            }
        </Reorder.Item>
    );
}
