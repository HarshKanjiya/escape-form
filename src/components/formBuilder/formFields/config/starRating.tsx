"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export function StarRatingFieldConfig() {
    const { updateQuestion, selectedQuestion } = useFormBuilder();

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);
    const [starCount, setStarCount] = useState(selectedQuestion?.validation?.starCount || 5);
    const [tempStarCount, setTempStarCount] = useState(starCount);


    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (starCount != selectedQuestion?.validation?.starCount) updateQuestion(selectedQuestion?.id || '', { validation: { ...selectedQuestion?.validation, starCount } });
    }, [starCount]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    const onFieldBlur = () => {
        if (tempStarCount < 3) setTempStarCount(3);
        setStarCount(tempStarCount);
        updateQuestion(selectedQuestion?.id || '', { validation: { ...selectedQuestion?.validation, starCount: tempStarCount } });
    }

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value;
        value = value.replace(/[^\d]/g, '');
        value = value.replace(/^0+/, '') || '0';
        if (Number(value) > 10) {
            value = '10';
        } else if (Number(value) && Number(value) < 3) {
            value = '3';
        }
        e.currentTarget.value = value;
    };

    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between pb-4">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={setRequired} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="short-text-min-max">Star Count
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger tabIndex={-1}>
                            <Info size={12} />
                        </TooltipTrigger>
                        <TooltipContent>
                            0 - 10 stars
                        </TooltipContent>
                    </Tooltip>

                </Label>
                <Input className="my-2 mt-4" type="number" placeholder="Min Length" value={tempStarCount} onKeyDown={handleKeyDown}
                    onChange={(e) => setTempStarCount(Number(e.target.value))} onBlur={onFieldBlur} onInput={handleInput} />
            </div>
        </div>
    );
}
