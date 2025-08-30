import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IQuestion } from "@/types/form";
import { MapPin } from "lucide-react";

interface AddressProps {
    question: IQuestion;
    value?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    onChange?: (value: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    }) => void;
    disabled?: boolean;
}

export function Address({ question, value = {}, onChange, disabled = false }: AddressProps) {
    const handleFieldChange = (field: string, fieldValue: string) => {
        onChange?.({
            ...value,
            [field]: fieldValue
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">
                    {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {question.description && (
                    <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                )}
            </div>

            <div className="space-y-3">
                {/* Street Address */}
                <div className="relative">
                    <Label htmlFor={`${question.id}-street`} className="text-xs text-muted-foreground">
                        Street Address
                    </Label>
                    <Textarea
                        id={`${question.id}-street`}
                        placeholder="Enter street address..."
                        value={value.street || ""}
                        onChange={(e) => handleFieldChange("street", e.target.value)}
                        disabled={disabled}
                        className="w-full min-h-[60px] resize-none"
                        rows={2}
                    />
                    <MapPin className="absolute right-3 top-8 h-4 w-4 text-muted-foreground" />
                </div>

                {/* City and State Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor={`${question.id}-city`} className="text-xs text-muted-foreground">
                            City
                        </Label>
                        <Input
                            id={`${question.id}-city`}
                            placeholder="Enter city..."
                            value={value.city || ""}
                            onChange={(e) => handleFieldChange("city", e.target.value)}
                            disabled={disabled}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor={`${question.id}-state`} className="text-xs text-muted-foreground">
                            State/Province
                        </Label>
                        <Input
                            id={`${question.id}-state`}
                            placeholder="Enter state..."
                            value={value.state || ""}
                            onChange={(e) => handleFieldChange("state", e.target.value)}
                            disabled={disabled}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* ZIP Code and Country Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor={`${question.id}-zipCode`} className="text-xs text-muted-foreground">
                            ZIP/Postal Code
                        </Label>
                        <Input
                            id={`${question.id}-zipCode`}
                            placeholder="Enter ZIP code..."
                            value={value.zipCode || ""}
                            onChange={(e) => handleFieldChange("zipCode", e.target.value)}
                            disabled={disabled}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor={`${question.id}-country`} className="text-xs text-muted-foreground">
                            Country
                        </Label>
                        <Input
                            id={`${question.id}-country`}
                            placeholder="Enter country..."
                            value={value.country || ""}
                            onChange={(e) => handleFieldChange("country", e.target.value)}
                            disabled={disabled}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
