import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { Globe } from "lucide-react";

interface WebsiteProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export function Website({ question, value = "", onChange, disabled = false }: WebsiteProps) {
    const formatUrl = (url: string) => {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const formattedUrl = formatUrl(e.target.value);
        if (formattedUrl !== e.target.value) {
            onChange?.(formattedUrl);
        }
    };

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
                    type="url"
                    placeholder={question.placeholder || "https://example.com"}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={question.required}
                    className="w-full pl-10"
                    pattern={question.validation?.pattern || "https?://.+"}
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
                URL will be automatically prefixed with https:// if needed
            </p>
        </div>
    );
}
