import { eQuestionType } from "@/enums/form";
import { Calendar, CaseSensitive, ChartBarBig, ChevronsUpDown, CircleDot, FileText, Hash, Images, Link2, LucideIcon, Mail, MapPin, Phone, SquareCheckBig, Star } from "lucide-react";

const iconMapping: Record<eQuestionType, LucideIcon> = {
    [eQuestionType.shortText]: CaseSensitive,
    [eQuestionType.longText]: CaseSensitive,
    [eQuestionType.number]: Hash,
    [eQuestionType.date]: Calendar,
    [eQuestionType.file]: FileText,
    [eQuestionType.radio]: CircleDot,
    [eQuestionType.checkbox]: SquareCheckBig,
    [eQuestionType.dropdown]: ChevronsUpDown,
    [eQuestionType.email]: Mail,
    [eQuestionType.phone]: Phone,
    [eQuestionType.address]: MapPin,
    [eQuestionType.website]: Link2,
    [eQuestionType.starRating]: Star,
    [eQuestionType.barChoiceRating]: ChartBarBig,
    [eQuestionType.imageChoiceRating]: Images,
};

export default function QuestionIcon({ questionType, size = 16, ...props }: { questionType: eQuestionType; size?: number }) {
    const Icon = iconMapping[questionType];
    return (
        <div>
            {Icon ? <Icon size={size} {...props} /> : null}
        </div>
    )
}