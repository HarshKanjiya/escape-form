"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multiSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder } from "@/store/useFormBuilder";
import { fileTypes } from "@/types/form";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function FileUploadFieldConfig() {

    const { updateQuestion, selectedQuestion } = useFormBuilder();
    const [touched, setTouched] = useState(false);

    // toggles
    const [required, setRequired] = useState<boolean>(!!selectedQuestion?.required);
    const [isMaxSize, setIsMaxSize] = useState<boolean>(!!selectedQuestion?.metadata?.maxSizeMB);
    const [isAnyType, setIsAnyType] = useState<boolean>(selectedQuestion?.metadata?.anyFileType ?? true);

    // values
    const [maxSizeMB, setMaxSizeMB] = useState<number | undefined>(selectedQuestion?.metadata?.maxSizeMB || 10);
    const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(selectedQuestion?.metadata?.allowedFileTypes || []);

    const sizeRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (!touched) return;
        if (!isMaxSize && selectedQuestion?.metadata?.maxSizeMB && selectedQuestion?.id) {
            updateQuestion(selectedQuestion?.id, { metadata: { ...selectedQuestion?.metadata, maxSizeMB: undefined } });
            setMaxSizeMB(undefined);
        } else if (isMaxSize && sizeRef.current) {
            sizeRef.current?.focus();
            sizeRef.current?.select();
        }
    }, [isMaxSize]);

    useEffect(() => {
        if (!touched) return;
        if (!isAnyType && selectedQuestion?.metadata?.anyFileType && selectedQuestion?.id) {
            updateQuestion(selectedQuestion?.id, { metadata: { ...selectedQuestion?.metadata, anyFileType: false, allowedFileTypes: [] } });
            setAllowedFileTypes([]);
        } else if (!isAnyType && typeRef.current) typeRef.current?.focus();

    }, [isAnyType]);

    useEffect(() => {
        if (!touched) return;
        if (allowedFileTypes.length != 0) {
            if (selectedQuestion?.id) updateQuestion(selectedQuestion?.id, { metadata: { ...selectedQuestion?.metadata, allowedFileTypes } });
        }

    }, [allowedFileTypes]);

    const onFieldBlur = () => {
        setTouched(true);
        if (selectedQuestion?.metadata?.maxSizeMB != maxSizeMB && selectedQuestion?.id) updateQuestion(selectedQuestion?.id, { metadata: { ...selectedQuestion?.metadata, maxSizeMB: isMaxSize ? maxSizeMB : undefined } });
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

    const onIsMaxSizeChange = (value: boolean) => {
        setTouched(true);
        setIsMaxSize(value);
    };

    const onIsAnyTypeChanged = (value: boolean) => {
        setTouched(true);
        setIsAnyType(value);
    }

    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={onRequireChange} />
            </div>
            <div className="flex items-center justify-between py-3">
                <Label htmlFor="short-text-min-max">Maximum File Size (MB)</Label>
                <Switch id="short-text-min-max" checked={isMaxSize} onCheckedChange={onIsMaxSizeChange} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    isMaxSize &&
                    <motion.div
                        layout
                        key={'min-length-div'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <Input className="my-2 mt-4" type="number" placeholder="Max Size" ref={sizeRef} value={maxSizeMB} onKeyDown={handleKeyDown}
                            onChange={(e) => setMaxSizeMB(Number(e.target.value))} onBlur={onFieldBlur} onInput={handleInput} />
                    </motion.div>
                }
            </AnimatePresence>
            <div className="flex items-center justify-between pt-3">
                <Label htmlFor="short-text-max">Any File Type Allowed</Label>
                <Switch id="short-text-max" checked={isAnyType} onCheckedChange={onIsAnyTypeChanged} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    !isAnyType &&
                    <motion.div
                        layout
                        key={'max-length-div'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <MultiSelect
                            options={fileTypes}
                            value={allowedFileTypes}
                            onChange={setAllowedFileTypes}
                            placeholder="Select file types"
                            className="w-full my-2 mt-4"
                        />
                    </motion.div>
                }
            </AnimatePresence>
        </div >
    );
}
