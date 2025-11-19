"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CountryMultiSelect } from "../../ui/countryDropdown";

export function PhoneFieldConfig() {
    const { updateQuestion, selectedQuestion } = useFormBuilder();

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);
    const [anyCountry, setAnyCountry] = useState(selectedQuestion?.metadata?.allowAnyCountry || false);
    const [countries, setCountry] = useState<string[]>(selectedQuestion?.metadata?.allowedCountries || []);

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (anyCountry != selectedQuestion?.metadata?.allowAnyCountry) {
            if (anyCountry) {
                updateQuestion(selectedQuestion?.id || '', { metadata: { allowAnyCountry: true, allowedCountries: [] } });
                setCountry([]);
            }
            else {
                updateQuestion(selectedQuestion?.id || '', { metadata: { allowAnyCountry: false, allowedCountries: countries } });
            }
        }
    }, [anyCountry]);

    useEffect(() => {
        if (countries.length && countries != selectedQuestion?.metadata?.allowedCountries) {
            updateQuestion(selectedQuestion?.id || '', { metadata: { allowAnyCountry: false, allowedCountries: countries } });
        }
    }, [countries]);

    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={setRequired} />
            </div>
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="phone-international">Any Country</Label>
                <Switch id="phone-international" checked={anyCountry} onCheckedChange={setAnyCountry} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    !anyCountry && (
                        <motion.div
                            layout
                            key={'min-length-div'}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <CountryMultiSelect values={countries} onChange={setCountry} />
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    );
}
