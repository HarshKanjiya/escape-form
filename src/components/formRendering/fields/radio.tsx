'use client';

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { IQuestion } from "@/types/form";
import { useState, useEffect } from "react";

interface Props {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
}

export default function RenderRadioField({ question, value, onChange }: Props) {

    const [answer, setAnswer] = useState(value || "");
    const [errors, setErrors] = useState<string[]>([]);

    const handleValueChange = (newValue: string) => {
        setAnswer(newValue);
        onChange?.(newValue);
    };


    return (
        <div className="w-full space-y-4 p-4">
            <div className="space-y-2">
                <Label
                    htmlFor={question.id}
                    className={cn(
                        "text-lg font-semibold text-foreground leading-relaxed block",
                        question.required && "after:content-['*'] after:text-destructive after:ml-1"
                    )}
                >
                    {question.question}
                </Label>

                {question.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {question.description}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                {question?.options && question?.options?.length > 0 ? (
                    <RadioGroup
                        value={answer}
                        onValueChange={handleValueChange}
                        className="gap-4"
                    >
                        {question.options.map((option, index) => (
                            <div
                                key={index}
                                // className="flex items-center space-x-3 p-3 rounded-lg border border-border/40 hover:border-border/60 hover:bg-accent/5 transition-colors"
                                className={cn(
                                    "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
                                    answer === option
                                        ? "border-primary/50 bg-primary/5"
                                        : "border-border/40 hover:border-border/60 hover:bg-accent/5"
                                )}
                            >
                                <RadioGroupItem
                                    value={option}
                                    id={`${question.id}-${index}`}
                                    className="shrink-0"
                                />
                                <Label
                                    htmlFor={`${question.id}-${index}`}
                                    className="text-sm font-medium text-foreground cursor-pointer flex-1 leading-relaxed"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                ) : (
                    <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed border-border/40 rounded-lg">
                        No options available
                    </div>
                )}
            </div>

            {/* Error display */}
            {errors.length > 0 && (
                <div className="text-sm text-destructive space-y-1 pt-2">
                    {errors.map((error, index) => (
                        <p key={index} className="flex items-center gap-1">
                            <span className="text-xs">⚠</span>
                            {error}
                        </p>
                    ))}
                </div>
            )}

            {/* Validation hints */}
            {question.validation && (
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    {question.required && (
                        <p className="flex items-center gap-1">
                            <span className="text-destructive">*</span>
                            This field is required
                        </p>
                    )}
                    {question.validation.min && typeof question.validation.min === 'number' && (
                        <p>Minimum {question.validation.min} selection required</p>
                    )}
                    {question.validation.pattern && (
                        <p>Please select a valid option</p>
                    )}
                </div>
            )}
        </div>
    );
}