'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { QuestionOption } from "@prisma/client";
import { CornerDownRight, Plus, Trash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface IProps {
    question: Question,
    index: number
}

export function ChoiceMultipleField({ question, index }: IProps) {

    const updateQuestion = useFormBuilder((state) => state.updateQuestion);
    const saveQuestionOption = useFormBuilder((state) => state.saveQuestionOption);
    const deleteQuestionOption = useFormBuilder((state) => state.deleteQuestionOption);
    const getQuestionOptions = useFormBuilder((state) => state.getQuestionOptions);

    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [tempQuestion, setTempQuestion] = useState(question.title);
    const [tempDescription, setTempDescription] = useState(question.description || '');

    const questionInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    const [options, setOptions] = useState<QuestionOption[]>([]);
    const [originalOptions, setOriginalOptions] = useState<QuestionOption[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const optionIdsRef = useRef<string[]>([]);
    const idCounterRef = useRef(0);

    // Fetch options when component mounts
    useEffect(() => {
        const fetchOptions = async () => {
            const fetchedOptions = await getQuestionOptions(question.id);
            if (fetchedOptions && fetchedOptions.length > 0) {
                setOptions(fetchedOptions);
                setOriginalOptions(fetchedOptions);
            } else {
                setOptions([]);
                setOriginalOptions([]);
            }
        };

        fetchOptions();
    }, [question.id, getQuestionOptions]);

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
        newOptions[idx] = {
            ...newOptions[idx],
            value: value,
            label: value, // Keep label and value in sync
        };
        setOptions(newOptions);
    };

    const handleOptionBlur = async (idx: number) => {
        const option = options[idx];
        const originalOption = originalOptions[idx];

        if (originalOption && option.value !== originalOption.value) {
            const success = await saveQuestionOption(option);
            if (success) {
                setOriginalOptions(prev => {
                    const newOrig = [...prev];
                    newOrig[idx] = option;
                    return newOrig;
                });
            }
        }
    };

    const handleAddOption = () => {
        setOptions(prev => {
            optionIdsRef.current.push(`${Date.now()}-${idCounterRef.current++}`);

            const timestamp = Date.now();
            const newOption: QuestionOption = {
                id: '', // Will be generated by backend when saved
                questionId: question.id,
                label: '',
                value: `option_${timestamp}`,
                sortOrder: prev.length,
            };

            const updated = [...prev, newOption];

            // Focus the new input
            setTimeout(() => {
                inputRefs.current[updated.length - 1]?.focus();
            }, 100);

            return updated;
        });

        setOriginalOptions(prev => {
            const timestamp = Date.now();
            const newOption: QuestionOption = {
                id: '',
                questionId: question.id,
                label: '',
                value: `option_${timestamp}`,
                sortOrder: prev.length,
            };
            return [...prev, newOption];
        });
    };

    const handleRemoveOption = async (idx: number) => {
        const optionToDelete = options[idx];

        if (options.length === 1) return;

        if (optionToDelete.id) {
            const success = await deleteQuestionOption(optionToDelete.id);
            if (!success) return;
        }

        const newOptions = options.filter((_, i) => i !== idx);
        const newOriginalOptions = originalOptions.filter((_, i) => i !== idx);

        const updatedOptions = newOptions.map((opt, i) => ({
            ...opt,
            sortOrder: i,
        }));

        optionIdsRef.current.splice(idx, 1);
        setOptions(updatedOptions);
        setOriginalOptions(newOriginalOptions);

        for (const opt of updatedOptions) {
            if (opt.id) {
                await saveQuestionOption(opt);
            }
        }

        setTimeout(() => {
            const targetIndex = Math.min(idx, updatedOptions.length - 1);
            inputRefs.current[targetIndex]?.focus();
        }, 0);
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
                            className="py-6! px-4! text-xl! border-none"
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
                            className="text-muted-foreground border-dashed resize-none px-4! py-3! text-lg!"
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

                <ScrollArea className="h-80 relative">
                    <div className="h-3 w-full z-3 absolute bg-linear-180 from-background to-transparent top-0" />
                    <div className="h-3 w-full z-3 absolute bg-linear-0 from-background to-transparent bottom-0" />
                    <motion.div layout className="space-y-3 py-4">
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
                                    <div className="relative flex-1 max-w-[250px]">
                                        <Input
                                            className="flex-1"
                                            placeholder={`Option ${i + 1}`}
                                            value={option.label}
                                            ref={el => { inputRefs.current[i] = el; }}
                                            onChange={e => handleOptionChange(i, e.target.value)}
                                            onBlur={() => handleOptionBlur(i)}
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
                                            <CornerDownRight size={16} className="-skew-x-16" />
                                            Enter to add New
                                        </pre>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </ScrollArea>
                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddOption}
                        className="mt-2"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Option
                    </Button>
                </motion.div>
            </div>
        </div >
    );
}
