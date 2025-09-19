"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multiSelect";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COUNTRIES } from "@/constants/common";
import { cn } from "@/lib/utils";
import { CountryOption } from "@/types/common";
import { Check, ChevronsUpDown, Globe2 } from "lucide-react";
import * as React from "react";


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

// Multi-select version
export interface CountryMultiSelectProps {
    values: string[]; // ISO codes
    onChange?: (codes: string[], countries: CountryOption[]) => void;
    placeholder?: string;
    disabled?: boolean;
    showDialCode?: boolean;
    className?: string;
    popoverClassName?: string; // kept for parity (unused but accepted)
    buttonSize?: "sm" | "default";
    id?: string;
    include?: string[];
    exclude?: string[];
    /** show code badge inside trigger summary */
    showCodesInTrigger?: boolean;
}

export const CountryMultiSelect: React.FC<CountryMultiSelectProps> = ({
    values,
    onChange,
    placeholder = "Select countries",
    disabled,
    showDialCode = true,
    className,
    buttonSize = "default",
    id,
    include,
    exclude,
    showCodesInTrigger = false,
}) => {
    const countries = useFilteredCountries(include, exclude);

    const options: MultiSelectOption[] = React.useMemo(() => countries.map(c => ({
        label: c.name,
        value: c.code,
        meta: c,
    })), [countries]);

    const handleChange = (codes: string[]) => {
        const selectedCountries = countries.filter(c => codes.includes(c.code));
        onChange?.(codes, selectedCountries);
    };

    return (
        <MultiSelect
            options={options}
            value={values}
            onChange={handleChange}
            placeholder={placeholder}
            className={className}
            triggerVariant="outline"
            triggerSize={buttonSize}
            triggerClassName="justify-between"
            renderTriggerValue={(selected) => {
                if (!selected.length) return null;
                if (selected.length === 1) {
                    const c = selected[0].meta as CountryOption;
                    return (
                        <span className="flex items-center gap-2 truncate">
                            <span className="text-base leading-none">{c.flag}</span>
                            <span className="text-sm font-medium truncate max-w-[140px]">{c.name}</span>
                            {showDialCode && (
                                <span className="text-xs text-muted-foreground">{c.dialCode}</span>
                            )}
                            <span className="text-[10px] rounded bg-muted px-1 py-0.5 tracking-wide text-foreground/70">{c.code}</span>
                        </span>
                    );
                }
                // multiple summary
                return (
                    <span className="flex items-center gap-1 flex-wrap text-left">
                        {selected.slice(0, 3).map(s => {
                            const c = s.meta as CountryOption; return (
                                <span key={c.code} className="flex items-center gap-1 rounded bg-muted/60 px-1 py-0.5 text-xs">
                                    <span>{c.flag}</span>
                                    <span className="font-medium">{c.code}</span>
                                </span>
                            );
                        })}
                        {selected.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{selected.length - 3} more</span>
                        )}
                    </span>
                );
            }}
            renderOption={(option, selected) => {
                const c = option.meta as CountryOption;
                return (
                    <span className="flex items-center gap-3 w-full">
                        <span className="text-lg leading-none w-6 text-center">{c.flag}</span>
                        <span className="flex flex-col items-start flex-1 truncate">
                            <span className="text-sm font-medium leading-tight truncate">{c.name}</span>
                            <span className="text-[10px] text-muted-foreground">{c.code} {showDialCode && `• ${c.dialCode}`}</span>
                        </span>
                        <span className={cn(
                            "ml-auto flex items-center justify-center transition-opacity",
                            selected ? "opacity-100" : "opacity-0"
                        )}>
                            <Check className="h-4 w-4 text-primary" />
                        </span>
                    </span>
                );
            }}
            contentClassName="p-0 w-full"
            disabled={disabled}
        />
    );
};

/**
 * Usage Example:
 * <CountryDropdown value={country} onChange={(code, c) => setCountry(code)} />
 */
export default CountryDropdown;

/**
 * Multi-select usage example:
 * const [countries, setCountries] = React.useState<string[]>([]);
 * <CountryMultiSelect values={countries} onChange={(codes, list) => setCountries(codes)} />
 */

