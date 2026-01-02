import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionType } from "@prisma/client";
import { useFormBuilder } from "@/store/useFormBuilder";
import { useCallback } from "react";
import { QUESTION_TYPES } from "@/constants/common";

export default function QuestionTypeDropdown() {

    const selectedQuestion = useFormBuilder((state) => state.selectedQuestion);
    const selectedQuestionId = useFormBuilder((state) => state.selectedQuestionId);
    const updateQuestion = useFormBuilder((state) => state.updateQuestion);

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
                    {QUESTION_TYPES.map((type) => {
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
