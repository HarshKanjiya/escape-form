import { eQuestionType } from "@/enums/form";
import { IQuestion } from "@/types/form";

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
    question: IQuestion;
    formData: { [key: string]: any };
    handleFieldChange: (questionId: string, value: string | number | boolean | string[]) => void;
}

export default function RenderField({ question, formData, handleFieldChange }: Props) {
    switch (question.type) {
        case eQuestionType.shortText:
            return (
                <MemoRenderShortQuestion
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.longText:
            return (
                <MemoRenderLongQuestion
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.address:
            return (
                <MemoRenderAddressField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.checkbox:
            return (
                <MemoRenderCheckBoxField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.date:
            return (
                <MemoRenderDateField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.detail:
            return (
                <MemoRenderDetailField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.email:
            return (
                <MemoRenderEmailField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.file:
            return (
                <MemoRenderFileField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.number:
            return (
                <MemoRenderNumberField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.phone:
            return (
                <MemoRenderPhoneField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.radio:
            return (
                <MemoRenderRadioField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.starRating:
            return (
                <MemoRenderStarRatingField
                    question={question}
                    value={typeof formData[question.id] === 'string' ? formData[question.id] as string : ""}
                    onChange={(value) => handleFieldChange(question.id, value)}
                />
            );
        case eQuestionType.website:
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
                        Question: {question.question}
                    </p>
                </div>
            );
    }
}