"use client";

import * as React from "react";
import { Check, Globe2, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CountryOption {
    code: string; // ISO 2
    dialCode: string; // +1, +91 etc
    name: string;
    flag: string; // Emoji flag
}

// Minimal curated list; can be expanded as needed.
export const COUNTRIES: CountryOption[] = [
    { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
    { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
    { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
    { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
    { code: "BR", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "ZA", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "NG", dialCode: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "ES", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "IT", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "SE", dialCode: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "NL", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "CH", dialCode: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "MX", dialCode: "+52", name: "Mexico", flag: "🇲🇽" },
];

export interface CountryDropdownProps {
    value?: string; // ISO 2 code
    onChange?: (value: string, country: CountryOption | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    showDialCode?: boolean; // whether to show dial code alongside name
    className?: string;
    popoverClassName?: string;
    buttonSize?: "sm" | "default";
    id?: string;
    include?: string[]; // restrict to subset
    exclude?: string[]; // exclude specific codes
}

// Helper to filter / produce list
const useFilteredCountries = (include?: string[], exclude?: string[]) => {
    return React.useMemo(() => {
        let list = COUNTRIES;
        if (include?.length) list = list.filter(c => include.includes(c.code));
        if (exclude?.length) list = list.filter(c => !exclude.includes(c.code));
        return list;
    }, [include, exclude]);
};

export const CountryDropdown: React.FC<CountryDropdownProps> = ({
    value,
    onChange,
    placeholder = "Select country",
    disabled,
    showDialCode = true,
    className,
    popoverClassName,
    buttonSize = "default",
    id,
    include,
    exclude,
}) => {
    const [open, setOpen] = React.useState(false);
    const countries = useFilteredCountries(include, exclude);
    const selected = countries.find(c => c.code === value);

    const handleSelect = (countryCode: string) => {
        const country = countries.find(c => c.code === countryCode);
        onChange?.(countryCode, country);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    size={buttonSize}
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Country selector"
                    disabled={disabled}
                    className={cn("w-full justify-between", className)}
                >
                    {selected ? (
                        <span className="flex items-center gap-2 truncate">
                            <span className="text-base leading-none">{selected.flag}</span>
                            <span className="text-sm font-medium truncate max-w-[140px]">{selected.name}</span>
                            {showDialCode && (
                                <span className="text-xs text-muted-foreground">{selected.dialCode}</span>
                            )}
                            <span className="text-[10px] rounded bg-muted px-1 py-0.5 tracking-wide text-foreground/70">
                                {selected.code}
                            </span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Globe2 className="h-4 w-4" />
                            <span className="text-sm">{placeholder}</span>
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("p-0 w-[340px]", popoverClassName)} align="start">
                <Command filter={(value, search) => {
                    const country = countries.find(c => c.code === value);
                    if (!country) return 0;
                    const target = `${country.name.toLowerCase()} ${country.code.toLowerCase()} ${country.dialCode}`;
                    return target.includes(search.toLowerCase()) ? 1 : 0;
                }}>
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup heading="Countries">
                            {countries.map(c => (
                                <CommandItem
                                    key={c.code}
                                    value={c.code}
                                    keywords={[c.name, c.dialCode, c.code]}
                                    onSelect={val => handleSelect(val.toUpperCase())}
                                >
                                    <span className="flex items-center gap-3 w-full">
                                        <span className="text-lg leading-none w-6 text-center">{c.flag}</span>
                                        <span className="flex flex-col items-start flex-1 truncate">
                                            <span className="text-sm font-medium leading-tight truncate">{c.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{c.code} {showDialCode && `• ${c.dialCode}`}</span>
                                        </span>
                                        <span className={cn(
                                            "ml-auto flex items-center justify-center transition-opacity",
                                            value === c.code ? "opacity-100" : "opacity-0"
                                        )}>
                                            <Check className="h-4 w-4 text-primary" />
                                        </span>
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

/**
 * Usage Example:
 * <CountryDropdown value={country} onChange={(code, c) => setCountry(code)} />
 */
export default CountryDropdown;

