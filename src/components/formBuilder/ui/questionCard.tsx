import { eQuestionType } from "@/enums/form";
import { IQuestion } from "@/types/form";
import { AddressField } from "../formFields/address";
import { CheckboxField } from "../formFields/checkbox";
import { DateField } from "../formFields/date";
// import { DropdownField } from "../formFields/dropdown";
import { EmailField } from "../formFields/email";
import { FileUploadField } from "../formFields/file";
import { LongTextField } from "../formFields/longText";
import { NumberField } from "../formFields/number";
import { PhoneField } from "../formFields/phone";
import { RadioField } from "../formFields/radio";
import { ShortTextField } from "../formFields/shortText";
import { StarRatingField } from "../formFields/starRating";
import { WebsiteField } from "../formFields/website";
import { DetailField } from "../formFields/detail";

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
                <ShortTextField question={question} index={index} />
            );

        case eQuestionType.longText:
            return (
                <LongTextField question={question} index={index} />
            );

        case eQuestionType.number:
            return (
                <NumberField question={question} index={index} />
            );

        case eQuestionType.detail:
            return (
                <DetailField question={question} index={index} />
            );

        case eQuestionType.date:
            return (
                <DateField question={question} index={index} />
            );

        case eQuestionType.file:
            return (
                <FileUploadField question={question} index={index} />
            );

        case eQuestionType.radio:
            return (
                <RadioField question={question} index={index} />
            );

        case eQuestionType.checkbox:
            return (
                <CheckboxField question={question} index={index} />
            );

        // case eQuestionType.dropdown:
        //     return (
        //         <DropdownField question={question} index={index} />
        //     );

        case eQuestionType.email:
            return (
                <EmailField question={question} index={index} />
            );

        case eQuestionType.phone:
            return (
                <PhoneField question={question} index={index} />
            );

        case eQuestionType.address:
            return (
                <AddressField question={question} index={index} />
            );

        case eQuestionType.website:
            return (
                <WebsiteField question={question} index={index} />
            );

        case eQuestionType.starRating:
            return (
                <StarRatingField question={question} index={index} />
            );

        // case eQuestionType.barChoiceRating:
        //     return (
        //         <BarChoiceRatingField question={question} index={index} />
        //     );

        // case eQuestionType.imageChoiceRating:
        //     return (
        //         <ImageChoiceRatingField question={question} index={index} />
        //     );

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