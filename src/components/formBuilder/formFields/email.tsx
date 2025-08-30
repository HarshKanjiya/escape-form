import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { Mail } from "lucide-react";

interface EmailProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function Email({ question, value = "", onChange, disabled = false }: EmailProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <div className="relative">
                <Input
                    id={question.id}
                    type="email"
                    placeholder={question.placeholder || "Enter your email address..."}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    required={question.required}
                    className="w-full pl-10"
                    pattern={question.validation?.pattern}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
        </div>
    );
}
