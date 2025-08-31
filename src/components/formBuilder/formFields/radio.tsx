import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";

interface RadioProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function Radio({ question, value = "", onChange, disabled = false }: RadioProps) {
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
            
            <RadioGroup
                value={value}
                onValueChange={onChange}
                disabled={disabled}
                required={question.required}
                className="space-y-3"
            >
                {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                        <Label 
                            htmlFor={`${question.id}-${index}`} 
                            className="text-sm font-normal cursor-pointer flex-1"
                        >
                            {option}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            
            {(!question.options || question.options.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No options available</p>
            )}
        </div>
    );
}
