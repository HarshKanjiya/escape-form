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

export function PhoneField({ question, index }: IProps) {
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
            {/* <Label htmlFor={question.id} className="text-sm font-medium">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <div className="relative">
                <Input
                    id={question.id}
                    type="tel"
                    placeholder={question.placeholder || "(123) 456-7890"}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    required={question.required}
                    className="w-full pl-10"
                    maxLength={14} // Length of formatted phone number
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
                Phone number will be automatically formatted
            </p> */}
        </div>
        </div>
    );
}
