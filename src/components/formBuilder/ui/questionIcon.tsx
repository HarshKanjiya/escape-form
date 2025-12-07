import { QuestionType } from "@prisma/client";
import { Book, Calendar, CaseSensitive, CircleDot, FileText, Hash, Link2, LucideIcon, Mail, MapPin, Phone, SquareCheckBig, Star, Trash2 } from "lucide-react";

const iconMapping: Record<QuestionType, LucideIcon> = {
    [QuestionType.TEXT_SHORT]: CaseSensitive,
    [QuestionType.TEXT_LONG]: CaseSensitive,
    [QuestionType.NUMBER]: Hash,
    [QuestionType.DATE]: Calendar,
    [QuestionType.FILE_ANY]: FileText,
    [QuestionType.USER_DETAIL]: Book,
    [QuestionType.CHOICE_SINGLE]: CircleDot,
    [QuestionType.CHOICE_CHECKBOX]: SquareCheckBig,
    [QuestionType.INFO_EMAIL]: Mail,
    [QuestionType.INFO_PHONE]: Phone,
    [QuestionType.USER_ADDRESS]: MapPin,
    [QuestionType.INFO_URL]: Link2,
    [QuestionType.RATING_STAR]: Star,
    // [eQuestionType.dropdown]: ChevronsUpDown,
    // [eQuestionType.barChoiceRating]: ChartBarBig,
    // [eQuestionType.imageChoiceRating]: Images,

    [QuestionType.CHOICE_BOOL]: Trash2,
    [QuestionType.CHOICE_DROPDOWN]: Trash2,
    [QuestionType.CHOICE_MULTIPLE]: Trash2,
    [QuestionType.CHOICE_PICTURE]: Trash2,
    [QuestionType.FILE_IMAGE_OR_VIDEO]: Trash2,
    [QuestionType.SCREEN_WELCOME]: Trash2,
    [QuestionType.SCREEN_END]: Trash2,
    [QuestionType.SCREEN_STATEMENT]: Trash2,
    [QuestionType.RATING_RANK]: Trash2,
    [QuestionType.RATING_ZERO_TO_TEN]: Trash2,
    [QuestionType.LEAGAL]: Trash2,
    [QuestionType.REDIRECT_TO_URL]: Trash2,
};

export default function QuestionIcon({ questionType, size = 16, ...props }: { questionType: QuestionType; size?: number, [key: string]: any }) {
    const Icon = iconMapping[questionType];
    return (
        <div>
            {Icon ? <Icon size={size} {...props} /> : null}
        </div>
    )
}