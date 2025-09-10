import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { IQuestion } from "@/types/form";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownRight, GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";


interface IProps {
    question: IQuestion,
    index: number
}

export function RadioField({ question, index }: IProps) {

    const { updateQuestion } = useFormBuilder();
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [tempQuestion, setTempQuestion] = useState(question.question);
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

    const handleQuestionCancel = () => {
        setTempQuestion(question.question);
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
                {/* Option state and handlers */}
                {(() => {
                    const [options, setOptions] = useState<string[]>(question.options && question.options.length > 0 ? question.options : [""]);
                    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
                    useEffect(() => {
                        setOptions(question.options && question.options.length > 0 ? question.options : [""]);
                    }, [question.options]);

                    const { updateQuestion } = useFormBuilder();
                    const handleOptionChange = (idx: number, value: string) => {
                        const newOptions = [...options];
                        newOptions[idx] = value;
                        setOptions(newOptions);
                    };
                    const handleOptionBlur = () => {
                        updateQuestion(question.id, { options });
                    };
                    const handleAddOption = () => {
                        setOptions(prev => {
                            const updated = [...prev, ""];
                            setTimeout(() => {
                                inputRefs.current[updated.length - 1]?.focus();
                            }, 0);
                            return updated;
                        });
                    };
                    return options.map((option, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="size-5 border border-border rounded-full bg-background" />
                            <Input
                                className="flex-1 max-w-[250px]"
                                placeholder={`Option ${i + 1}`}
                                value={option}
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
                            <div className="h-9 aspect-square bg-accent flex items-center justify-center rounded">
                                <GripVertical className="cursor-move text-muted-foreground" size={18} />
                            </div>
                            {i === options.length - 1 && (
                                <pre className="text-sm text-muted-foreground italic flex items-center gap-3 ml-2">
                                    <CornerDownRight size={16} />
                                    Enter to add New
                                </pre>
                            )}
                        </div>
                    ));
                })()}
            </div>
        </div>
    );
}
