import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { IQuestion } from "@/types/form";
import { useEffect, useRef, useState } from "react";


interface IProps {
    question: IQuestion,
    index: number
}

export function DropdownField({ question, index }: IProps) {
    return (
        <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
            <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
                <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
            </div>
            <div className="space-y-4 w-full flex-1">            {/* <Label className="text-sm font-medium">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}

            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled}
                required={question.required}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={question.placeholder || "Select an option..."} />
                </SelectTrigger>
                <SelectContent>
                    {question.options?.map((option, index) => (
                        <SelectItem key={index} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(!question.options || question.options.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No options available</p>
            )} */}
        </div>
        </div>
    );
}
