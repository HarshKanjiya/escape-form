
"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, MessageSquare } from "lucide-react";
import * as React from "react";
import { CustomDialog, CustomDialogBody, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogTrigger } from "../ui/custom-dialog";

interface FeedbackModelProps {
    dialogTitle?: React.ReactNode;
    dialogDescription?: React.ReactNode;
    dialogContent?: React.ReactNode;
    dialogFooter?: React.ReactNode;
    children?: React.ReactNode;
}

export function FeedbackModel({ children }: FeedbackModelProps) {
    const [subject, setSubject] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [Loading, setLoading] = React.useState(true);
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
        <CustomDialog>
            <CustomDialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant={'outline'} className='shadow-none'>
                        <MessageSquare className="w-5 h-5" />
                        Feedback
                    </Button>
                )}
            </CustomDialogTrigger>
            <CustomDialogContent className="sm:max-w-xl">
                <CustomDialogHeader>
                    <CustomDialogTitle>Feedback</CustomDialogTitle>
                </CustomDialogHeader>
                <CustomDialogBody className="p-0">
                    <div className="w-full h-full flex items-center justify-center relative min-h-[70vh]">
                        {Loading && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2Icon className="animate-spin h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Loading feedback form...</p>
                                </div>
                            </div>
                        )}
                        <iframe
                            src="https://form.escform.com/f/xikagoxp"
                            className="w-full h-full min-h-[70vh] overflow-hidden rounded-md"
                            onLoad={() => setLoading(false)}
                            onError={() => setLoading(false)}
                        />
                    </div>

                    {/* <div className="grid gap-6 py-2">
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
                                            <TooltipContent>
                                                <TooltipArrow />
                                                Discard attachment(s)
                                            </TooltipContent>
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
                                        <TooltipContent>
                                            <TooltipArrow />
                                            Attach files
                                        </TooltipContent>
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
                    </div> */}
                </CustomDialogBody>

                {/* <CustomDialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit" disabled={isSubmitDisabled}>Submit</Button>
                    </DialogClose>
                </CustomDialogFooter> */}
            </CustomDialogContent>
        </CustomDialog>
    );
}
