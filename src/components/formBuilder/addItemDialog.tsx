"use client";

import { eQuestionType } from "@/enums/form";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import QuestionIcon from "./ui/questionIcon";

interface IAddItemDialogProps {
    onAddItem: (id: eQuestionType) => void;
    children?: React.ReactNode;
}

interface IItemProps {
    field: IField;
    selectedField: eQuestionType | null;
    setSelectedField: (id: eQuestionType) => void;
}

function FieldItem({ field: { id, label, accent }, selectedField, setSelectedField }: IItemProps) {

    return (
        <div
            onClick={() => setSelectedField(id)}
            className={cn("flex gap-3 items-center bg-accent p-2 rounded-lg border hover:border-primary transition-all duration-200",
                selectedField === id ? "bg-primary/30" : "border-transparent",
            )}>
            <div className={cn('rounded-sm p-1', accent)}>
                <QuestionIcon questionType={id} size={16} />
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
    id: eQuestionType;
}

const fields: IFieldSet[] = [
    {
        title: 'Common',
        description: 'Common set of input fields',

        items: [
            { id: eQuestionType.shortText, label: 'Short Text', accent: 'bg-fuchsia-400/60' },
            { id: eQuestionType.longText, label: 'Long Text', accent: 'bg-fuchsia-400/60' },
            { id: eQuestionType.number, label: 'Number', accent: 'bg-fuchsia-400/60' },
            { id: eQuestionType.date, label: 'Date', accent: 'bg-fuchsia-400/60' },
            { id: eQuestionType.file, label: 'File', accent: 'bg-fuchsia-400/60' },
        ]
    },
    {
        title: 'Choice Based',
        description: 'Choice based set of input fields',
        items: [
            { id: eQuestionType.radio, label: 'Radio', accent: 'bg-emerald-400/30' },
            { id: eQuestionType.checkbox, label: 'Checkbox', accent: 'bg-emerald-400/30' },
            { id: eQuestionType.dropdown, label: 'Dropdown', accent: 'bg-emerald-400/30' },
        ]
    },
    {
        title: 'Contact info',
        description: 'Contact information fields',
        items: [
            { id: eQuestionType.email, label: 'Email', accent: 'bg-amber-400/60' },
            { id: eQuestionType.phone, label: 'Phone', accent: 'bg-amber-400/60' },
            { id: eQuestionType.address, label: 'Address', accent: 'bg-amber-400/60' },
            { id: eQuestionType.website, label: 'Website', accent: 'bg-amber-400/60' },
        ]
    },
    {
        title: 'Rating',
        description: 'Rating fields',
        items: [
            { id: eQuestionType.starRating, label: 'Star', accent: 'bg-indigo-400/60' },
            { id: eQuestionType.barChoiceRating, label: 'Choice', accent: 'bg-indigo-400/60' },
            { id: eQuestionType.imageChoiceRating, label: 'Picture Choice', accent: 'bg-indigo-400/60' },
        ]
    },
]


export default function AddItemDialog({ onAddItem, children }: IAddItemDialogProps) {
    const [selectedField, setSelectedField] = useState<eQuestionType | null>(null);
    const [open, setOpen] = useState(false);

    const save = () => {
        if (selectedField) {
            onAddItem(selectedField);
            setSelectedField(null);
            setOpen(false);
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {
                        children ? children :
                            <Button variant={'secondary'} size={'sm'}>
                                <Plus className="mr-2" />
                                Add Item
                            </Button>
                    }
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
                                                        <FieldItem key={index} field={field} selectedField={selectedField} setSelectedField={(code: eQuestionType) => setSelectedField(code)} />
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
                        <Button type='button' variant='ghost' onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type='submit' form='form-settings' onClick={save}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}