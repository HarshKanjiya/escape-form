"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form } from "@/types/db";
import { LayoutGrid, List, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { SwitchButton } from "../ui/switchButton";
import { FormCard } from "./formCard";
import { getProjectForms } from "@/actions/form";

export const dynamic = 'force-dynamic'


type ViewMode = "grid" | "list";

const switchActions = [
    {
        id: "grid",
        icon: <LayoutGrid className="h-4 w-4" />,
        onClick: () => console.log("Grid view selected"),
    },
    {
        id: "list",
        icon: <List className="h-4 w-4" />,
        onClick: () => console.log("List view selected"),
    },
]

// Move these components outside to prevent recreation on every render
function FormGridView({ forms, loading }: { forms: Form[]; loading: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                loading ?
                    Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-32 w-full" />
                    ))
                    :
                    forms.map((form) => <FormCard key={form.id} form={form} />)
            }
        </div>
    );
}

function FormTableView({ forms, teamId, loading }: { forms: Form[]; teamId: string; loading: boolean }) {
    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }, []);

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        loading ?
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-6" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6" />
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            forms.map((form) => (
                                <TableRow key={form.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{form.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {form?.id.slice(0, 8)}...
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] truncate">
                                            {form.description || "No description"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(form.created_at)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Active</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline">
                                            <Link href={`/${teamId}/${form.id}`}>
                                                Open
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))

                    }
                </TableBody>
            </Table>
        </div >
    );
}

function EmptyState({ searchQuery, projectId }: { searchQuery: string, projectId: string }) {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No forms found</h3>
            <p className="text-muted-foreground mb-6">
                {searchQuery
                    ? "No forms match your search criteria."
                    : "Get started by creating your first form."
                }
            </p>
            {!searchQuery && (
                <div>
                    <Link href={`${projectId}/forms/new`}>
                        <Button >
                            Create Form
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export function FormList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [forms, setForms] = useState<Form[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const teamId = params.teamId as string;
    const projectId = params.projectId as string;

    // Memoize keyboard shortcuts setup
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'k') {
                    e.preventDefault();
                    const searchInput = document.querySelector('input[placeholder*="Search forms"]') as HTMLInputElement;
                    searchInput?.focus();
                }
            }
            if (e.key === 'Escape') {
                setSearchQuery("");
            }
        };

        getForms();
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);

    }, []);

    const getForms = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProjectForms(projectId);
            if (res.error) {
                toast.error("Failed to load forms");
                return;
            }
            setForms(res.data || []);
        }
        catch (error) {
            console.error("Error fetching forms:", error);
            toast.error("Failed to load forms");
        } finally {
            setLoading(false);
        }
    }, [])

    // Memoize filtered forms to prevent unnecessary recalculations
    const filteredforms = useMemo(() => {
        const searchLower = searchQuery.toLowerCase().trim();
        if (!searchLower) return forms;

        return forms.filter((form) =>
            form.name.toLowerCase().includes(searchLower) ||
            (form.description?.toLowerCase().includes(searchLower) ?? false) ||
            form.id.toLowerCase().includes(searchLower)
        );
    }, [forms, searchQuery]);

    // Memoize callbacks to prevent unnecessary re-renders
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    switchActions[0].onClick = useCallback(() => {
        setViewMode("grid");
    }, []);

    switchActions[1].onClick = useCallback(() => {
        setViewMode("list");
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">forms</h1>
                    <p className="text-muted-foreground">
                        Manage and organize your team forms
                    </p>
                </div>

                <Link href={`${projectId}/forms/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Form
                    </Button>
                </Link>
            </div>

            <div className="flex flex-row gap-4 items-center justify-between">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div className="relative">
                        <Input
                            placeholder="Search forms"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-20 py-5"
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            <Badge variant="outline">Ctrl</Badge>
                            <Badge variant="outline">K</Badge>
                        </div>
                    </div>
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSearch}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <SwitchButton options={switchActions} defaultSelected="grid" />
                </div>
            </div>

            <div className="text-sm text-muted-foreground">
                {searchQuery ? (
                    <>Showing {filteredforms.length} of {forms.length} forms</>
                ) : (
                    <>{forms.length} form{forms.length !== 1 ? 's' : ''} total</>
                )}
            </div>

            {
                !filteredforms?.length ? <EmptyState searchQuery={searchQuery} projectId={projectId} /> :
                    viewMode === "grid" ?
                        <FormGridView forms={filteredforms} loading={loading} /> : <FormTableView forms={filteredforms} teamId={teamId} loading={loading} />
            }
        </div >
    );
}
