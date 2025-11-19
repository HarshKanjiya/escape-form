'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuestionOption } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownRight, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";


interface IProps {
    question: Question,
    index: number
}

export function RadioField({ question, index }: IProps) {

    const { updateQuestion } = useFormBuilder();
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [tempQuestion, setTempQuestion] = useState(question.title);
    const [tempDescription, setTempDescription] = useState(question.description || '');

    const questionInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    // Option state and handlers - moved to top level
    const [options, setOptions] = useState<QuestionOption[]>(question.options && question.options.length > 0 ? question.options : []);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    // Stable IDs for smooth Framer Motion enter/exit and layout animations
    const optionIdsRef = useRef<string[]>([]);
    const idCounterRef = useRef(0);

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

    // Options useEffect hooks
    useEffect(() => {
        setOptions(question.options && question.options.length > 0 ? question.options : []);
    }, [question.options]);

    // Ensure IDs array length matches options and keep IDs stable per index
    useEffect(() => {
        const ids = optionIdsRef.current;
        if (ids.length < options.length) {
            for (let j = ids.length; j < options.length; j++) {
                ids.push(`${Date.now()}-${idCounterRef.current++}`);
            }
        } else if (ids.length > options.length) {
            optionIdsRef.current = ids.slice(0, options.length);
        }
    }, [options.length]);

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

    // Option handlers
    const handleOptionChange = (idx: number, value: string) => {
        const newOptions = [...options];
        newOptions[idx].value = value;
        setOptions(newOptions);
    };

    const handleOptionBlur = () => {
        updateQuestion(question.id, { options });
    };

    const handleAddOption = () => {
        // setOptions(prev => {
        //     // Create a stable id for the new option before render
        //     optionIdsRef.current.push(`${Date.now()}-${idCounterRef.current++}`);
        //     const updated = [...prev, ""];
        //     setTimeout(() => {
        //         inputRefs.current[updated.length - 1]?.focus();
        //     }, 0);
        //     return updated;
        // });
    };

    const handleRemoveOption = (idx: number) => {
        // const newOptions = options.filter((_, i) => i !== idx);
        // const ensured = newOptions.length > 0 ? newOptions : [""];
        // // Remove corresponding ID to keep others stable
        // optionIdsRef.current.splice(idx, 1);
        // // If we ensured an empty placeholder (i.e., list became empty), also add a new id
        // if (ensured.length > newOptions.length) {
        //     optionIdsRef.current.push(`${Date.now()}-${idCounterRef.current++}`);
        // }
        // setOptions(ensured);
        // updateQuestion(question.id, { options: ensured });
        // // Manage focus to a sensible input after deletion
        // setTimeout(() => {
        //     const targetIndex = Math.min(idx, ensured.length - 1);
        //     inputRefs.current[targetIndex]?.focus();
        // }, 0);
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
                                !question.title && "text-muted-foreground"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <span>{question.title || "Click to add question..."}</span>
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

                {/* <RadioGroup
                    required={question.required}
                    className="space-y-3"
                >
                    {question.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                            <Label
                                htmlFor={`${question.id}-${index}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                            >
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup> */}

                {/* {(!question.options || question.options.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">No options available</p>
                )} */}
                {/* Options rendering */}
                <motion.div layout className="space-y-3">
                    <AnimatePresence initial={false}>
                        {options.map((option, i) => (
                            <motion.div
                                key={optionIdsRef.current[i] ?? `opt-${i}`}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.18, ease: "easeOut", layout: { duration: 0.25 } }}
                                className="flex items-center gap-3"
                            >
                                <div className="size-5 border border-border rounded-full bg-background" />
                                <div className="relative flex-1 max-w-[250px]">
                                    <Input
                                        className="flex-1"
                                        placeholder={`Option ${i + 1}`}
                                        value={option.value}
                                        ref={el => { inputRefs.current[i] = el; }}
                                        onChange={e => handleOptionChange(i, e.target.value)}
                                        onBlur={handleOptionBlur}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                if (i === options.length - 1) {
                                                    handleAddOption();
                                                } else {
                                                    // Focus next input
                                                    inputRefs.current[i + 1]?.focus();
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                {/* <Button variant={'secondary'} size={'icon'}>
                                    <GripVertical className="cursor-move text-muted-foreground" size={18} />
                                </Button> */}
                                <Button disabled={options.length == 1} variant={'destructive'} size={'icon'} onClick={() => handleRemoveOption(i)} aria-label={`Delete option ${i + 1}`}>
                                    <Trash size={18} />
                                </Button>
                                {i === options.length - 1 && (
                                    <pre className="text-sm text-muted-foreground italic flex items-center gap-3 ml-2">
                                        <CornerDownRight size={16} className="-skew-x-[16deg]" />
                                        Enter to add New
                                    </pre>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div >
    );
}
