import { Question } from "@/types/form";

import { memo } from "react";
import RenderAddressField from "./address";
import RenderCheckBoxField from "./checkbox";
import RenderDateField from "./date";
import RenderDetailField from "./detail";
import RenderEmailField from "./email";
import RenderFileField from "./file";
import RenderLongQuestion from "./longQuestion";
import RenderNumberField from "./number";
import RenderPhoneField from "./phone";
import RenderRadioField from "./radio";
import RenderShortQuestion from "./shortQuestion";
import RenderStarRatingField from "./starRating";
import RenderWebsiteField from "./website";
import { QuestionType } from "@/generated/prisma";

const MemoRenderShortQuestion = memo(RenderShortQuestion);
const MemoRenderLongQuestion = memo(RenderLongQuestion);
const MemoRenderAddressField = memo(RenderAddressField);
const MemoRenderCheckBoxField = memo(RenderCheckBoxField);
const MemoRenderDateField = memo(RenderDateField);
const MemoRenderDetailField = memo(RenderDetailField);
const MemoRenderEmailField = memo(RenderEmailField);
const MemoRenderFileField = memo(RenderFileField);
const MemoRenderNumberField = memo(RenderNumberField);
const MemoRenderPhoneField = memo(RenderPhoneField);
const MemoRenderRadioField = memo(RenderRadioField);
const MemoRenderStarRatingField = memo(RenderStarRatingField);
const MemoRenderWebsiteField = memo(RenderWebsiteField);

interface Props {
    question: Question;
    formData: { [key: string]: string | number | boolean | string[] };
    handleFieldChange: (questionId: string, value: string | number | boolean | string[]) => void;
}

export default function RenderField({ question, formData, handleFieldChange }: Props) {
    switch (question.type) {
        case QuestionType.TEXT_SHORT:
            return (
                <MemoRenderShortQuestion
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.TEXT_LONG:
            return (
                <MemoRenderLongQuestion
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.USER_ADDRESS:
            return (
                <MemoRenderAddressField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.CHOICE_CHECKBOX:
            return (
                <MemoRenderCheckBoxField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string[] : []}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.DATE:
            return (
                <MemoRenderDateField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.USER_DETAIL:
            return (
                <MemoRenderDetailField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.INFO_EMAIL:
            return (
                <MemoRenderEmailField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.FILE_ANY:
            return (
                <MemoRenderFileField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.NUMBER:
            return (
                <MemoRenderNumberField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.INFO_PHONE:
            return (
                <MemoRenderPhoneField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.CHOICE_SINGLE:
            return (
                <MemoRenderRadioField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.RATING_STAR:
            return (
                <MemoRenderStarRatingField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case QuestionType.INFO_URL:
            return (
                <MemoRenderWebsiteField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        default:
            return (
                <div className="mb-8 p-6 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        Field type &quot;{question.type}&quot; not yet implemented
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Question: {question.title}
                    </p>
                </div>
            );
    }
}