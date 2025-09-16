"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder } from "@/store/useFormBuilder";
import { useEffect, useState } from "react";

export function EmailFieldConfig() {
    const { updateQuestion, selectedQuestion } = useFormBuilder();

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={setRequired} />
            </div>
        </div>
    );
}
