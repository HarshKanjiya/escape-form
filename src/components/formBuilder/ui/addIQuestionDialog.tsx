"use client";

import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Check, Plus, Search } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import QuestionIcon from "./questionIcon";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { QuestionType } from "@/generated/prisma";

interface IAddItemDialogProps {
    children?: React.ReactNode;
}

interface IItemProps {
    field: IField;
    selectedField: QuestionType | null;
    setSelectedField: (id: QuestionType) => void;
    onAdd: () => void;
}

const FieldItem = memo(function FieldItem({ field: { id, label, accent }, selectedField, setSelectedField, onAdd }: IItemProps) {
    const isSelected = selectedField === id;

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (isSelected) onAdd(); else setSelectedField(id);
        }
        if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) {
            e.preventDefault();
            const items = Array.from(document.querySelectorAll('[data-field-item="true"]')) as HTMLElement[];
            const currentIndex = items.findIndex(el => el === e.currentTarget);
            if (currentIndex === -1) return;
            const dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
            const nextIndex = (currentIndex + dir + items.length) % items.length;
            items[nextIndex]?.focus();
        }
    };

    return (
        <div
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            data-field-item="true"
            onKeyDown={handleKey}
            onClick={() => setSelectedField(id)}
            onDoubleClick={onAdd}
            className={cn(
                "group relative flex items-center gap-3 rounded-xl border p-2.5 text-sm outline-none cursor-pointer select-none transition-colors bg-background dark:bg-foreground/5",
                "hover:bg-muted/60 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40",
                isSelected && "border-primary/50 bg-primary/10 dark:bg-primary/15"
            )}
        >
            <div
                className={cn(
                    "flex size-8 items-center justify-center rounded-md border transition-colors",
                    accent,
                    "group-hover:brightness-110",
                    isSelected && "ring-1 ring-primary/60 border-primary/50"
                )}
            >
                <QuestionIcon questionType={id} size={18} />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-medium leading-tight truncate">{label}</span>
            </div>
            {isSelected && (
                <Check className="absolute right-2 top-2 size-4 text-primary" />
            )}
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent group-hover:ring-border/40" />
        </div>
    );
});

interface IFieldSet {
    title: string;
    description: string;
    items: IField[];
}

interface IField {
    label: string;
    id: QuestionType;
    accent: string; // accent color utility for icon background
    keywords?: string[]; // for search discoverability
}

// Field taxonomy – no static color classes; rely on theme tokens only
const fields: IFieldSet[] = [
    {
        title: 'Common',
        description: 'Basic input primitives',
        items: [
            { id: QuestionType.TEXT_SHORT, label: 'Short Text', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['text', 'single line'] },
            { id: QuestionType.TEXT_LONG, label: 'Long Text', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['text', 'paragraph'] },
            { id: QuestionType.NUMBER, label: 'Number', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['numeric', 'integer'] },
            { id: QuestionType.DATE, label: 'Date', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['calendar', 'time'] },
            { id: QuestionType.FILE_ANY, label: 'File Upload', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['attachment', 'upload'] },
            { id: QuestionType.USER_DETAIL, label: 'Detail Block', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['content', 'static'] },
        ]
    },
    {
        title: 'Choice Based',
        description: 'Select one or many options',
        items: [
            { id: QuestionType.CHOICE_SINGLE, label: 'Single Choice', accent: 'bg-emerald-400/40 dark:bg-emerald-400/25', keywords: ['radio', 'single'] },
            { id: QuestionType.CHOICE_MULTIPLE, label: 'Multiple Choice', accent: 'bg-emerald-400/40 dark:bg-emerald-400/25', keywords: ['multi', 'checkbox'] },
            { id: QuestionType.CHOICE_DROPDOWN, label: 'Dropdown', accent: 'bg-emerald-400/40 dark:bg-emerald-400/25' },
            { id: QuestionType.CHOICE_BOOL, label: 'Yes/No', accent: 'bg-emerald-400/40 dark:bg-emerald-400/25' },
            { id: QuestionType.CHOICE_CHECKBOX, label: 'Checkbox', accent: 'bg-emerald-400/40 dark:bg-emerald-400/25' },
        ]
    },
    {
        title: 'Contact Info',
        description: 'Collect respondent contact details',
        items: [
            { id: QuestionType.INFO_EMAIL, label: 'Email', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['contact', 'mail'] },
            { id: QuestionType.INFO_PHONE, label: 'Phone', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['contact', 'tel'] },
            { id: QuestionType.USER_ADDRESS, label: 'Address', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['location'] },
            { id: QuestionType.INFO_URL, label: 'Website', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['url'] },
        ]
    },
    {
        title: 'Rating',
        description: 'Measure sentiment or preference',
        items: [
            { id: QuestionType.RATING_STAR, label: 'Star Rating', accent: 'bg-indigo-400/60 dark:bg-indigo-400/30', keywords: ['rating', 'stars'] },
            { id: QuestionType.RATING_ZERO_TO_TEN, label: 'Rating Board', accent: 'bg-indigo-400/60 dark:bg-indigo-400/30', keywords: ['rating', 'scale'] },
            { id: QuestionType.RATING_RANK, label: 'Rank rating', accent: 'bg-indigo-400/60 dark:bg-indigo-400/30', keywords: ['image', 'choice'] },
        ]
    },
];

// Extra descriptions for preview panel
const fieldDescriptions: Record<QuestionType, string> = {

    [QuestionType.USER_DETAIL]: 'A static content block to show instructions or context.',
    [QuestionType.USER_ADDRESS]: 'Structured address entry (street, city, etc.).',

    [QuestionType.TEXT_SHORT]: 'Single line input suitable for names, short answers, tags.',
    [QuestionType.TEXT_LONG]: 'Multi-line text area for extended responses and feedback.',

    [QuestionType.NUMBER]: 'Numeric input with optional validation constraints.',
    [QuestionType.DATE]: 'Date picker for selecting a specific date.',

    [QuestionType.FILE_ANY]: 'Upload field to collect documents or images.',

    [QuestionType.CHOICE_SINGLE]: 'Let respondents choose exactly one option.',
    [QuestionType.CHOICE_CHECKBOX]: 'Allow multiple selections from a list of options.',

    [QuestionType.INFO_EMAIL]: 'Email address field with validation.',
    [QuestionType.INFO_PHONE]: 'International phone number input with validation.',
    [QuestionType.INFO_URL]: 'Website / URL field with protocol validation.',

    [QuestionType.RATING_STAR]: 'Collect a quick 1–5 star satisfaction rating.',
    // pending

    [QuestionType.CHOICE_BOOL]: 'Pending',
    [QuestionType.CHOICE_DROPDOWN]: 'Pending',
    [QuestionType.CHOICE_MULTIPLE]: 'Pending',
    [QuestionType.CHOICE_PICTURE]: 'Pending',
    [QuestionType.FILE_IMAGE_OR_VIDEO]: 'Pending',
    [QuestionType.SCREEN_WELCOME]: 'Pending',
    [QuestionType.SCREEN_END]: 'Pending',
    [QuestionType.SCREEN_STATEMENT]: 'Pending',
    [QuestionType.RATING_RANK]: 'Pending',
    [QuestionType.RATING_ZERO_TO_TEN]: 'Pending',
    [QuestionType.LEAGAL]: 'Pending',
    [QuestionType.REDIRECT_TO_URL]: 'Pending'
};


export default function AddQuestionDialog({ children }: IAddItemDialogProps) {
    const { createQuestions } = useFormBuilder();

    const [selectedField, setSelectedField] = useState<QuestionType | null>(null);
    const [open, setOpen] = useState(false);

    const [query, setQuery] = useState("");
    const [activeSection, setActiveSection] = useState<string>("All");

    // Add Event listner for ctrl + I
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const save = useCallback(() => {
        if (selectedField) {
            createQuestions([selectedField]);
            setSelectedField(null);
            setOpen(false);
            setQuery("");
            setActiveSection("All");
        }
    }, [selectedField]);

    const filteredSets = useMemo(() => {
        const lower = query.toLowerCase();
        const predicate = (f: IField) =>
            !lower || f.label.toLowerCase().includes(lower) || f.keywords?.some(k => k.includes(lower));

        return fields
            .map(set => ({
                ...set,
                items: set.items.filter(predicate)
            }))
            .filter(set => set.items.length > 0 || !query);
    }, [query]);

    const allVisibleItems = useMemo(() => {
        const setsToUse = activeSection === 'All' ? filteredSets : filteredSets.filter(s => s.title === activeSection);
        return setsToUse.flatMap(s => s.items);
    }, [filteredSets, activeSection]);

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setQuery(''); setActiveSection('All'); setSelectedField(null); } }}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Button variant={'secondary'} onClick={() => setOpen(true)}>
                                <Plus className="mr-1" />
                                <span>Add Field</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Add a new question field (Ctrl + I)
                        </TooltipContent>
                    </Tooltip>
                )}
            </DialogTrigger>
            <DialogContent className="w-full sm:min-w-[80vw] min-h-[70vh] lg:min-w-[70vw] xl:min-w-[60vw] p-0 overflow-hidden flex flex-col gap-0 max-h-[85vh]">
                <DialogTitle className="flex items-center justify-between gap-4 p-4 border-b text-base">
                    <span>Add New Field</span>
                </DialogTitle>
                <div className="flex flex-col md:flex-row flex-1 min-h-0 py-0 bg-accent-bg transition-opacity duration-150">
                    <div className="md:w-[58%] lg:w-[60%] xl:w-[65%] flex flex-col border-r min-h-0">
                        {/* Search & filters */}
                        <div className="p-4 pb-2 flex items-center gap-3 border-b bg-background">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search field types..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="pl-8 h-9"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {['All', ...fields.map(f => f.title)].map(section => {
                                    const active = activeSection === section;
                                    return (
                                        <button
                                            key={section}
                                            onClick={() => setActiveSection(section)}
                                            className={cn(
                                                "px-3 h-7 rounded-full border text-[11px] font-medium tracking-wide transition-all",
                                                "hover:bg-accent/60 hover:text-accent-foreground",
                                                active && "bg-primary/15 text-primary border-primary/40 dark:bg-primary/25"
                                            )}
                                        >
                                            {section}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Scrollable list */}
                        <div className="flex-1 overflow-auto p-4" role="listbox" aria-label="Question types" style={{ scrollBehavior: 'auto' }}>
                            {activeSection === 'All'
                                ? filteredSets.map((set, sIndex) => (
                                    <div key={sIndex} className="mb-6 last:mb-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                                {set.title}
                                                <span className="text-[11px] rounded-md bg-muted px-1.5 py-0.5 font-normal text-muted-foreground">
                                                    {set.items.length}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-muted-foreground hidden md:block max-w-[45%] truncate">{set.description}</p>
                                        </div>
                                        {set.items.length ? (
                                            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                                                {set.items.map(field => (
                                                    <FieldItem
                                                        key={field.id}
                                                        field={field}
                                                        selectedField={selectedField}
                                                        setSelectedField={setSelectedField}
                                                        onAdd={save}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground italic">No matches in this section.</div>
                                        )}
                                    </div>
                                ))
                                : (
                                    filteredSets.filter(f => f.title === activeSection).map(set => (
                                        <div key={set.title} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-sm">{set.title}</h4>
                                                <p className="text-xs text-muted-foreground max-w-[50%] truncate">{set.description}</p>
                                            </div>
                                            {set.items.length ? (
                                                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                                                    {set.items.map(field => (
                                                        <FieldItem
                                                            key={field.id}
                                                            field={field}
                                                            selectedField={selectedField}
                                                            setSelectedField={setSelectedField}
                                                            onAdd={save}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-muted-foreground italic">No matches found.</div>
                                            )}
                                        </div>
                                    ))
                                )}
                            {!allVisibleItems.length && (
                                <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-muted-foreground">
                                    <Search className="size-8 opacity-40" />
                                    <p className="text-sm">No field types match &quot;{query}&quot;</p>
                                    <Button variant="ghost" size="sm" onClick={() => setQuery("")}>Reset search</Button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Preview panel */}
                    <div className="hidden md:flex flex-col flex-1 min-h-0 bg-background transition-opacity duration-150">
                        {/* <div className="p-4 border-b">
                            <h3 className="text-sm font-semibold tracking-wide">Preview</h3>
                            <p className="text-xs text-muted-foreground mt-1">Get a quick sense of how the field behaves before inserting it.</p>
                        </div> */}
                        <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center text-center will-change-transform will-change-opacity">
                            {selectedField ? (
                                // <DemoQuestion questionType={selectedField} />
                                <div className="max-w-sm w-full flex flex-col items-center gap-4">
                                    <div className="rounded-xl border bg-muted/30 p-6 w-full relative">
                                        <div className="relative flex flex-col gap-4 items-center">
                                            <div className="size-14 rounded-lg flex items-center justify-center border bg-primary/10 text-primary">
                                                <QuestionIcon questionType={selectedField} size={30} />
                                            </div>
                                            <h4 className="text-base font-semibold tracking-tight">{allVisibleItems.find(i => i.id === selectedField)?.label}</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{fieldDescriptions[selectedField]}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <Button className="flex-1" onClick={save} disabled={!selectedField}>Add Field</Button>
                                        <Button variant="outline" className="flex-1" onClick={() => setSelectedField(null)} disabled={!selectedField}>Clear</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 max-w-xs">
                                    <div className="size-14 rounded-xl border bg-muted/40 flex items-center justify-center text-muted-foreground">
                                        <Search className="size-6" />
                                    </div>
                                    <p className="text-sm font-medium">Select a field type</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Browse categories or use search to quickly locate the field you need.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter className='border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 p-3 px-4'>
                    <div className="mr-auto hidden md:flex text-xs text-muted-foreground items-center gap-2">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] border">↵</span> Add selected
                    </div>
                    <Button type='button' variant='ghost' onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type='button' onClick={save} disabled={!selectedField}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}