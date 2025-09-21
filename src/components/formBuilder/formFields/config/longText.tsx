"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function LongTextFieldConfig() {

    const { updateQuestion, selectedQuestion } = useFormBuilder();
    const [touched, setTouched] = useState(false);

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);
    const [minLenValidation, setMinLenValidation] = useState<boolean>(!!selectedQuestion?.validation?.min);
    const [maxLenValidation, setMaxLenValidation] = useState<boolean>(!!selectedQuestion?.validation?.max);

    // values
    const [minLength, setMinLength] = useState<number>(Number(selectedQuestion?.validation?.min) || 0);
    const [maxLength, setMaxLength] = useState<number>(Number(selectedQuestion?.validation?.max) || 0);

    const minLenRef = useRef<HTMLInputElement>(null);
    const maxLenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (!touched) return;
        if (!minLenValidation && selectedQuestion?.validation?.min && selectedQuestion?.id) {
            updateQuestion(selectedQuestion?.id, { validation: { ...selectedQuestion?.validation, min: undefined } });
            setMinLength(0);
        }
        else if (minLenValidation && minLenRef.current) {
            minLenRef.current?.focus();
            minLenRef.current?.select();
        }
    }, [minLenValidation]);

    useEffect(() => {
        if (!touched) return;
        if (!maxLenValidation && selectedQuestion?.validation?.max && selectedQuestion?.id) {
            updateQuestion(selectedQuestion?.id, { validation: { ...selectedQuestion?.validation, max: undefined } });
            setMaxLength(0);
        }
        else if (maxLenValidation && maxLenRef.current) {
            maxLenRef.current?.focus();
            maxLenRef.current?.select();

        }
    }, [maxLenValidation]);

    const onFieldBlur = (fieldName: 'min' | 'max') => {
        setTouched(true);
        switch (fieldName) {
            case 'min':
                if (selectedQuestion?.validation?.min != minLength && minLength && selectedQuestion?.id) updateQuestion(selectedQuestion?.id, { validation: { ...selectedQuestion?.validation, min: minLenValidation ? minLength : undefined } });
                break;
            case 'max':
                if (selectedQuestion?.validation?.max != maxLength && maxLength && selectedQuestion?.id) updateQuestion(selectedQuestion?.id, { validation: { ...selectedQuestion?.validation, max: maxLenValidation ? maxLength : undefined } });
                break;
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value;
        value = value.replace(/[^\d]/g, '');
        value = value.replace(/^0+/, '') || '0';
        e.currentTarget.value = value;
    };

    const onRequireChange = (value: boolean) => {
        setTouched(true);
        setRequired(value);
    }

    const onMinToggleChange = (value: boolean) => {
        setTouched(true);
        setMinLenValidation(value);
    }

    const onMaxToggleChange = (value: boolean) => {
        setTouched(true);
        setMaxLenValidation(value);
    }


    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={onRequireChange} />
            </div>
            <div className="flex items-center justify-between py-3">
                <Label htmlFor="short-text-min-max">Minimum Length
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger tabIndex={-1}>
                            <Info size={12} />
                        </TooltipTrigger>
                        <TooltipContent>
                            0 - 999999
                        </TooltipContent>
                    </Tooltip>
                </Label>
                <Switch id="short-text-min-max" checked={minLenValidation} onCheckedChange={onMinToggleChange} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    minLenValidation &&
                    <motion.div
                        layout
                        key={'min-length-div'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <Input className="my-2 mt-4" type="number" placeholder="Min Length" ref={minLenRef} value={minLength} onKeyDown={handleKeyDown}
                            onChange={(e) => setMinLength(Number(e.target.value))} onBlur={() => onFieldBlur('min')} onInput={handleInput} />
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
                {
                    (minLenValidation && selectedQuestion?.validation?.max) &&
                    <motion.small
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        layout key='min-warning' className="text-sm text-yellow-400/60 font-normal not-italic flex items-center gap-2 mt-2"><Info size={14} /> Must be in the range of 0 - {Number(selectedQuestion?.validation?.max)}</motion.small>
                }
            </AnimatePresence>
            <div className="flex items-center justify-between pt-3">
                <Label htmlFor="short-text-max">Maximum Length
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger tabIndex={-1}>
                            <Info size={12} />
                        </TooltipTrigger>
                        <TooltipContent>
                            {minLength || 0} - 999999
                        </TooltipContent>
                    </Tooltip>
                </Label>
                <Switch id="short-text-max" checked={maxLenValidation} onCheckedChange={onMaxToggleChange} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    maxLenValidation &&
                    <motion.div
                        layout
                        key={'max-length-div'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <Input className="my-2 mt-4" type="number" placeholder="Max Length" ref={maxLenRef} value={maxLength} onKeyDown={handleKeyDown}
                            onChange={(e) => setMaxLength(Number(e.target.value))} onBlur={() => onFieldBlur('max')} onInput={handleInput} />
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
                {
                    (minLenValidation && selectedQuestion?.validation?.min) &&
                    <motion.small
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        layout key='max-warning' className="text-sm text-yellow-400/60 font-normal not-italic flex items-center gap-2 mt-2"><Info size={14} /> Must be in the range of {Number(selectedQuestion?.validation?.min)} - 999999</motion.small>
                }
            </AnimatePresence>
        </div >
    );
}
