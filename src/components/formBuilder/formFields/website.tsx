import { IQuestion } from "@/types/form";

interface IProps {
    question: IQuestion,
    index: number
}

export function WebsiteField({ question, index }: IProps) {
    // const formatUrl = (url: string) => {
    //     if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    //         return `https://${url}`;
    //     }
    //     return url;
    // };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     onChange?.(e.target.value);
    // };

    // const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    //     const formattedUrl = formatUrl(e.target.value);
    //     if (formattedUrl !== e.target.value) {
    //         onChange?.(formattedUrl);
    //     }
    // };

    return (
        <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
            <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
                <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
            </div>
            <div className="space-y-4 w-full flex-1">
            {/* <Label htmlFor={question.id} className="text-sm font-medium">
                {question.question}
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
            </p> */}
        </div>
        </div>
    );
}
