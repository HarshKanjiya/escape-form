"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiConstants } from "@/constants/api.constants";
import { getErrorMessage, MESSAGE } from "@/constants/messages";
import { LIST_VIEW_TYPE } from "@/enums/common";
import { Project } from "@/generated/prisma";
import { usePagination } from "@/hooks/usePagination";
import api from "@/lib/axios";
import { formatDate, showError } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { ActionResponse } from "@/types/common";
import { debounce } from "lodash";
import { Folder, LayoutGrid, List, Search, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ButtonGroup } from "../ui/button-group";
import CustomPagination from "../ui/customPagination";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import AddProject from "./addProject";
import { ProjectCard } from "./projectCard";

interface ProjectListProps {
    projects?: Project[];
}

function ProjectGridView({ projects, loading }: { projects: Project[]; loading: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                loading ?
                    Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-32 w-full" />
                    ))
                    :
                    projects.map((project) => <ProjectCard key={project.id} project={project} />)
            }
        </div>
    );
}

function ProjectTableView({ projects, teamId, loading }: { projects: Project[]; teamId: string; loading: boolean }) {
    const { setActiveProject } = useStore((state) => state);

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
                            projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{project.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {project?.id.slice(0, 8)}...
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] truncate">
                                            {project.description || "No description"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(project.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Active</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline" onClick={() => setActiveProject(project)}>
                                            <Link href={`/${teamId}/${project.id}`}>
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

function EmptyState({ searchQuery }: { searchQuery: string }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Folder />
                </EmptyMedia>
                <EmptyTitle>No Projects Yet</EmptyTitle>
                <EmptyDescription>
                    {
                        searchQuery?.length ? (
                            <span>
                                No projects match your search criteria.
                            </span>
                        ) :
                            <span>
                                Get started by creating your first project.
                            </span>
                    }
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                {!searchQuery && (
                    <AddProject />
                )}
            </EmptyContent>
        </Empty>
    );
}

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<Project[]>(initialProjects || []);
    const [viewMode, setViewMode] = useState<string>(LIST_VIEW_TYPE.GRID);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const teamId = params.teamId as string;

    // Memoize keyboard shortcuts setup
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

    const { page, limit, totalItems, onPaginationChange, setTotalItems } = usePagination();

    const getProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get<ActionResponse<Project[]>>(apiConstants.project.getProjects({ teamId, page, limit, search: searchQuery }));
            if (!res.data.success) {
                showError(res.data.message || getErrorMessage("Projects"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
                return;
            }
            setProjects(res.data.data || []);
            setTotalItems(res.data.totalItems || 0);
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            showError(getErrorMessage("Projects"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage and organize your team projects
                    </p>
                </div>
                <AddProject onSuccess={() => getProjects()} />
            </div>

            <div className="flex flex-row gap-4 items-center justify-between">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div className="relative">
                        <Input
                            placeholder="Search projects"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-20 py-5"
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
                <div className="flex items-center gap-2">
                    <ButtonGroup aria-label="View Mode Selection">
                        <Button variant={viewMode === LIST_VIEW_TYPE.GRID ? "secondary" : "outline"} size="icon" onClick={() => setViewMode(LIST_VIEW_TYPE.GRID)}>
                            <LayoutGrid className="h-6 w-6" />
                        </Button>
                        <Button variant={viewMode === LIST_VIEW_TYPE.LIST ? "secondary" : "outline"} size="icon" onClick={() => setViewMode(LIST_VIEW_TYPE.LIST)}>
                            <List className="h-6 w-6" />
                        </Button>
                    </ButtonGroup>

                </div>
            </div>

            <div className="text-sm text-muted-foreground">
                {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </div>

            {(!projects?.length && !loading) ? <EmptyState searchQuery={searchQuery} /> :
                viewMode === "grid" ?
                    <ProjectGridView projects={projects} loading={loading} /> : <ProjectTableView projects={projects} teamId={teamId} loading={loading} />
            }
            <Separator />
            <CustomPagination limit={limit} page={page} totalItems={totalItems} onChange={onPaginationChange} />
        </div>
    );
}
