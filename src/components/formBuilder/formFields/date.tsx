import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { CalendarIcon } from "lucide-react";

interface DateProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function Date({ question, value = "", onChange, disabled = false }: DateProps) {
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
                    type="date"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    required={question.required}
                    className="w-full pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
        </div>
    );
}
