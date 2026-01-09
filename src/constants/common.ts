import { CountryOption } from "@/types/common";
import { QuestionType } from "@prisma/client";
import { BookIcon, CalendarIcon, CaseSensitiveIcon, CheckIcon, ChevronsUpDownIcon, CircleDotIcon, FileStackIcon, HashIcon, Link2Icon, ListOrderedIcon, MailIcon, MapPinIcon, PhoneIcon, ScaleIcon, Star, StarIcon, ToggleRightIcon } from "lucide-react";

export const COUNTRIES: CountryOption[] = [
    { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
    { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
    { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
    { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
    { code: "BR", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "ZA", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "NG", dialCode: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "ES", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "IT", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "SE", dialCode: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "NL", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "CH", dialCode: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "MX", dialCode: "+52", name: "Mexico", flag: "🇲🇽" },
];

export const REGEX = {
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

export const THEMES = {
    light: 'light',
    dark: 'dark',
    system: 'system'
}

export const QUESTION_TYPES = [
    // COMMON 
    { value: QuestionType.TEXT_SHORT, label: "Short Text", icon: CaseSensitiveIcon },
    { value: QuestionType.TEXT_LONG, label: "Long Text", icon: CaseSensitiveIcon },
    { value: QuestionType.NUMBER, label: "Number", icon: HashIcon },
    { value: QuestionType.DATE, label: "Date", icon: CalendarIcon },
    // { value: QuestionType.FILE_IMAGE_OR_VIDEO, label: "pending", icon: StarIcon },               // FUTURE
    // { value: QuestionType.FILE_ANY, label: "File Upload", icon: FileTextIcon },                  // FUTURE
    { value: QuestionType.LEAGAL, label: "Leagal", icon: ScaleIcon },
    // { value: QuestionType.REDIRECT_TO_URL, label: "pending", icon: Star },

    // CHOICE
    { value: QuestionType.CHOICE_SINGLE, label: "Single Choice", icon: CircleDotIcon },
    { value: QuestionType.CHOICE_CHECKBOX, label: "Checkbox", icon: CheckIcon },
    { value: QuestionType.CHOICE_BOOL, label: "Yes/No", icon: ToggleRightIcon },
    { value: QuestionType.CHOICE_DROPDOWN, label: "Dropdown", icon: ChevronsUpDownIcon },
    { value: QuestionType.CHOICE_MULTIPLE, label: "Multiple Choice", icon: FileStackIcon },
    // { value: QuestionType.CHOICE_PICTURE, label: "pending", icon: Star },                        // FUTURE

    // INFO
    { value: QuestionType.INFO_EMAIL, label: "Email", icon: MailIcon },
    { value: QuestionType.INFO_PHONE, label: "Phone", icon: PhoneIcon },
    { value: QuestionType.INFO_URL, label: "Website", icon: Link2Icon },

    // USER
    { value: QuestionType.USER_DETAIL, label: "Details", icon: BookIcon },
    { value: QuestionType.USER_ADDRESS, label: "Address", icon: MapPinIcon },

    // RATING
    { value: QuestionType.RATING_RANK, label: "Rank rating", icon: HashIcon },
    { value: QuestionType.RATING_ZERO_TO_TEN, label: "Rating board", icon: ListOrderedIcon },
    { value: QuestionType.RATING_STAR, label: "Star Rating", icon: StarIcon },

    // SCREENS
    { value: QuestionType.SCREEN_WELCOME, label: "Welcome Screen", icon: Star },
    { value: QuestionType.SCREEN_END, label: "End Screen", icon: Star },
    { value: QuestionType.SCREEN_STATEMENT, label: "Statement Screen", icon: Star },
]


export const OPERATORS = [
    { value: "eq", label: "=" },
    { value: "neq", label: "≠" },
    { value: "gt", label: ">" },
    { value: "gte", label: "≥" },
    { value: "lt", label: "<" },
    { value: "lte", label: "≤" },
    { value: "hasValue", label: "Has Value" },
    { value: "doesNotHaveValue", label: "Empty" },
]

export const LOGIC_OPERATORS = [
    { value: "AND", label: "AND" },
    { value: "OR", label: "OR" },
]