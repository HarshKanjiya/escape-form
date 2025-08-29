"use client";

import { cn } from "@/lib/utils";
import { Calendar, ChartBarBig, ChevronsUpDown, CircleDot, FileText, Hash, Image, Images, Link, Link2, LucideIcon, Mail, MapPin, Phone, Plus, SquareCheckBig, Star, StickyNote } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";

interface IAddItemDialogProps {
    onAddItem: (id: string) => void;
}

interface IItemProps {
    field: IField;
    selectedField: string | null;
    setSelectedField: (code: string) => void;
}

function FieldItem({ field: { code, icon, label, accent }, selectedField, setSelectedField }: IItemProps) {
    const Icon = icon;
    return (
        <div
            onClick={() => setSelectedField(code)}
            className={cn("flex gap-3 items-center bg-accent p-2 rounded-lg border hover:border-primary transition-all duration-200",
                selectedField === code ? "bg-primary/30" : "border-transparent",
            )}>
            <div className={cn('rounded-sm p-1', accent)}>
                <Icon size={18} />
            </div>
            <span className="!font-light text-sm">{label}</span>
        </div>
    );
}

interface IFieldSet {
    title: string;
    description: string;
    items: IField[];
}

interface IField {
    accent: string;
    label: string;
    code: string;
    icon: LucideIcon;
}

const fields: IFieldSet[] = [
    {
        title: 'Common',
        description: 'Common set of input fields',

        items: [
            { label: 'Short Text', code: 'short_text', icon: StickyNote, accent: 'bg-fuchsia-400/60' },
            { label: 'Long Text', code: 'long_text', icon: StickyNote, accent: 'bg-fuchsia-400/60' },
            { label: 'Number', code: 'number', icon: Hash, accent: 'bg-fuchsia-400/60' },
            { label: 'Date', code: 'date', icon: Calendar, accent: 'bg-fuchsia-400/60' },
            { label: 'File', code: 'file', icon: FileText, accent: 'bg-fuchsia-400/60' },
        ]
    },
    {
        title: 'Choice Based',
        description: 'Choice based set of input fields',
        items: [
            { label: 'Radio', code: 'radio', icon: CircleDot, accent: 'bg-emerald-400/30' },
            { label: 'Checkbox', code: 'checkbox', icon: SquareCheckBig, accent: 'bg-emerald-400/30' },
            { label: 'Dropdown', code: 'dropdown', icon: ChevronsUpDown, accent: 'bg-emerald-400/30' },
            { label: 'Dropdown', code: 'dropdown', icon: ChevronsUpDown, accent: 'bg-emerald-400/30' },
        ]
    },
    {
        title: 'Contact info',
        description: 'Contact information fields',
        items: [
            { label: 'Email', code: 'email', icon: Mail, accent: 'bg-amber-400/60' },
            { label: 'Phone', code: 'phone', icon: Phone, accent: 'bg-amber-400/60' },
            { label: 'Address', code: 'address', icon: MapPin, accent: 'bg-amber-400/60' },
            { label: 'Website', code: 'website', icon: Link2, accent: 'bg-amber-400/60' },
        ]
    },
    {
        title: 'Rating',
        description: 'Rating fields',
        items: [
            { label: 'Star', code: 'star_rating', icon: Star, accent: 'bg-indigo-400/60' },
            { label: 'Choice', code: 'bar_choice_rating', icon: ChartBarBig, accent: 'bg-indigo-400/60' },
            { label: 'Picture Choice', code: 'image_choice_rating', icon: Images, accent: 'bg-indigo-400/60' },
        ]
    },
]


export default function AddItemDialog({ onAddItem }: IAddItemDialogProps) {
    const [selectedField, setSelectedField] = useState<string | null>(null);

    const save = () => {
        if (selectedField) onAddItem(selectedField);
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'secondary'} size={'sm'}>
                        <Plus className="mr-2" />
                        Add Item
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full sm:min-w-[70vw] md:min-w-[60vw] lg:min-w-[50vw] p-0">
                    <DialogTitle className="p-4 border-b">Add New Item</DialogTitle>
                    <div className="p-4 flex flex-col gap-4 w-full min-h-64 overflow-auto max-h-[60vh] sm:max-h-[70vh]">
                        {
                            fields.map((set, index) => {
                                return (
                                    <div key={index} className="w-full py-2 flex flex-col gap-2">
                                        <h4 className="font-medium border-b pb-2">{set.title}</h4>
                                        <div className="overflow-auto w-full gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                                            {
                                                set.items.map((field, index) => {
                                                    return (
                                                        <FieldItem key={index} field={field} selectedField={selectedField} setSelectedField={(code: string) => setSelectedField(code)} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <DialogFooter className='border-t bg-background p-3 pt-4 px-4'>
                        <Button type='button' variant='ghost'>Cancel</Button>
                        <Button type='submit' form='form-settings' onClick={save}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}