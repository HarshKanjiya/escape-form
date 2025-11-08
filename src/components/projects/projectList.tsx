"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiConstants } from "@/constants/api.constants";
import { getErrorMessage, MESSAGE } from "@/constants/messages";
import { LIST_VIEW_TYPE } from "@/enums/common";
import { Project } from "@/generated/prisma";
import { usePagination } from "@/hooks/usePagination";
import api from "@/lib/axios";
import { showError } from "@/lib/utils";
import { ActionResponse } from "@/types/common";
import { debounce } from "lodash";
import { FolderIcon, FoldersIcon, LayoutGrid, List, Search, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IconCard } from "../shared/iconCard";
import CustomPagination from "../ui/customPagination";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Separator } from "../ui/separator";
import { SwitchButton } from "../ui/switchButton";
import AddProject from "./addProject";
import ProjectEmptyState from "./projectEmptyState";
import ProjectGridView from "./projectGridView";
import ProjectTableView from "./projectTableView";

interface ProjectListProps {
    projects?: Project[];
}

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<Project[]>(initialProjects || []);
    const [viewMode, setViewMode] = useState<string>(LIST_VIEW_TYPE.GRID);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const teamId = params.teamId as string;

    const { page, limit, totalItems, onPaginationChange, setTotalItems } = usePagination();

    useEffect(() => {
        getProjects();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'k') {
                    e.preventDefault();
                    const searchInput = document.querySelector('input[placeholder*="Search projects"]') as HTMLInputElement;
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

    const getProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get<ActionResponse<Project[]>>(apiConstants.project.getProjects({ teamId, page, limit, search: searchQuery }));
            if (!res.data.success) {
                showError(res.data.message || getErrorMessage("projects"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
                return;
            }
            setProjects(res.data.data || []);
            setTotalItems(res.data.totalItems || 0);
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            showError(getErrorMessage("projects"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProjects();
    }, [page, limit]);

    const debounceFn = debounce(getProjects, 500);
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
                    <IconCard icon={FoldersIcon} />
                    <div>
                        <h1 className="text-2xl font-medium">Projects</h1>
                        <p className="text-muted-foreground">
                            Manage and organize your team projects
                        </p>
                    </div>
                </div>
                <AddProject onSuccess={() => getProjects()} />
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
                {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </div>

            {(!projects?.length && !loading) ? <ProjectEmptyState searchQuery={searchQuery} /> :
                viewMode === LIST_VIEW_TYPE.GRID ?
                    <ProjectGridView projects={projects} loading={loading} /> : <ProjectTableView projects={projects} teamId={teamId} loading={loading} />
            }
            {projects.length > 0 && <Separator />}
            <CustomPagination loading={loading} limit={limit} page={page} totalItems={totalItems} onChange={onPaginationChange} />
        </div>
    );
}
