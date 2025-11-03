"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiConstants } from "@/constants/api.constants";
import { getErrorMessage, MESSAGE } from "@/constants/messages";
import { Project } from "@/generated/prisma";
import { usePagination } from "@/hooks/usePagination";
import api from "@/lib/axios";
import { formatDate, showError } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { ActionResponse } from "@/types/common";
import { Folder, LayoutGrid, List, Search, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomPagination from "../ui/customPagination";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Skeleton } from "../ui/skeleton";
import { SwitchButton } from "../ui/switchButton";
import AddProject from "./addProject";
import { ProjectCard } from "./projectCard";

interface ProjectListProps {
    projects?: Project[];
}

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
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
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

    const getProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get<ActionResponse<Project[]>>(apiConstants.project.getProjects(teamId));
            if (!res.data.success) {
                showError(res.data.message || getErrorMessage("Projects"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
                return;
            }
            setProjects(res.data.data || []);
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            showError(getErrorMessage("Projects"), MESSAGE.PLEASE_TRY_AGAIN_LATER);
        } finally {
            setLoading(false);
        }
    }, [teamId])

    const { page, limit, totalPages, totalItems, onPaginationChange, setTotalItems } = usePagination(getProjects);

    const filteredProjects = useMemo(() => {
        const searchLower = searchQuery.toLowerCase().trim();
        if (!searchLower) return projects;

        return projects.filter((project) =>
            project.name.toLowerCase().includes(searchLower) ||
            (project.description?.toLowerCase().includes(searchLower) ?? false) ||
            project.id.toLowerCase().includes(searchLower)
        );
    }, [projects, searchQuery]);

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
                    <SwitchButton options={switchActions} defaultSelected="grid" />
                </div>
            </div>

            <div className="text-sm text-muted-foreground">
                {searchQuery ? (
                    <>Showing {filteredProjects.length} of {projects.length} projects</>
                ) : (
                    <>{projects.length} project{projects.length !== 1 ? 's' : ''} total</>
                )}
            </div>

            {(!filteredProjects?.length && !loading) ? <EmptyState searchQuery={searchQuery} /> :
                viewMode === "grid" ?
                    <ProjectGridView projects={filteredProjects} loading={loading} /> : <ProjectTableView projects={filteredProjects} teamId={teamId} loading={loading} />
            }
            <CustomPagination limit={limit} page={page} totalItems={totalItems} onChange={onPaginationChange} />
        </div>
    );
}
