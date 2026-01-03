import { QuestionType } from "@prisma/client";
import { Book, Calendar, CaseSensitive, ChevronDownIcon, CircleDot, FileStackIcon, FileText, GalleryHorizontalEndIcon, GalleryHorizontalIcon, Hash, HashIcon, ImageIcon, ImagesIcon, Link2, Link2Icon, ListOrderedIcon, LucideIcon, Mail, MapPin, Phone, ScaleIcon, SquareCheckIcon, StarIcon, ToggleRightIcon } from "lucide-react";

const iconMapping: Record<QuestionType, LucideIcon> = {
    [QuestionType.USER_DETAIL]: Book,
    [QuestionType.USER_ADDRESS]: MapPin,
    [QuestionType.TEXT_SHORT]: CaseSensitive,
    [QuestionType.TEXT_LONG]: CaseSensitive,

    [QuestionType.NUMBER]: Hash,
    [QuestionType.DATE]: Calendar,

    [QuestionType.FILE_ANY]: FileText,
    [QuestionType.FILE_IMAGE_OR_VIDEO]: ImagesIcon,

    [QuestionType.CHOICE_SINGLE]: CircleDot,
    [QuestionType.CHOICE_MULTIPLE]: FileStackIcon,
    [QuestionType.CHOICE_PICTURE]: ImageIcon,
    [QuestionType.CHOICE_CHECKBOX]: SquareCheckIcon,
    [QuestionType.CHOICE_BOOL]: ToggleRightIcon,
    [QuestionType.CHOICE_DROPDOWN]: ChevronDownIcon,

    [QuestionType.INFO_EMAIL]: Mail,
    [QuestionType.INFO_PHONE]: Phone,
    [QuestionType.INFO_URL]: Link2,

    [QuestionType.SCREEN_WELCOME]: GalleryHorizontalEndIcon,
    [QuestionType.SCREEN_STATEMENT]: GalleryHorizontalIcon,
    [QuestionType.SCREEN_END]: GalleryHorizontalIcon,

    [QuestionType.RATING_STAR]: StarIcon,
    [QuestionType.RATING_RANK]: HashIcon,
    [QuestionType.RATING_ZERO_TO_TEN]: ListOrderedIcon,

    [QuestionType.LEAGAL]: ScaleIcon,
    [QuestionType.REDIRECT_TO_URL]: Link2Icon,
};

export default function QuestionIcon({ questionType, size = 16, ...props }: { questionType: QuestionType; size?: number, [key: string]: any }) {
    const Icon = iconMapping[questionType];
    return (
        <div>
            {Icon ? <Icon size={size} {...props} /> : null}
        </div>
    )
}