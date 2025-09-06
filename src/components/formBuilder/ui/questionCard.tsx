import { eQuestionType } from "@/enums/form";
import { IQuestion } from "@/types/form";
import { Address } from "../formFields/address";
import { BarChoiceRating } from "../formFields/barChoiceRating";
import { CheckboxField } from "../formFields/checkbox";
import { Date } from "../formFields/date";
import { Dropdown } from "../formFields/dropdown";
import { Email } from "../formFields/email";
import { FileUpload } from "../formFields/file";
import { ImageChoiceRating } from "../formFields/imageChoiceRating";
import { LongText } from "../formFields/longText";
import { Number } from "../formFields/number";
import { PhoneField } from "../formFields/phone";
import { Radio } from "../formFields/radio";
import { ShortText } from "../formFields/shortText";
import { StarRating } from "../formFields/starRating";
import { Website } from "../formFields/website";

interface IProps {
    question: IQuestion | null;
    index: number;
}

export default function QuestionCard({ question, index }: IProps) {
    if (!question) {
        return (
            <p className="text-sm text-muted-foreground">No question selected</p>
        );
    }
    switch (question.type) {
        case eQuestionType.shortText:
            return (
                <ShortText question={question} index={index} />
            );

        case eQuestionType.longText:
            return (
                <LongText question={question} index={index} />
            );

        case eQuestionType.number:
            return (
                <Number question={question} index={index} />
            );

        case eQuestionType.date:
            return (
                <Date question={question} index={index} />
            );

        case eQuestionType.file:
            return (
                <FileUpload question={question} index={index} />
            );

        case eQuestionType.radio:
            return (
                <Radio question={question} index={index} />
            );

        case eQuestionType.checkbox:
            return (
                <CheckboxField question={question} index={index} />
            );

        case eQuestionType.dropdown:
            return (
                <Dropdown question={question} index={index} />
            );

        case eQuestionType.email:
            return (
                <Email question={question} index={index} />
            );

        case eQuestionType.phone:
            return (
                <PhoneField question={question} index={index} />
            );

        case eQuestionType.address:
            return (
                <Address question={question} index={index} />
            );

        case eQuestionType.website:
            return (
                <Website question={question} index={index} />
            );

        case eQuestionType.starRating:
            return (
                <StarRating question={question} index={index} />
            );

        case eQuestionType.barChoiceRating:
            return (
                <BarChoiceRating question={question} index={index} />
            );

        case eQuestionType.imageChoiceRating:
            return (
                <ImageChoiceRating question={question} index={index} />
            );

        default:
            return (
                <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center">
                    <h2 className="question-card__title">{question?.question}</h2>
                    <p className="question-card__description">{question?.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Question type &quot;{question.type}&quot; is not yet supported.
                    </p>
                </div>
            );
    }
}