import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";

interface LongTextProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function LongText({ question, value = "", onChange, disabled = false }: LongTextProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Textarea
                id={question.id}
                placeholder={question.placeholder || "Enter your detailed answer..."}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                required={question.required}
                className="w-full min-h-[100px] resize-y"
                maxLength={question.validation?.max}
                minLength={question.validation?.min}
            />
            {question.validation?.max && (
                <p className="text-xs text-muted-foreground text-right">
                    {value.length}/{question.validation.max} characters
                </p>
            )}
        </div>
    );
}
