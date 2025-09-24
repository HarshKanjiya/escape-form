"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function DetailConfig() {

    const { updateQuestion, selectedQuestion } = useFormBuilder();
    const [touched, setTouched] = useState(false);

    // values
    const [userConsentRequired, setUserConsentRequired] = useState(selectedQuestion?.validation?.userConsentRequired || false);
    const [userConsentText, setUserConsentText] = useState(selectedQuestion?.validation?.userConsentText || '');
    const [text, setText] = useState<string>(selectedQuestion?.validation?.detailBtnText || '');

    const consentRef = useRef<HTMLInputElement>(null);


    // useEffect(() => {
    //     if (selectedQuestion?.id && userConsentRequired != selectedQuestion?.validation?.userConsentRequired) updateQuestion(selectedQuestion?.id, { validation: { ...selectedQuestion?.validation, userConsentRequired, userConsentText: undefined } });
    // }, [userConsentRequired]);


    useEffect(() => {
        if (!touched || !selectedQuestion?.id) return;
        if (!userConsentRequired) {
            updateQuestion(selectedQuestion?.id, { validation: { ...selectedQuestion?.validation, userConsentText: undefined, userConsentRequired: false } });
            setUserConsentText('');
        }
        else if (userConsentRequired && consentRef.current) {
            consentRef.current?.focus();
            consentRef.current?.select();
        }
    }, [userConsentRequired]);

    const onFieldBlur = (field: 'btntext' | 'consent') => {
        setTouched(true);

        switch (field) {
            case 'btntext':
                if (!selectedQuestion || text == selectedQuestion?.validation?.detailBtnText) return;
                updateQuestion(selectedQuestion!.id, {
                    validation: {
                        ...selectedQuestion?.validation,
                        detailBtnText: text || undefined
                    }
                });
                break;
            case 'consent':
                if (!selectedQuestion || userConsentText == selectedQuestion?.validation?.userConsentText) return;
                updateQuestion(selectedQuestion!.id, {
                    validation: {
                        ...selectedQuestion?.validation,
                        userConsentText: userConsentText || undefined
                    }
                });
                break;
        }
    }


    const onToggleChange = (value: boolean) => {
        setTouched(true);
        setUserConsentRequired(value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    const inputFn = (e: React.FormEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value;
        if (value.length > 50) value = value.slice(0, 50);
        setText(value);
    }

    const consentInputFn = (e: React.FormEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value;
        if (value.length > 50) value = value.slice(0, 50);
        setUserConsentText(value);
    }

    return (
        <div className="flex flex-col overflow-y-clip pb-1">
            <div className="flex items-center justify-between pb-3">
                <Label htmlFor="short-text-required">User Consent</Label>
                <Switch id="short-text-required" checked={userConsentRequired} onCheckedChange={onToggleChange} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {
                    userConsentRequired &&
                    <motion.div
                        layout
                        key={'min-length-div'}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <Input className="my-2 mt-4" placeholder="User Consent" ref={consentRef} value={userConsentText} onKeyDown={handleKeyDown}
                            onChange={(e) => setUserConsentText(e.target.value)} onBlur={() => onFieldBlur('consent')} onInput={consentInputFn} />
                    </motion.div>
                }
            </AnimatePresence>
            <div className="space-y-2">
                <Label htmlFor="short-text-min-max">Button Text</Label>
                <div className="relative">
                    <Input className="my-2 mt-4 pr-14" type="text" placeholder="Continue" value={text} onInput={inputFn}
                        onBlur={() => onFieldBlur('btntext')} onKeyDown={handleKeyDown} />
                    <span className="absolute right-2 bottom-2 text-xs text-muted-foreground">{text.length}/50</span>
                </div>
            </div>

        </div>
    );
}
