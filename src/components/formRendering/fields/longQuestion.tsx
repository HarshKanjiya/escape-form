'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { IQuestion } from "@/types/form";
import { useState } from "react";

interface Props {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
}

export default function RenderLongQuestion({ question, value = "", onChange, }: Props) {

    const [answer, setAnswer] = useState("");
    const [errors, setErrors] = useState<string[]>([]);


    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(e.target.value);
        onChange?.(answer);
    };

    return (
        <div
            className='w-full space-y-2 p-2 pb-5'
        >
            <div className="py-2">
                <Label
                    htmlFor={question.id}
                    className={cn(
                        "font-medium text-foreground text-xl",
                        question.required && "after:content-['*'] after:text-destructive"
                    )}
                >
                    {question.question}
                </Label>

                {question.description && (
                    <p className="text-md text-muted-foreground italic py-1">
                        {question.description}
                    </p>
                )}
            </div>

            <div className="space-y-1 relative">
                <Textarea
                    id={question.id}
                    value={answer}
                    onChange={handleInputChange}
                    placeholder={question.placeholder || "Type your answer here..."}
                    required={question.required}
                    minLength={question.validation?.min as number || undefined}
                    maxLength={question.validation?.max as number || undefined}
                    className={cn('border-primary-300 border-2 py-6 px-4 !text-xl min-h-[130px]', question.validation?.max ? "pr-10" : "", "w-full")}
                    rows={5}
                ></Textarea>
                {question.validation?.max && typeof question.validation.max === 'number' && (
                    <div className="flex justify-end absolute right-3 top-5 -translate-y-1/2">
                        <span className={cn(
                            "text-sm text-muted-foreground",
                            answer.length > question.validation.max * 0.9 && "text-orange-500",
                            answer.length >= question.validation.max && "text-destructive"
                        )}>
                            {answer.length} / {question.validation.max}
                        </span>
                    </div>
                )}
            </div>

            {question.validation && (
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    {question.validation.min && typeof question.validation.min === 'number' && (
                        <p>Minimum {question.validation.min} characters required</p>
                    )}
                    {question.validation.pattern && (
                        <p>Please enter a valid format</p>
                    )}
                </div>
            )}
        </div>
    );
}