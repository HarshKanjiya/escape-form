'use client';

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { IQuestion } from "@/types/form";
import { useState, useEffect } from "react";

interface Props {
    question: IQuestion;
    value?: string[];
    onChange?: (value: string[]) => void;
}

export default function RenderCheckBoxField({ question, value, onChange }: Props) {

    const [selectedOptions, setSelectedOptions] = useState<string[]>(value || []);
    const [errors, _] = useState<string[]>([]);

    // Update internal state when external value changes
    useEffect(() => {
        if (value !== undefined) {
            setSelectedOptions(value);
        }
    }, [value]);

    const handleOptionChange = (option: string, checked: boolean) => {
        let newSelectedOptions: string[];

        if (checked) {
            newSelectedOptions = [...selectedOptions, option];
        } else {
            newSelectedOptions = selectedOptions.filter(item => item !== option);
        }

        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedOptions);
    };

    return (
        <div className="w-full space-y-4 p-4">
            <div className="space-y-2">
                <Label
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
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            const isChecked = selectedOptions.includes(option);
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
                                        isChecked
                                            ? "border-primary/50 bg-primary/5"
                                            : "border-border/40 hover:border-border/60 hover:bg-accent/5"
                                    )}
                                >
                                    <Checkbox
                                        id={`${question.id}-${index}`}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            handleOptionChange(option, checked === true)
                                        }
                                        className="shrink-0"
                                    />
                                    <Label
                                        htmlFor={`${question.id}-${index}`}
                                        className="text-sm font-medium text-foreground cursor-pointer flex-1 leading-relaxed"
                                    >
                                        {option}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed border-border/40 rounded-lg">
                        No options available
                    </div>
                )}
            </div>

            {/* Selected count indicator */}
            {selectedOptions.length > 0 && (
                <div className="text-xs text-primary bg-primary/10 px-3 py-2 rounded-md border border-primary/20">
                    {selectedOptions.length} option{selectedOptions.length !== 1 ? 's' : ''} selected
                    {question.validation?.max && typeof question.validation.max === 'number' && (
                        <span className="ml-2 text-muted-foreground">
                            (max: {question.validation.max})
                        </span>
                    )}
                </div>
            )}

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
                            At least one option must be selected
                        </p>
                    )}
                    {question.validation.min && typeof question.validation.min === 'number' && (
                        <p>Minimum {question.validation.min} selection{question.validation.min !== 1 ? 's' : ''} required</p>
                    )}
                    {question.validation.max && typeof question.validation.max === 'number' && (
                        <p>Maximum {question.validation.max} selection{question.validation.max !== 1 ? 's' : ''} allowed</p>
                    )}
                </div>
            )}
        </div>
    );
}