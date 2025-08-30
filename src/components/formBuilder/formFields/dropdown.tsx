import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";

interface DropdownProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function Dropdown({ question, value = "", onChange, disabled = false }: DropdownProps) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            
            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled}
                required={question.required}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={question.placeholder || "Select an option..."} />
                </SelectTrigger>
                <SelectContent>
                    {question.options?.map((option, index) => (
                        <SelectItem key={index} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            {(!question.options || question.options.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No options available</p>
            )}
        </div>
    );
}
