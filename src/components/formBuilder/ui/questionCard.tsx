import { Question } from "@/types/form";
import { AddressField } from "../formFields/address";
import { DateField } from "../formFields/date";
// import { DropdownField } from "../formFields/dropdown";
import { QuestionType } from "@prisma/client";
import { ChoiceCheckboxField } from "../formFields/choice/ChoiceCheckbox";
import { ChoiceMultipleField } from "../formFields/choice/ChoiceMultiple";
import ChoiceSingleField from "../formFields/choice/ChoiceSingle";
import { DetailField } from "../formFields/detail";
import { EmailField } from "../formFields/email";
import { FileUploadField } from "../formFields/file";
import { LongTextField } from "../formFields/longText";
import { NumberField } from "../formFields/number";
import { PhoneField } from "../formFields/phone";
import { ShortTextField } from "../formFields/shortText";
import { StarRatingField } from "../formFields/starRating";
import { WebsiteField } from "../formFields/website";

interface IProps {
    question: Question | null;
    index: number;
}

export default function QuestionCard({ question, index }: IProps) {
    if (!question) {
        return (
            <p className="text-sm text-muted-foreground">No question selected</p>
        );
    }
    switch (question.type) {
        case QuestionType.TEXT_SHORT:
            return (
                <ShortTextField question={question} index={index} />
            );

        case QuestionType.TEXT_LONG:
            return (
                <LongTextField question={question} index={index} />
            );

        case QuestionType.NUMBER:
            return (
                <NumberField question={question} index={index} />
            );

        case QuestionType.USER_DETAIL:
            return (
                <DetailField question={question} index={index} />
            );

        case QuestionType.DATE:
            return (
                <DateField question={question} index={index} />
            );

        case QuestionType.FILE_ANY:
            return (
                <FileUploadField question={question} index={index} />
            );

        case QuestionType.CHOICE_SINGLE:
            return (
                <ChoiceSingleField question={question} index={index} />
            );

        case QuestionType.CHOICE_CHECKBOX:
            return (
                <ChoiceCheckboxField question={question} index={index} />
            );
        case QuestionType.CHOICE_MULTIPLE:
            return (
                <ChoiceMultipleField question={question} index={index} />
            );

        // case QuestionType.dropdown:
        //     return (
        //         <DropdownField question={question} index={index} />
        //     );

        case QuestionType.INFO_EMAIL:
            return (
                <EmailField question={question} index={index} />
            );

        case QuestionType.INFO_PHONE:
            return (
                <PhoneField question={question} index={index} />
            );

        case QuestionType.USER_ADDRESS:
            return (
                <AddressField question={question} index={index} />
            );

        case QuestionType.INFO_URL:
            return (
                <WebsiteField question={question} index={index} />
            );

        case QuestionType.RATING_STAR:
            return (
                <StarRatingField question={question} index={index} />
            );

        // case QuestionType.barChoiceRating:
        //     return (
        //         <BarChoiceRatingField question={question} index={index} />
        //     );

        // case QuestionType.imageChoiceRating:
        //     return (
        //         <ImageChoiceRatingField question={question} index={index} />
        //     );

        default:
            return (
                <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center">
                    <h2 className="question-card__title">{question?.title}</h2>
                    <p className="question-card__description">{question?.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Question type &quot;{question.type}&quot; is not yet supported.
                    </p>
                </div>
            );
    }
}