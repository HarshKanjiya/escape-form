"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { IQuestion } from "@/types/form";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IProps {
    question: IQuestion,
    index: number
}

export function DetailField({ question, index }: IProps) {
    const { updateQuestion } = useFormBuilder();
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [tempQuestion, setTempQuestion] = useState(question.question);

    const questionInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus when entering edit mode
    useEffect(() => {
        if (isEditingQuestion && questionInputRef.current) {
            questionInputRef.current.focus();
            questionInputRef.current.select();
        }
    }, [isEditingQuestion]);

    const handleQuestionSave = () => {
        if (tempQuestion.trim() !== question.question) {
            updateQuestion(question.id, { question: tempQuestion.trim() });
        }
        setIsEditingQuestion(false);
    };

    const handleQuestionCancel = () => {
        setTempQuestion(question.question);
        setIsEditingQuestion(false);
    };

    return (
        <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
            <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
                <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
            </div>
            <div className="space-y-4 w-full flex-1">
                <div className="space-y-2">
                    {isEditingQuestion ? (
                        <Input
                            ref={questionInputRef}
                            value={tempQuestion}
                            onChange={(e) => setTempQuestion(e.target.value)}
                            onBlur={handleQuestionSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleQuestionSave();
                                } else if (e.key === 'Escape') {
                                    handleQuestionCancel();
                                }
                            }}
                            className="!py-6 !px-4 !text-xl border-none"
                            placeholder="Enter your question..."
                        />
                    ) : (
                        <div
                            onClick={() => setIsEditingQuestion(true)}
                            className={cn(
                                "text-2xl font-medium cursor-text py-2 rounded-md transition-colors",
                                !question.question && "text-muted-foreground"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <span>{question.question || "Click to add question..."}</span>
                                <AnimatePresence mode="wait">
                                    {question.required && (
                                        <motion.span
                                            key="required-star"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="text-destructive"
                                        >
                                            *
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        </div>
                    )}
                </div>

                {
                    question.validation?.userConsentRequired && (
                        <div className="space-x-2">
                            <Checkbox disabled />
                            <span className="text-sm text-muted-foreground">{question.validation?.userConsentText || 'User consent text'}</span>
                        </div>
                    )
                }

                <Button size={'lg'} disabled={!question.validation?.userConsentRequired} >
                    {question.validation?.detailBtnText}
                </Button>
            </div>
        </div>
    );
}