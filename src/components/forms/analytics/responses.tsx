"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import CustomPagination from "@/components/ui/customPagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiConstants } from "@/constants/api.constants";
import { usePagination } from "@/hooks/usePagination";
import api from "@/lib/axios";
import { cn, showError } from "@/lib/utils";
import { Form, Question, QuestionType, Response } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, CheckSquare, FileIcon, ImageIcon, VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface FormResponsesProps {
    form: Form;
}

export default function FormResponses({ form }: FormResponsesProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Response[]>([]);
    const [responses, setResponses] = useState<any[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const { page, limit, totalItems, onPaginationChange, setTotalItems } = usePagination();

    const fetchQuestions = async () => {
        try {
            const res = await api.get(apiConstants.dashboard.getQuestions(form.id));
            if (!res?.data?.success) {
                setQuestions([]);
                return;
            }
            const questionsData = res.data.data as any[];
            // Sort by sortOrder
            setQuestions(questionsData.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
        } catch (error) {
            setQuestions([]);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [form]);

    const fetchResponses = async () => {
        try {
            setLoading(true);
            const res = await api.get(apiConstants.dashboard.getResponses(form.id));
            setLoading(false);

            if (!res?.data?.success) {
                showError("Failed to fetch responses");
                return;
            }
            const responseData = res?.data?.data || [];
            // The 'data' field in each response contains the question-answer mapping
            setResponses(responseData.map((resp: any) => resp.data || {}));
            setData(responseData);
            setTotalItems(res?.data?.totalItems);
        } catch (error) {
            setLoading(false);
            showError("Failed to fetch responses");
        }
    };

    useEffect(() => {
        fetchResponses();
    }, [page, limit]);

    const toggleRowSelection = (id: string) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const toggleAllRows = () => {
        if (selectedRows.size === data.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(data.map((r) => r.id)));
        }
    };

    const formatDuration = (startedAt?: Date | null, submittedAt?: Date | null) => {
        if (!submittedAt || !startedAt) return "N/A";
        const seconds = Math.round(
            (new Date(submittedAt).getTime() - new Date(startedAt).getTime()) / 1000
        );
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">Loading responses...</p>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-2">No responses yet</p>
                <p className="text-sm text-muted-foreground">
                    Responses will appear here once users submit the form
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Selection Summary Bar */}
            {selectedRows.size > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-medium">
                            {selectedRows.size} selected
                        </Badge>
                        <button
                            onClick={() => setSelectedRows(new Set())}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Clear selection
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-sm px-3 py-1.5 rounded-md bg-background hover:bg-muted transition-colors border">
                            Export selected
                        </button>
                        <button className="text-sm px-3 py-1.5 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors border border-destructive/20">
                            Delete selected
                        </button>
                    </div>
                </div>
            )}

            {/* Responses Table */}

            {/* <Table>
                <TableHeader>
                    <TableRow className="relative">
                        <TableHead className="sticky left-1 z-10 bg-background w-12 border-r shadow-sm flex items-center justify-center rounded-none p-0">
                            <Checkbox
                                checked={selectedRows.size === data.length && data.length > 0}
                                onCheckedChange={toggleAllRows}
                                aria-label="Select all responses"
                            />
                        </TableHead>
                        <TableHead className="w-32">Duration</TableHead>
                        <TableHead className="w-32">Status</TableHead>
                        <TableHead className="w-44">Submitted At</TableHead>
                        {questions.map((question) => (
                            <TableHead key={question.id} className="min-w-[200px]">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">{question.title}</span>
                                    <span className="text-xs text-muted-foreground font-normal">
                                        {question.type.replace(/_/g, " ").toLowerCase()}
                                    </span>
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="relative">
                    {data.map((resp, ind) => (
                        <TableRow
                            key={resp.id}
                            className={cn(
                                "transition-colors relative",
                                selectedRows.has(resp.id) && "bg-muted/50"
                            )}
                        >
                            <TableCell className="sticky left-1 z-10 bg-background flex items-center justify-center rounded-none!">
                                <Checkbox
                                    checked={selectedRows.has(resp.id)}
                                    onCheckedChange={() => toggleRowSelection(resp.id)}
                                    aria-label={`Select response ${ind + 1}`}
                                />
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {formatDuration(resp.startedAt, resp.submittedAt)}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "capitalize font-medium",
                                        getStatusColor(resp.status)
                                    )}
                                >
                                    {resp.status || "Unknown"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {resp.submittedAt
                                    ? format(new Date(resp.submittedAt), "MMM dd, yyyy HH:mm")
                                    : "Not submitted"}
                            </TableCell>
                            {questions.map((question) => {
                                const ans = responses[ind]?.[question.id];
                                return (
                                    <TableCell key={question.id} className="align-top">
                                        {renderAnswer(question, ans)}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}

            <Table parentClassName="p-0! overflow-auto scrollbar-invisible" className="not-rounded-table">
                <TableHeader>
                    <TableRow className="*:whitespace-nowrap hover:bg-background">
                        <TableHead className="pl-4 sticky left-0 bg-background min-w-[50px] py-4">
                            <Checkbox
                                checked={selectedRows.size === data.length && data.length > 0}
                                onCheckedChange={toggleAllRows}
                                aria-label="Select all responses"
                            />
                        </TableHead>
                        <TableHead className="sticky w-36 left-[50px] bg-background py-4">Duration</TableHead>
                        <TableHead className="bg-background py-4">Duration</TableHead>
                        <TableHead className="bg-background py-4">Duration</TableHead>
                        {questions.map((question) => (
                            <TableHead key={question.id} className="min-w-[200px] py-4">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">{question.title}</span>
                                    <span className="text-xs text-muted-foreground font-normal">
                                        {question.type.replace(/_/g, " ").toLowerCase()}
                                    </span>
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="overflow-hidden">
                    {data.map((resp, ind) => (
                        <TableRow
                            key={resp.id}
                            className="group odd:bg-muted [&>td]:whitespace-nowrap"
                        >

                            <TableCell className="pl-4 sticky left-0 bg-background group-odd:bg-muted">
                                <Checkbox
                                    checked={selectedRows.has(resp.id)}
                                    onCheckedChange={() => toggleRowSelection(resp.id)}
                                    aria-label={`Select response ${ind + 1}`}
                                />
                            </TableCell>

                            <TableCell className="font-medium sticky w-36 left-[50px] bg-background group-odd:bg-muted ">
                                {formatDuration(resp.startedAt, resp.submittedAt)}
                            </TableCell>

                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "capitalize font-medium",
                                        getStatusColor(resp.status)
                                    )}
                                >
                                    {resp.status || "Unknown"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {resp.submittedAt
                                    ? format(new Date(resp.submittedAt), "MMM dd, yyyy HH:mm")
                                    : "-"}
                            </TableCell>
                            {questions.map((question) => {
                                const ans = responses[ind]?.[question.id];
                                return (
                                    <TableCell key={question.id} className="align-top">
                                        {renderAnswer(question, ans)}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CustomPagination loading={loading} limit={limit} page={page} totalItems={totalItems} onChange={onPaginationChange} />
        </div>
    );
}

const getStatusColor = (status?: string | null) => {
    switch (status?.toLowerCase()) {
        case "completed":
            return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
        case "partial":
            return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
        case "abandoned":
            return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
        case "started":
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
        default:
            return "";
    }
};

const renderAnswer = (question: Question, answer: any) => {
    if (answer === undefined || answer === null || answer === "") {
        return <span className="text-muted-foreground italic text-sm">No response</span>;
    }

    const answerValue = answer;

    // Handle different question types
    switch (question.type) {
        case QuestionType.CHOICE_CHECKBOX:
        case QuestionType.CHOICE_MULTIPLE:
            if (Array.isArray(answerValue)) {
                return (
                    <div className="flex flex-col gap-1">
                        {answerValue.map((val: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5 text-sm">
                                <CheckSquare className="h-3.5 w-3.5 text-primary" />
                                <span>{val}</span>
                            </div>
                        ))}
                    </div>
                );
            }
            return <span className="text-sm">{String(answerValue)}</span>;

        case QuestionType.CHOICE_BOOL:
            return (
                <Badge variant="outline" className="capitalize">
                    {answerValue === true || answerValue === "true" ? "Yes" : "No"}
                </Badge>
            );

        case QuestionType.DATE:
            try {
                const date = new Date(answerValue);
                return (
                    <div className="flex items-center gap-1.5 text-sm">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{format(date, "PPP")}</span>
                    </div>
                );
            } catch {
                return <span className="text-sm">{String(answerValue)}</span>;
            }

        case QuestionType.FILE_ANY:
            return (
                <div className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400">
                    <FileIcon className="h-3.5 w-3.5" />
                    <span className="underline cursor-pointer hover:text-blue-700">
                        View file
                    </span>
                </div>
            );

        case QuestionType.FILE_IMAGE_OR_VIDEO:
            const isImage = typeof answerValue === "string" && answerValue.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            const isVideo = typeof answerValue === "string" && answerValue.match(/\.(mp4|mov|avi|webm)$/i);
            return (
                <div className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400">
                    {isImage ? (
                        <ImageIcon className="h-3.5 w-3.5" />
                    ) : isVideo ? (
                        <VideoIcon className="h-3.5 w-3.5" />
                    ) : (
                        <FileIcon className="h-3.5 w-3.5" />
                    )}
                    <span className="underline cursor-pointer hover:text-blue-700">
                        View media
                    </span>
                </div>
            );

        case QuestionType.TEXT_LONG:
            const text = String(answerValue);
            return (
                <div className="max-w-md">
                    <p className="text-sm whitespace-pre-wrap line-clamp-3">
                        {text}
                    </p>
                    {text.length > 100 && (
                        <button className="text-xs text-primary hover:underline mt-1">
                            Read more
                        </button>
                    )}
                </div>
            );

        case QuestionType.INFO_EMAIL:
            return (
                <a
                    href={`mailto:${answerValue}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {String(answerValue)}
                </a>
            );

        case QuestionType.INFO_PHONE:
            return (
                <a
                    href={`tel:${answerValue}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {String(answerValue)}
                </a>
            );

        case QuestionType.INFO_URL:
            return (
                <a
                    href={String(answerValue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {String(answerValue)}
                </a>
            );

        default:
            return <span className="text-sm">{String(answerValue)}</span>;
    }
};