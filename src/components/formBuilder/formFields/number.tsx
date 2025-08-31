import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";

interface NumberProps {
    question: IQuestion;
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
}

export function Number({ question, value, onChange, disabled = false }: NumberProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Input
                id={question.id}
                type="number"
                placeholder={question.placeholder || "Enter a number..."}
                value={value || ""}
                onChange={(e) => onChange?.(parseFloat(e.target.value) || 0)}
                disabled={disabled}
                required={question.required}
                className="w-full"
                min={question.validation?.min}
                max={question.validation?.max}
            />
            {(question.validation?.min !== undefined || question.validation?.max !== undefined) && (
                <p className="text-xs text-muted-foreground">
                    {question.validation?.min !== undefined && question.validation?.max !== undefined
                        ? `Value must be between ${question.validation.min} and ${question.validation.max}`
                        : question.validation?.min !== undefined
                        ? `Minimum value: ${question.validation.min}`
                        : `Maximum value: ${question.validation.max}`
                    }
                </p>
            )}
        </div>
    );
}
