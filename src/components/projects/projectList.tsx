"use client";

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
import { Eye, Folder, Folders, LayoutGrid, List, Search, Settings, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CustomPagination from "../ui/customPagination";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { SwitchButton } from "../ui/switchButton";
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
                        <TableHead className="w-[120px] text-center">Created</TableHead>
                        <TableHead className="w-[100px] text-center">Actions</TableHead>
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
                                </TableRow>
                            ))
                            :
                            projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{project.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] truncate">
                                            {project.description || "No description"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="tracking-widest">{formatDate(project.createdAt)}</TableCell>
                                    <TableCell className="flex gap-3 p-2">
                                        <Link href={`/${teamId}/${project.id}`}>
                                            <Button size="icon" variant="outline" onClick={() => setActiveProject(project)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button size="icon" variant="outline">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive">
                                            <Trash2 className="h-4 w-4" />
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
                    <div className="p-3 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 outline-2 outline-offset-3 outline-primary/10">
                        <Folders className="w-8 h-8 text-primary" />
                    </div>
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
                            className="pl-10 pr-20 py-5 bg-background shadow-none border-accent"
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

            {(!projects?.length && !loading) ? <EmptyState searchQuery={searchQuery} /> :
                viewMode === LIST_VIEW_TYPE.GRID ?
                    <ProjectGridView projects={projects} loading={loading} /> : <ProjectTableView projects={projects} teamId={teamId} loading={loading} />
            }
            <Separator />
            <CustomPagination limit={limit} page={page} totalItems={totalItems} onChange={onPaginationChange} />
        </div>
    );
}
