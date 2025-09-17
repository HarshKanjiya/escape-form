"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder } from "@/store/useFormBuilder";
import { useEffect, useState } from "react";
import CountryDropdown from "../../ui/countryDropdown";

export function PhoneFieldConfig() {
    const { updateQuestion, selectedQuestion } = useFormBuilder();

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);
    const [international, setInternational] = useState(selectedQuestion?.validation?.allowAnyCountry || false);
    const [country, setCountry] = useState<any>(undefined);

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (international != selectedQuestion?.validation?.allowAnyCountry) updateQuestion(selectedQuestion?.id || '', { validation: { allowAnyCountry: international } });
    }, [international]);

    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={setRequired} />
            </div>
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="phone-international">Any Country</Label>
                <Switch id="phone-international" checked={international} onCheckedChange={setInternational} />
            </div>
            {
                !international && (
                    <div className="flex items-center justify-between">
                        <CountryDropdown value={country} onChange={setCountry} />
                    </div>
                )
            }
        </div>
    );
}
