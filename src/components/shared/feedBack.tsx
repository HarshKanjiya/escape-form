
"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Paperclip, X as XIcon } from "lucide-react";
import * as React from "react";

interface FeedbackModelProps {
    dialogTitle?: React.ReactNode;
    dialogDescription?: React.ReactNode;
    dialogContent?: React.ReactNode;
    dialogFooter?: React.ReactNode;
    children?: React.ReactNode;
}

export function FeedbackModel({
    dialogTitle = "Feedback",
    dialogDescription = "",
    dialogContent,
    dialogFooter,
    children,
}: FeedbackModelProps) {
    const [subject, setSubject] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [files, setFiles] = React.useState<File[]>([]);
    const [fileError, setFileError] = React.useState<string | "">("");
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

    // function handlePickFiles() {
    //     fileInputRef.current?.click();
    // }

    function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = Array.from(e.target.files ?? []);
        const valid: File[] = [];
        let rejected = 0;
        for (const f of next) {
            if (f.size <= MAX_FILE_SIZE) valid.push(f);
            else rejected++;
        }
        setFiles(valid);
        setFileError(rejected > 0 ? `Some files were too large. Max 5MB per file.` : "");
    }

    function clearFiles() {
        setFiles([]);
        setFileError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const isSubmitDisabled =
        !subject.trim() && !details.trim() && files.length === 0;

    const filesLabel =
        files.length === 0
            ? ""
            : files.length === 1
                ? files[0].name
                : `${files[0].name} (+${files.length - 1})`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant={'outline'} size='icon' className='shadow-none'>
                        <MessageSquare className="w-5 h-5" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                {dialogContent ? (
                    dialogContent
                ) : (
                    <div className="grid gap-6 py-2">
                        <div className="grid gap-1.5">
                            <Label htmlFor="feedback-subject">Subject</Label>
                            <Input
                                id="feedback-subject"
                                placeholder="Issue / remark / suggestion summary"
                                autoFocus
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="feedback-details">Details</Label>
                                <div className="flex items-center gap-2 min-w-0">
                                    {filesLabel && (
                                        <span className="text-sm text-muted-foreground truncate max-w-[10rem] sm:max-w-[16rem]">
                                            {filesLabel}
                                        </span>
                                    )}
                                    {filesLabel && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={clearFiles}
                                                    aria-label="Discard attachment(s)"
                                                >
                                                    <XIcon className="size-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Discard attachment(s)</TooltipContent>
                                        </Tooltip>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        id="feedback-files"
                                        type="file"
                                        multiple
                                        onChange={handleFilesChange}
                                        className="hidden"
                                    />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => fileInputRef.current?.click()}
                                                aria-label="Attach files"
                                            >
                                                <Paperclip className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Attach files</TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            <Textarea
                                id="feedback-details"
                                placeholder="Describe the issue, steps to reproduce, or your suggestion..."
                                rows={6}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                            {fileError ? (
                                <p className="text-xs text-destructive">{fileError}</p>
                            ) : null}
                            <p className="text-xs text-muted-foreground">
                                Include steps, expected vs actual behavior, links, and screenshots if helpful.
                            </p>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    {dialogFooter ? (
                        dialogFooter
                    ) : (
                        <>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit" disabled={isSubmitDisabled}>Submit</Button>
                            </DialogClose>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
