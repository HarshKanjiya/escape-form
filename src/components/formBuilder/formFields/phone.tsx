"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { IQuestion } from "@/types/form";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";


interface IProps {
    question: IQuestion,
    index: number
}

export function PhoneField({ question, index }: IProps) {

    const { updateQuestion } = useFormBuilder();
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingPlaceholder, setIsEditingPlaceholder] = useState(false);
    const [tempQuestion, setTempQuestion] = useState(question.question);
    const [tempDescription, setTempDescription] = useState(question.description || '');
    const [tempPlaceholder, setTempPlaceholder] = useState(question.placeholder || '');

    const questionInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    const placeholderInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (isEditingPlaceholder && placeholderInputRef.current) {
            placeholderInputRef.current.focus();
            placeholderInputRef.current.select();
        }
    }, [isEditingPlaceholder]);

    const handleQuestionSave = () => {
        if (tempQuestion.trim() !== question.question) {
            updateQuestion(question.id, { question: tempQuestion.trim() });
        }
        setIsEditingQuestion(false);
    };

    const handleDescriptionSave = () => {
        if (tempDescription !== (question.description || '')) {
            updateQuestion(question.id, { description: tempDescription });
        }
        setIsEditingDescription(false);
    };

    const handlePlaceholderSave = () => {
        if (tempPlaceholder !== (question.placeholder || '')) {
            updateQuestion(question.id, { placeholder: tempPlaceholder });
        }
        setIsEditingPlaceholder(false);
    };

    const handleQuestionCancel = () => {
        setTempQuestion(question.question);
        setIsEditingQuestion(false);
    };

    const handleDescriptionCancel = () => {
        setTempDescription(question.description || '');
        setIsEditingDescription(false);
    };

    const handlePlaceholderCancel = () => {
        setTempPlaceholder(question.placeholder || '');
        setIsEditingPlaceholder(false);
    };

    // const formatPhoneNumber = (value: string) => {
    //     // Remove all non-digits
    //     const digits = value.replace(/\D/g, '');

    //     // Format as (XXX) XXX-XXXX for US phone numbers
    //     if (digits.length >= 10) {
    //         return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    //     } else if (digits.length >= 6) {
    //         return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    //     } else if (digits.length >= 3) {
    //         return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    //     }
    //     return digits;
    // };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const formatted = formatPhoneNumber(e.target.value);
    //     onChange?.(formatted);
    // };

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
                <div className="flex items-start gap-2">
                    <div className="p-3 text-primary-800/40 italic text-xl border-b border-primary-800/40">
                        + 91
                    </div>
                    <div className="space-y-2 flex-1">
                        {isEditingPlaceholder ? (
                            <Input
                                ref={placeholderInputRef}
                                value={tempPlaceholder}
                                onChange={(e) => setTempPlaceholder(e.target.value)}
                                onBlur={handlePlaceholderSave}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handlePlaceholderSave();
                                    } else if (e.key === 'Escape') {
                                        handlePlaceholderCancel();
                                    }
                                }}
                                className="border-dashed px-4 !py-5 !text-xl"
                                placeholder="Your Answer goes here ..."
                            />
                        ) : (
                            <>
                                <div className="w-full p-3 text-primary-800/40 italic text-xl border-b border-primary-800/40 relative">
                                    {question.placeholder || "name@example.com"}
                                </div>
                                <p
                                    onClick={() => setIsEditingPlaceholder(true)}
                                    className="text-lg italic font-extralight text-muted-foreground/60 cursor-text hover:text-muted-foreground transition-colors px-1"
                                >
                                    Click to edit placeholder
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        // <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
        //     <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
        //         <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
        //     </div>
        //     <div className="space-y-4 w-full flex-1">
        //         {/* <Label htmlFor={question.id} className="text-sm font-medium">
        //         {question.question}
        //         {question.required && <span className="text-red-500 ml-1">*</span>}
        //     </Label>
        //     {question.description && (
        //         <p className="text-sm text-muted-foreground">{question.description}</p>
        //     )}
        //     <div className="relative">
        //         <Input
        //             id={question.id}
        //             type="tel"
        //             placeholder={question.placeholder || "(123) 456-7890"}
        //             value={value}
        //             onChange={handleChange}
        //             disabled={disabled}
        //             required={question.required}
        //             className="w-full pl-10"
        //             maxLength={14} // Length of formatted phone number
        //         />
        //         <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        //     </div>
        //     <p className="text-xs text-muted-foreground">
        //         Phone number will be automatically formatted
        //     </p> */}
        //     </div>
        // </div>
    );
}
