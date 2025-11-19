"use client";

import { DatePicker } from "@/components/ui/datePicker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DateFieldConfig() {

    const { updateQuestion, selectedQuestion } = useFormBuilder();
    const [touched, setTouched] = useState(false);

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);
    const [minDateValidation, setMinDateValidation] = useState<boolean>(!!selectedQuestion?.metadata?.min);
    const [maxDateValidation, setMaxDateValidation] = useState<boolean>(!!selectedQuestion?.metadata?.max);

    // values
    const [minDate, setMinDate] = useState<Date | null>(selectedQuestion?.metadata?.min !== undefined ? new Date(selectedQuestion.metadata.min) : null);
    const [maxDate, setMaxDate] = useState<Date | null>(selectedQuestion?.metadata?.max !== undefined ? new Date(selectedQuestion.metadata.max) : null);

    const minDateRef = useRef<HTMLButtonElement>(null);
    const maxDateRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (!touched) return;
        if (!minDateValidation && selectedQuestion?.metadata?.min && selectedQuestion?.id) {
            updateQuestion(selectedQuestion?.id, { metadata: { ...selectedQuestion?.metadata, min: undefined } });
            setMinDate(null);
        }
        else if (minDateValidation && minDateRef.current) {
            setTimeout(() => minDateRef.current?.focus(), 0);
        }
    }, [minDateValidation]);

    useEffect(() => {
        if (!touched) return;
        if (!maxDateValidation && selectedQuestion?.metadata?.max && selectedQuestion?.id) {
            updateQuestion(selectedQuestion?.id, { metadata: { ...selectedQuestion?.metadata, max: undefined } });
            setMaxDate(null);
        }
        else if (maxDateValidation && maxDateRef.current) {
            setTimeout(() => maxDateRef.current?.focus(), 0);
        }
    }, [maxDateValidation]);

    const onRequireChange = (value: boolean) => {
        setTouched(true);
        setRequired(value);
    }

    const onMinToggleChange = (value: boolean) => {
        setTouched(true);
        setMinDateValidation(value);
    }

    const onMaxToggleChange = (value: boolean) => {
        setTouched(true);
        setMaxDateValidation(value);
    }


    return (
        <div className="flex flex-col overflow-y-clip pb-1">
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={onRequireChange} />
            </div>
            <div className="flex items-center justify-between py-3">
                <Label htmlFor="short-text-min-max">Minimum Date</Label>
                <Switch id="short-text-min-max" checked={minDateValidation} onCheckedChange={onMinToggleChange} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    minDateValidation &&
                    <motion.div
                        layout
                        key={'min-length-div'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <DatePicker className="mb-3 " ref={minDateRef} maxDate={maxDate || undefined} value={minDate || undefined} onChange={(date) => setMinDate(date || null)} />
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
                {
                    (minDateValidation && selectedQuestion?.metadata?.max) &&
                    <motion.small
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        layout key='min-warning' className="text-sm text-yellow-400/60 font-normal not-italic flex items-center gap-2 mt-2"><Info size={14} /> Must be in the range of 0 - {Number(selectedQuestion?.metadata?.max)}</motion.small>
                }
            </AnimatePresence>
            <div className="flex items-center justify-between pt-3">
                <Label htmlFor="short-text-max">Maximum Date</Label>
                <Switch id="short-text-max" checked={maxDateValidation} onCheckedChange={onMaxToggleChange} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    maxDateValidation &&
                    <motion.div
                        layout
                        key={'max-length-div'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <DatePicker className="mt-3" ref={maxDateRef} minDate={minDate || undefined} value={maxDate || undefined} onChange={(date) => setMaxDate(date || null)} />
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
                {
                    (minDateValidation && selectedQuestion?.metadata?.min) &&
                    <motion.small
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        layout key='max-warning' className="text-sm text-yellow-400/60 font-normal not-italic flex items-center gap-2 mt-2"><Info size={14} /> Must be in the range of {Number(selectedQuestion?.metadata?.min)} - 999999</motion.small>
                }
            </AnimatePresence>

        </div>
    );
}
