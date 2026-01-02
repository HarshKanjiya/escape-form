"use client";

import { Badge } from "@/components/ui/badge";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { QuestionType } from "@prisma/client";
import { Plus, Search, SearchXIcon } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import QuestionIcon from "./questionIcon";

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
                "group relative flex items-center gap-3 rounded-2xl corner-squircle border border-input p-2 text-sm outline-none cursor-pointer select-none transition-all bg-background dark:bg-foreground/5",
                "hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 outline-none",
                isSelected && "border-primary/50 bg-primary/10 dark:bg-primary/15"
            )}
        >
            <div
                className={cn(
                    "flex size-8 items-center justify-center border transition-colors rounded-xl corner-squircle",
                    accent,
                )}
            >
                <QuestionIcon questionType={id} size={18} />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-medium leading-tight truncate">{label}</span>
            </div>
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
            // { id: QuestionType.FILE_ANY, label: 'File Upload', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['attachment', 'upload'] },
            // { id: QuestionType.FILE_IMAGE_OR_VIDEO, label: 'Image or Video', accent: 'bg-fuchsia-400/50 dark:bg-fuchsia-400/30', keywords: ['attachment', 'upload'] },
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
            // { id: QuestionType.CHOICE_PICTURE, label: 'Picture Choice', accent: 'bg-emerald-400/40 dark:bg-emerald-400/25', keywords: ['image', 'option'] },
        ]
    },
    {
        title: 'Contact Info',
        description: 'Collect respondent contact details',
        items: [
            { id: QuestionType.INFO_EMAIL, label: 'Email', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['contact', 'mail'] },
            { id: QuestionType.INFO_PHONE, label: 'Phone', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['contact', 'tel'] },
            { id: QuestionType.INFO_URL, label: 'Website', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['url'] },
            // { id: QuestionType.USER_ADDRESS, label: 'User Address', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['location'] },
            // { id: QuestionType.USER_DETAIL, label: 'User Detail', accent: 'bg-amber-400/60 dark:bg-amber-400/30', keywords: ['contact', 'static'] },
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
    {
        title: 'Screens',
        description: 'Non-question form screens',
        items: [
            { id: QuestionType.SCREEN_WELCOME, label: 'Welcome Screen', accent: 'bg-teal-400/50 dark:bg-teal-400/25', keywords: ['intro', 'start'] },
            { id: QuestionType.SCREEN_END, label: 'End Screen', accent: 'bg-teal-400/50 dark:bg-teal-400/25', keywords: ['thank you', 'finish'] },
            { id: QuestionType.SCREEN_STATEMENT, label: 'Statement Screen', accent: 'bg-teal-400/50 dark:bg-teal-400/25', keywords: ['content', 'message'] },
        ]
    },
    {
        title: 'Others',
        description: 'Specialized question types',
        items: [
            { id: QuestionType.LEAGAL, label: 'Legal Consent', accent: 'bg-red-400/50 dark:bg-red-400/25', keywords: ['terms', 'agreement'] },
            // { id: QuestionType.REDIRECT_TO_URL, label: 'Redirect to URL', accent: 'bg-red-400/50 dark:bg-red-400/25', keywords: ['link', 'redirect'] },
        ]
    }
];


export default function AddQuestionDialog({ children }: IAddItemDialogProps) {

    const createQuestions = useFormBuilder((state) => state.createQuestions);

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
                    <Tooltip>
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
                <div className="flex flex-col md:flex-row flex-1 min-h-0 py-0 bg-accent transition-opacity duration-150">
                    <div className="w-full flex flex-col min-h-0">
                        <div className="p-4 flex items-center gap-4 border-b bg-background">
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
                                        <Badge
                                            key={section}
                                            onClick={() => setActiveSection(section)}
                                            variant={active ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                        >
                                            {section}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                        <ScrollArea className="h-[60vh]">
                            <div className="flex-1 p-4" role="listbox" aria-label="Question types" style={{ scrollBehavior: 'auto' }}>
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
                                                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
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
                                                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
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
                                        <Empty>
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon" className="bg-background dark:bg-muted-foreground/10 border-muted border-2 rounded-2xl corner-squircle">
                                                    <SearchXIcon />
                                                </EmptyMedia>
                                                <EmptyTitle>No Fields Found</EmptyTitle>
                                                <EmptyDescription>
                                                    {
                                                        query?.length ? (
                                                            <span>
                                                                No fields match your search criteria.
                                                            </span>
                                                        ) :
                                                            null
                                                    }
                                                </EmptyDescription>
                                            </EmptyHeader>
                                            <EmptyContent>
                                                {/* {!query && (
                                                )} */}
                                            </EmptyContent>
                                        </Empty>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <DialogFooter className='relative border-t bg-background p-3 px-4'>
                    <div className="mr-auto hidden md:flex text-xs text-muted-foreground items-center gap-2">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] border">↵</span> Add selected
                    </div>
                    <Button type='button' variant='ghost' onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type='button' onClick={save} disabled={!selectedField}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}