"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";


interface IProps {
    question: Question,
    index: number
}

export function AddressField({ question, index }: IProps) {

    const { updateQuestion } = useFormBuilder();
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [tempQuestion, setTempQuestion] = useState(question.title);
    const [tempDescription, setTempDescription] = useState(question.description || '');

    const questionInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus when entering edit mode
    useEffect(() => {
        if (isEditingQuestion && questionInputRef.current) {
            questionInputRef.current.focus();
            questionInputRef.current.select();
        }
    }, [isEditingQuestion]);

    useEffect(() => {
        if (isEditingDescription && descriptionInputRef.current) {
            descriptionInputRef.current.focus();
            descriptionInputRef.current.select();
        }
    }, [isEditingDescription]);

    const handleQuestionSave = () => {
        if (tempQuestion.trim() !== question.title) {
            updateQuestion(question.id, { title: tempQuestion.trim() });
        }
        setIsEditingQuestion(false);
    };

    const handleDescriptionSave = () => {
        if (tempDescription !== (question.description || '')) {
            updateQuestion(question.id, { description: tempDescription });
        }
        setIsEditingDescription(false);
    };

    const handleQuestionCancel = () => {
        setTempQuestion(question.title);
        setIsEditingQuestion(false);
    };

    const handleDescriptionCancel = () => {
        setTempDescription(question.description || '');
        setIsEditingDescription(false);
    };

    return (
        <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
            <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
                <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
            </div>
            <div className="space-y-4 w-full flex-1 overflow-y-auto max-h-[500px] pr-4 p-3 custom-scrollbar">
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
                                !question.title && "text-muted-foreground"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <span>{question.title || "Click to add question..."}</span>
                                <AnimatePresence mode="wait">
                                    {question.required && (
                                        <motion.span
                                            key="required-star-address  "
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
                <div>
                    {isEditingDescription ? (
                        <Textarea
                            ref={descriptionInputRef}
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                            onBlur={handleDescriptionSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleDescriptionSave();
                                } else if (e.key === 'Escape') {
                                    handleDescriptionCancel();
                                }
                            }}
                            className="text-muted-foreground border-dashed resize-none !px-4 !py-3 !text-lg"
                            placeholder="Add description (optional)..."
                            rows={3}
                        />
                    ) : (
                        <div
                            onClick={() => setIsEditingDescription(true)}
                            className={cn(
                                "text-base text-muted-foreground cursor-text py-1 rounded-md transition-colors relative",
                                !question.description && "italic opacity-70"
                            )}
                        >
                            {question.description || "Description (optional)"}
                        </div>
                    )}
                </div>
                {/* Removed outer AnimatePresence: static siblings don't need it and it caused duplicate key warnings */}
                <div>
                    <p className="text-lg px-1 space-x-2"><span>Address</span>
                        <AnimatePresence mode="wait">
                            {question.metadata?.address && (
                                <motion.span
                                    key={`add-address-required-star ${question.id}`}
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
                    </p>
                    <p className="text-primary-700 italic font-extralight opacity-70 border-b border-primary-700 py-3 px-1 text-lg">Enter your Address</p>
                </div>
                <div>
                    <p className="text-lg px-1 space-x-2"><span>Address 2</span>
                        <AnimatePresence mode="wait">
                            {question.metadata?.address2 && (
                                <motion.span
                                    key={`add-address2-required-star ${question.id}`}
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
                    </p>
                    <p className="text-primary-700 italic font-extralight opacity-70 border-b border-primary-700 py-3 px-1 text-lg">Enter your Address 2</p>
                </div>
                <div>
                    <p className="text-lg px-1 space-x-2"><span>City</span>
                        <AnimatePresence mode="wait">
                            {question.metadata?.city && (
                                <motion.span
                                    key={`add-city-required-star ${question.id}`}
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
                    </p>
                    <p className="text-primary-700 italic font-extralight opacity-70 border-b border-primary-700 py-3 px-1 text-lg">Enter your City</p>
                </div>
                <div>
                    <p className="text-lg px-1 space-x-2"><span>State</span>
                        <AnimatePresence mode="wait">
                            {question.metadata?.state && (
                                <motion.span
                                    key={`add-state-required-star ${question.id}`}
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
                    </p>
                    <p className="text-primary-700 italic font-extralight opacity-70 border-b border-primary-700 py-3 px-1 text-lg">Enter your State</p>
                </div>
                <div>
                    <p className="text-lg px-1 space-x-2"><span>Country</span>
                        <AnimatePresence mode="wait">
                            {question.metadata?.country && (
                                <motion.span
                                    key={`add-country-required-star ${question.id}`}
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
                    </p>
                    <p className="text-primary-700 italic font-extralight opacity-70 border-b border-primary-700 py-3 px-1 text-lg">Enter your Country</p>
                </div>
                <div>
                    <p className="text-lg px-1 space-x-2"><span>Zip</span>
                        <AnimatePresence mode="wait">
                            {question.metadata?.zip && (
                                <motion.span
                                    key={`add-zip-required-star ${question.id}`}
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
                    </p>
                    <p className="text-primary-700 italic font-extralight opacity-70 border-b border-primary-700 py-3 px-1 text-lg">Enter your Zip</p>
                </div>
            </div>
        </div>
    );
}
