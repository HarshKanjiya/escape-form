"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiConstants } from "@/constants/api.constants";
import { getErrorMessage, MESSAGE } from "@/constants/messages";
import { ERROR_ROUTES, ROUTES } from "@/constants/routes.constants";
import { LIST_VIEW_TYPE } from "@/enums/common";
import { Form } from "@/generated/prisma";
import { usePagination } from "@/hooks/usePagination";
import api from "@/lib/axios";
import { isValidUUID, showError } from "@/lib/utils";
import { ActionResponse } from "@/types/common";
import { debounce } from "lodash";
import { LayersIcon, LayoutGrid, List, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IconCard } from "../shared/iconCard";
import CustomPagination from "../ui/customPagination";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Separator } from "../ui/separator";
import { SwitchButton } from "../ui/switchButton";
import FormEmptyState from "./formEmptyState";
import FormGridView from "./formGridView";
import FormTableView from "./formTableView";


export function FormList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [forms, setForms] = useState<Partial<Form>[]>([]);
    const [viewMode, setViewMode] = useState<string>(LIST_VIEW_TYPE.GRID);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const teamId = params.teamId as string;
    const projectId = params.projectId as string;

    if (!isValidUUID(teamId) || !isValidUUID(projectId)) {
        redirect(ERROR_ROUTES.NOT_FOUND);
    }
    const { page, limit, totalItems, onPaginationChange, setTotalItems } = usePagination();

    useEffect(() => {
        getForms();
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

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);

    }, []);

    const getForms = async () => {
        try {
            setLoading(true);
            const res = await api.get<ActionResponse<Partial<Form>[]>>(apiConstants.form.getForms(projectId));
            if (!res.data.success) {
                showError(res.data.message || getErrorMessage("forms"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
                return;
            }
            setForms(res.data.data || []);
        }
        catch (error) {
            console.error("Error fetching forms:", error);
            showError(getErrorMessage("forms"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getForms();
    }, [page, limit]);

    const debounceFn = debounce(getForms, 500);
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        debounceFn();
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    const switchActions = [
        {
            id: LIST_VIEW_TYPE.GRID,
            icon: <LayoutGrid className="h-4 w-4" />,
            onClick: () => setViewMode(LIST_VIEW_TYPE.GRID),
        },
        {
            id: LIST_VIEW_TYPE.LIST,
            icon: <List className="h-4 w-4" />,
            onClick: () => setViewMode(LIST_VIEW_TYPE.LIST),
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                    <IconCard icon={LayersIcon} />
                    <div>
                        <h1 className="text-2xl font-medium">Forms</h1>
                        <p className="text-muted-foreground">
                            Manage and organize your team forms
                        </p>
                    </div>
                </div>
                <Link href={ROUTES.form.create(teamId, projectId)} >
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Form
                    </Button>
                </Link>
            </div>

            <div className="flex flex-row gap-4 items-center justify-between">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <div className="relative">
                        <Input
                            placeholder="Search projects"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-20 py-5 !bg-muted shadow-none border-accent"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            <KbdGroup>
                                <Kbd>Ctrl</Kbd>
                                <span>+</span>
                                <Kbd>K</Kbd>
                            </KbdGroup>
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
                <SwitchButton options={switchActions} defaultSelected={viewMode} size="sm" />
            </div>

            <div className="text-sm text-muted-foreground">
                {forms.length} form{forms.length !== 1 ? 's' : ''} total
            </div>

            {
                (!forms?.length && !loading) ? <FormEmptyState searchQuery={searchQuery} projectId={projectId} /> :
                    viewMode === "grid" ?
                        <FormGridView forms={forms} loading={loading} projectId={projectId} teamId={teamId} /> :
                        <FormTableView forms={forms} loading={loading} projectId={projectId} teamId={teamId} />
            }
            {forms.length > 0 && <Separator />}
            <CustomPagination loading={loading} limit={limit} page={page} totalItems={totalItems} onChange={onPaginationChange} />
        </div >
    );
}
