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

export function CheckboxField({ question, index }: IProps) {


    // const handleCheckboxChange = (option: string, checked: boolean) => {
    //     if (checked) {
    //         onChange?.([...value, option]);
    //     } else {
    //         onChange?.(value.filter(v => v !== option));
    //     }
    // };

    return (
        <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
            <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
                <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
            </div>
            <div className="space-y-4 w-full flex-1">
            {/* <div>
                <Label className="text-sm font-medium">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {question.description && (
                    <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                )}
            </div>
            
            <div className="space-y-3">
                {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${question.id}-${index}`}
                            checked={value.includes(option)}
                            onCheckedChange={(checked: boolean) => 
                                handleCheckboxChange(option, checked)
                            }
                            disabled={disabled}
                        />
                        <Label 
                            htmlFor={`${question.id}-${index}`} 
                            className="text-sm font-normal cursor-pointer flex-1"
                        >
                            {option}
                        </Label>
                    </div>
                ))}
            </div>
            
            {(!question.options || question.options.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No options available</p>
            )}
            
            {question.validation?.min && (
                <p className="text-xs text-muted-foreground">
                    Select at least {String(question.validation.min)} option{Number(question.validation.min) > 1 ? 's' : ''}
                </p>
            )}
            {question.validation?.max && (
                <p className="text-xs text-muted-foreground">
                    Select at most {String(question.validation.max)} option{Number(question.validation.max) > 1 ? 's' : ''}
                </p>
            )} */}
        </div>
        </div>
    );
}
