"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export function RadioFieldConfig() {

    const { updateQuestion, selectedQuestion } = useFormBuilder();
    const [touched, setTouched] = useState(false);

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);
    const [randomize, setRandomize] = useState(selectedQuestion?.validation?.randomize || false);

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (!touched) return;
        updateQuestion(selectedQuestion?.id || '', { validation: { randomize } });
    }, [randomize]);

    const onRequireChange = (value: boolean) => {
        setTouched(true);
        setRequired(value);
    }

    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={onRequireChange} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="short-text-randomize">Randomize
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger tabIndex={-1}>
                            <Info size={12} />
                        </TooltipTrigger>
                        <TooltipContent>
                            Randomize the order of the options
                        </TooltipContent>
                    </Tooltip>
                </Label>
                <Switch id="short-text-randomize" checked={randomize} onCheckedChange={setRandomize} />
            </div>
        </div>
    );
}
