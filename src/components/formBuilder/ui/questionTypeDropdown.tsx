import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eQuestionType } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Calendar, CaseSensitive, ChartBarBig, ChevronsUpDown, CircleDot, FileText, Hash, Images, Link2, Mail, MapPin, Phone, SquareCheckBig, Star } from "lucide-react";
import { useCallback } from "react";

const questionTypes = [
    { value: eQuestionType.shortText, label: "Short Text", icon: CaseSensitive },
    { value: eQuestionType.longText, label: "Long Text", icon: CaseSensitive },
    { value: eQuestionType.number, label: "Number", icon: Hash },
    { value: eQuestionType.date, label: "Date", icon: Calendar },
    { value: eQuestionType.email, label: "Email", icon: Mail },
    { value: eQuestionType.phone, label: "Phone", icon: Phone },
    { value: eQuestionType.address, label: "Address", icon: MapPin },
    { value: eQuestionType.website, label: "Website", icon: Link2 },
    { value: eQuestionType.radio, label: "Multiple Choice", icon: CircleDot },
    { value: eQuestionType.checkbox, label: "Checkbox", icon: SquareCheckBig },
    { value: eQuestionType.dropdown, label: "Dropdown", icon: ChevronsUpDown },
    { value: eQuestionType.file, label: "File Upload", icon: FileText },
    { value: eQuestionType.starRating, label: "Star Rating", icon: Star },
    { value: eQuestionType.barChoiceRating, label: "Rating Scale", icon: ChartBarBig },
    { value: eQuestionType.imageChoiceRating, label: "Image Choice", icon: Images },
];

export default function QuestionTypeDropdown() {
    const { selectedQuestion, selectedQuestionId, updateQuestion } = useFormBuilder();

    const onChange = useCallback((value: eQuestionType) => {
        if (selectedQuestionId) updateQuestion(selectedQuestionId, { type: value });
    }, [selectedQuestionId, updateQuestion]);

    return (
        <div className="space-y-3">
            <Label>Type</Label>
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
