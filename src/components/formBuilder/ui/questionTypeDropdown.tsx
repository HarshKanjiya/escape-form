import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionType } from "@prisma/client";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Book, Calendar, CaseSensitive, CircleDot, FileText, Hash, Link2, Mail, MapPin, Phone, SquareCheckBig, Star } from "lucide-react";
import { useCallback } from "react";

const questionTypes = [
    { value: QuestionType.TEXT_SHORT, label: "Short Text", icon: CaseSensitive },
    { value: QuestionType.TEXT_LONG, label: "Long Text", icon: CaseSensitive },
    { value: QuestionType.NUMBER, label: "Number", icon: Hash },
    { value: QuestionType.USER_DETAIL, label: "Details", icon: Book },
    { value: QuestionType.DATE, label: "Date", icon: Calendar },
    { value: QuestionType.INFO_EMAIL, label: "Email", icon: Mail },
    { value: QuestionType.INFO_PHONE, label: "Phone", icon: Phone },
    { value: QuestionType.USER_ADDRESS, label: "Address", icon: MapPin },
    { value: QuestionType.INFO_URL, label: "Website", icon: Link2 },
    { value: QuestionType.CHOICE_SINGLE, label: "Single Choice", icon: CircleDot },
    { value: QuestionType.CHOICE_CHECKBOX, label: "Multiple Choice", icon: SquareCheckBig },
    // { value: QuestionType.dropdown, label: "Dropdown", icon: ChevronsUpDown },
    { value: QuestionType.FILE_ANY, label: "File Upload", icon: FileText },
    { value: QuestionType.RATING_STAR, label: "Star Rating", icon: Star },
    // { value: QuestionType.barChoiceRating, label: "Rating Scale", icon: ChartBarBig },
    // { value: QuestionType.imageChoiceRating, label: "Image Choice", icon: Images },
    { value: QuestionType.CHOICE_BOOL, label: "pending", icon: Star },
    { value: QuestionType.CHOICE_DROPDOWN, label: "pending", icon: Star },
    { value: QuestionType.CHOICE_MULTIPLE, label: "pending", icon: Star },
    { value: QuestionType.CHOICE_PICTURE, label: "pending", icon: Star },
    { value: QuestionType.FILE_IMAGE_OR_VIDEO, label: "pending", icon: Star },
    { value: QuestionType.SCREEN_WELCOME, label: "pending", icon: Star },
    { value: QuestionType.SCREEN_END, label: "pending", icon: Star },
    { value: QuestionType.SCREEN_STATEMENT, label: "pending", icon: Star },
    { value: QuestionType.RATING_RANK, label: "pending", icon: Star },
    { value: QuestionType.RATING_ZERO_TO_TEN, label: "pending", icon: Star },
    { value: QuestionType.LEAGAL, label: "pending", icon: Star },
    { value: QuestionType.REDIRECT_TO_URL, label: "pending", icon: Star },
];

export default function QuestionTypeDropdown() {
    const { selectedQuestion, selectedQuestionId, updateQuestion } = useFormBuilder();

    const onChange = useCallback((value: QuestionType) => {
        if (selectedQuestionId) updateQuestion(selectedQuestionId, { type: value });
    }, [selectedQuestionId, updateQuestion]);

    return (
        <div className="space-y-4">
            <Label>Question Type</Label>
            <Select value={selectedQuestion?.type} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                        <SelectValue placeholder='Select Question Type' />
                    </div>
                </SelectTrigger>
                <SelectContent className="w-56">
                    {questionTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                    <Icon size={16} />
                                    <span>{type.label}</span>
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div >
    );
}
