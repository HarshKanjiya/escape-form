"use client";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useFormBuilder } from "@/store/useFormBuilder";
import { IAddress } from "@/types/form";
import { useEffect, useState } from "react";

export function AddressFieldConfig() {

    const { updateQuestion, selectedQuestion } = useFormBuilder();

    // toggles
    const [required, setRequired] = useState(selectedQuestion?.required);
    const [add, setAdd] = useState<IAddress>(selectedQuestion?.validation?.add || {});

    useEffect(() => {
        if (required != selectedQuestion?.required) updateQuestion(selectedQuestion?.id || '', { required });
    }, [required]);

    useEffect(() => {
        if (add != selectedQuestion?.validation?.add) updateQuestion(selectedQuestion?.id || '', { validation: { add } });
    }, [add]);

    return (
        <div className="flex flex-col overflow-y-clip">
            <div className="flex items-center justify-between">
                <Label htmlFor="short-text-required">Required</Label>
                <Switch id="short-text-required" checked={required} onCheckedChange={setRequired} />
            </div>
            <Separator className="my-3" />
            <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between border-b px-2 py-1.5">
                    <span>Field</span>
                    <span>Required</span>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="address">Address</Label>
                    <Switch id="address" checked={add.address || false} onCheckedChange={(value) => setAdd({ ...add, address: value })} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="address2">Address 2</Label>
                    <Switch id="address2" checked={add.address2 || false} onCheckedChange={(value) => setAdd({ ...add, address2: value })} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="city">City</Label>
                    <Switch id="city" checked={add.city || false} onCheckedChange={(value) => setAdd({ ...add, city: value })} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="state">State</Label>
                    <Switch id="state" checked={add.state || false} onCheckedChange={(value) => setAdd({ ...add, state: value })} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="country">Country</Label>
                    <Switch id="country" checked={add.country || false} onCheckedChange={(value) => setAdd({ ...add, country: value })} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="zip">Zip</Label>
                    <Switch id="zip" checked={add.zip || false} onCheckedChange={(value) => setAdd({ ...add, zip: value })} />
                </div>
            </div>
        </div>
    );
}
