import { IQuestion } from "@/types/form";
import { eQuestionType } from "@/enums/form";
import { ShortText } from "./formFields/shortText";
import { LongText } from "./formFields/longText";
import { Number } from "./formFields/number";
import { Date } from "./formFields/date";
import { FileUpload } from "./formFields/file";
import { Radio } from "./formFields/radio";
import { CheckboxField } from "./formFields/checkbox";
import { Dropdown } from "./formFields/dropdown";
import { Email } from "./formFields/email";
import { PhoneField } from "./formFields/phone";
import { Address } from "./formFields/address";
import { Website } from "./formFields/website";
import { StarRating } from "./formFields/starRating";
import { BarChoiceRating } from "./formFields/barChoiceRating";
import { ImageChoiceRating } from "./formFields/imageChoiceRating";

interface QuestionCardProps {
    question: IQuestion;
    value?: any;
    onChange?: (value: any) => void;
    disabled?: boolean;
    className?: string;
}

export function QuestionCard({ question, value, onChange, disabled = false, className = "" }: QuestionCardProps) {
    const renderQuestionField = () => {
        switch (question.type) {
            case eQuestionType.shortText:
                return (
                    <ShortText
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.longText:
                return (
                    <LongText
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.number:
                return (
                    <Number
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.date:
                return (
                    <Date
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.file:
                return (
                    <FileUpload
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.radio:
                return (
                    <Radio
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.checkbox:
                return (
                    <CheckboxField
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.dropdown:
                return (
                    <Dropdown
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.email:
                return (
                    <Email
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.phone:
                return (
                    <PhoneField
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.address:
                return (
                    <Address
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.website:
                return (
                    <Website
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.starRating:
                return (
                    <StarRating
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.barChoiceRating:
                return (
                    <BarChoiceRating
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            case eQuestionType.imageChoiceRating:
                return (
                    <ImageChoiceRating
                        question={question}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                    />
                );
            
            default:
                return (
                    <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                            Question type "{question.type}" is not yet supported.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className={`question-card p-6 border rounded-lg bg-card shadow-sm space-y-4 ${className}`}>
            {renderQuestionField()}
        </div>
    );
}
