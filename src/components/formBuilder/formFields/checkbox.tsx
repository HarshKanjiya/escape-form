import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";

interface CheckboxFieldProps {
    question: IQuestion;
    value?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
}

export function CheckboxField({ question, value = [], onChange, disabled = false }: CheckboxFieldProps) {
    const handleCheckboxChange = (option: string, checked: boolean) => {
        if (checked) {
            onChange?.([...value, option]);
        } else {
            onChange?.(value.filter(v => v !== option));
        }
    };

    return (
        <div className="space-y-4">
            <div>
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
                    Select at least {question.validation.min} option{question.validation.min > 1 ? 's' : ''}
                </p>
            )}
            {question.validation?.max && (
                <p className="text-xs text-muted-foreground">
                    Select at most {question.validation.max} option{question.validation.max > 1 ? 's' : ''}
                </p>
            )}
        </div>
    );
}
