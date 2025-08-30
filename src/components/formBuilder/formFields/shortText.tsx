import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";

interface ShortTextProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function ShortText({ question, value = "", onChange, disabled = false }: ShortTextProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Input
                id={question.id}
                type="text"
                placeholder={question.placeholder || "Enter your answer..."}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                required={question.required}
                className="w-full"
                maxLength={question.validation?.max}
                minLength={question.validation?.min}
            />
        </div>
    );
}
