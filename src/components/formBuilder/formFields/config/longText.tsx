"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function LongTextConfig() {
    const { updateQuestion, selectedQuestion } = useFormBuilder();

    const [required, setRequired] = useState(selectedQuestion?.required || false);
    const [minLenValidation, setminLenValidation] = useState(!!selectedQuestion?.validation?.min);
    const [maxLenValidation, setmaxLenValidation] = useState(!!selectedQuestion?.validation?.max);
    const [minLength, setMinLength] = useState<number>(Number(selectedQuestion?.validation?.min) || 0);
    const [maxLength, setMaxLength] = useState<number>(Number(selectedQuestion?.validation?.max) || 0);

    const minLenRef = useRef<HTMLInputElement>(null);
    const maxLenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setRequired(selectedQuestion?.required || false);
    }, [selectedQuestion]);

    useEffect(() => {
        updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (!minLenValidation && selectedQuestion?.validation?.min) updateQuestion(selectedQuestion?.id!, { validation: { ...selectedQuestion?.validation, min: undefined } });
        else if (minLenRef) minLenRef.current?.focus();
    }, [minLenValidation]);
    useEffect(() => {
        if (!maxLenValidation && selectedQuestion?.validation?.max) updateQuestion(selectedQuestion?.id!, { validation: { ...selectedQuestion?.validation, max: undefined } });
        else if (maxLenRef) maxLenRef.current?.focus();
    }, [maxLenValidation]);

    const onFieldBlur = (fieldName: 'min' | 'max') => {
        switch (fieldName) {
            case 'min':
                if (selectedQuestion?.validation?.min != minLength && minLength) updateQuestion(selectedQuestion?.id!, { validation: { ...selectedQuestion?.validation, min: minLenValidation ? minLength : undefined } });
                break;
            case 'max':
                if (selectedQuestion?.validation?.max != maxLength && maxLength) updateQuestion(selectedQuestion?.id!, { validation: { ...selectedQuestion?.validation, max: maxLenValidation ? maxLength : undefined } });
                break;
        }
    }
    return (
        <div className="flex flex-col overflow-clip">
            <div className="flex items-center justify-between py-3">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={setRequired} />
            </div>
            <div className="flex items-center justify-between py-3">
                <Label htmlFor="short-text-min-max">Minimum Range
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger>
                            <Info size={12} />
                        </TooltipTrigger>
                        <TooltipContent>
                            0 - 999999
                        </TooltipContent>
                    </Tooltip>
                </Label>
                <Switch id="short-text-min-max" checked={minLenValidation} onCheckedChange={setminLenValidation} />
            </div>
            <AnimatePresence mode="wait">
                {
                    minLenValidation &&
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <Input className="my-2" type="number" placeholder="Min Length" ref={minLenRef} value={minLength} onChange={(e) => setMinLength(Number(e.target.value))} onBlur={() => onFieldBlur('min')} />
                    </motion.div>
                }
            </AnimatePresence>
            <div className="flex items-center justify-between py-3">
                <Label htmlFor="short-text-max">Maximum Range
                    <Tooltip delayDuration={200}>
                        <TooltipTrigger>
                            <Info size={12} />
                        </TooltipTrigger>
                        <TooltipContent>
                            0 - 999999
                        </TooltipContent>
                    </Tooltip>
                </Label>
                <Switch id="short-text-max" checked={maxLenValidation} onCheckedChange={setmaxLenValidation} />
            </div>
            <AnimatePresence mode="wait">
                {
                    maxLenValidation &&
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <Input className="my-2" type="number" placeholder="Max Length" ref={maxLenRef} value={maxLength} onChange={(e) => setMaxLength(Number(e.target.value))} onBlur={() => onFieldBlur('max')} />
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
}
