
import { IQuestion } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    className?: string;
}

export default function ShortQuestion({
    question,
    value = "",
    onChange,
    error,
    className
}: Props) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Apply validation if pattern is provided
        if (question.validation?.pattern && inputValue) {
            const regex = new RegExp(question.validation.pattern);
            if (!regex.test(inputValue)) {
                return; // Don't update if pattern doesn't match
            }
        }

        // Apply max length validation
        if (question.validation?.max && typeof question.validation.max === 'number') {
            if (inputValue.length > question.validation.max) {
                return; // Don't update if exceeds max length
            }
        }

        onChange?.(inputValue);
    };

    const isRequired = question.required;
    const hasError = !!error;

    return (
        <div
            className={cn("space-y-2", className)}
            {...(question.customCss && { style: { cssText: question.customCss } as any })}
        >
            {/* Question Label */}
            <div className="space-y-1">
                <Label
                    htmlFor={question.id}
                    className={cn(
                        "text-base font-medium text-foreground",
                        isRequired && "after:content-['*'] after:text-destructive after:ml-1"
                    )}
                >
                    {question.question}
                </Label>

                {/* Description */}
                {question.description && (
                    <p className="text-sm text-muted-foreground">
                        {question.description}
                    </p>
                )}
            </div>

            {/* Input Field */}
            <div className="space-y-1">
                <Input
                    id={question.id}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    placeholder={question.placeholder || "Type your answer here..."}
                    required={isRequired}
                    minLength={question.validation?.min as number || undefined}
                    maxLength={question.validation?.max as number || undefined}
                    pattern={question.validation?.pattern || undefined}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${question.id}-error` : undefined}
                    className={cn(
                        "transition-all duration-200",
                        hasError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                    )}
                />

                {/* Character count indicator */}
                {question.validation?.max && typeof question.validation.max === 'number' && (
                    <div className="flex justify-end">
                        <span className={cn(
                            "text-xs text-muted-foreground",
                            value.length > question.validation.max * 0.9 && "text-orange-500",
                            value.length >= question.validation.max && "text-destructive"
                        )}>
                            {value.length} / {question.validation.max}
                        </span>
                    </div>
                )}

                {/* Error message */}
                {hasError && (
                    <p
                        id={`${question.id}-error`}
                        className="text-sm text-destructive flex items-center gap-1"
                        role="alert"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>

            {/* Validation hints */}
            {question.validation && (
                <div className="text-xs text-muted-foreground space-y-1">
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