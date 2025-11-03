"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { LayoutGrid, List, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { SwitchButton } from "../ui/switchButton";
import AddTeam from "./addTeam";
import { TeamCard } from "./teamCard";
import { apiConstants } from "@/constants/api.constants";
import api from "@/lib/axios";
import { ActionResponse } from "@/types/common";
import { Team } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";

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
function TeamGridView({ teams, loading }: { teams: Team[]; loading: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                loading ?
                    Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-32 w-full" />
                    ))
                    :
                    teams.map((team) => <TeamCard key={team.id} team={team} />)
            }
        </div>
    );
}

function TeamTableView({ teams, teamId, loading }: { teams: Team[]; teamId: string; loading: boolean }) {

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
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
                                </TableRow>
                            ))
                            :
                            teams.map((team) => (
                                <TableRow key={team.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{team.name}</div>
                                            {/* <div className="text-sm text-muted-foreground">
                                                ID: {team?.id.slice(0, 8)}...
                                            </div> */}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(team.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Active</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline">
                                            <Link href={`/${teamId}/${team.id}`}>
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
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
                {searchQuery
                    ? "No projects match your search criteria."
                    : "Get started by creating your first project."
                }
            </p>
            {!searchQuery && (
                <AddTeam triggerVariant="default" />
            )}
        </div>
    );
}

export function TeamList() {
    const [searchQuery, setSearchQuery] = useState("");
    const { teams, setTeams } = useStore((state) => state);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const teamId = params.teamId as string;

    // Memoize keyboard shortcuts setup
    useEffect(() => {
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

    const getTeams = useCallback(async () => {
        setLoading(true);
        try {
            debugger
            const res = await api.get<ActionResponse<Team[]>>(apiConstants.team.getTeams());
            debugger
            if (!res?.data?.success) {
                toast.error("Failed to load teams");
                return;
            }
            setTeams(res.data.data || []);
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    }, [setTeams])

    // Memoize filtered projects to prevent unnecessary recalculations
    const filteredTeams = useMemo(() => {
        const searchLower = searchQuery.toLowerCase().trim();
        if (!searchLower) return teams;

        return teams.filter((team) =>
            team?.name?.toLowerCase().includes(searchLower) ||
            team?.id?.toLowerCase().includes(searchLower)
        );
    }, [teams, searchQuery]);

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
                    <h1 className="text-2xl font-bold">Teams</h1>
                    <p className="text-muted-foreground">
                        Manage and organize your teams
                    </p>
                </div>
                <AddTeam onSuccess={() => getTeams()} />
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
                    <>Showing {filteredTeams.length} of {teams.length} teams</>
                ) : (
                    <>{teams.length} team{teams.length !== 1 ? 's' : ''} total</>
                )}
            </div>

            {!filteredTeams?.length ? <EmptyState searchQuery={searchQuery} /> :
                viewMode === "grid" ?
                    <TeamGridView teams={filteredTeams} loading={loading} /> : <TeamTableView teams={filteredTeams} teamId={teamId} loading={loading} />
            }
        </div>
    );
}
