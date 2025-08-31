import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { Phone } from "lucide-react";

interface PhoneProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function PhoneField({ question, value = "", onChange, disabled = false }: PhoneProps) {
    const formatPhoneNumber = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        
        // Format as (XXX) XXX-XXXX for US phone numbers
        if (digits.length >= 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        } else if (digits.length >= 6) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length >= 3) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        }
        return digits;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        onChange?.(formatted);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
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
            </p>
        </div>
    );
}
