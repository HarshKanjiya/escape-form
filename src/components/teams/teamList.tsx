"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiConstants } from "@/constants/api.constants";
import { getErrorMessage, MESSAGE } from "@/constants/messages";
import { LIST_VIEW_TYPE } from "@/enums/common";
import { Team } from "@prisma/client";
import { usePagination } from "@/hooks/usePagination";
import api from "@/lib/axios";
import { showError } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { ActionResponse } from "@/types/common";
import { debounce } from "lodash";
import { Building2Icon, LayoutGrid, List, Search, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IconCard } from "../shared/iconCard";
import CustomPagination from "../ui/customPagination";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Separator } from "../ui/separator";
import { SwitchButton } from "../ui/switchButton";
import AddTeam from "./addTeam";
import EmptyState from "./teamEmptyState";
import TeamGridView from "./teamGridView";
import TeamTableView from "./teamTableView";


export function TeamList() {
    const [searchQuery, setSearchQuery] = useState("");
    const { teams, setTeams } = useGlobalStore((state) => state);
    const [viewMode, setViewMode] = useState<string>(LIST_VIEW_TYPE.GRID);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const teamId = params.teamId as string;

    const { page, limit, totalItems, onPaginationChange, setTotalItems } = usePagination();

    useEffect(() => {
        getTeams();
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

    const getTeams = async () => {
        setLoading(true);
        try {
            const res = await api.get<ActionResponse<Team[]>>(apiConstants.team.getTeams());
            if (!res?.data?.success) {
                showError(res.data.message || getErrorMessage('teams'));
                return;
            }
            setTeams(res.data.data || []);
            setTotalItems(res.data.data?.length || 0);
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            showError(getErrorMessage('teams'), MESSAGE.PLEASE_TRY_AGAIN_LATER);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        getTeams();
    }, [page, limit]);

    const debounceFn = debounce(getTeams, 500);
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
                    <IconCard icon={Building2Icon} />
                    <div>
                        <h1 className="text-2xl font-medium">Teams</h1>
                        <p className="text-muted-foreground">
                            Manage and organize your teams
                        </p>
                    </div>
                </div>
                <AddTeam onSuccess={() => getTeams()} />
            </div>

            <div className="flex flex-row gap-4 items-center justify-between">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <div className="relative">
                        <Input
                            placeholder="Search projects"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-20 bg-background! dark:bg-muted! border border-muted"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                            <KbdGroup className="text-muted-foreground">
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
                {teams.length} team{teams.length !== 1 ? 's' : ''} total
            </div>

            {!teams?.length ? <EmptyState searchQuery={searchQuery} /> :
                viewMode === "grid" ?
                    <TeamGridView teams={teams} loading={loading} /> : <TeamTableView teams={teams} teamId={teamId} loading={loading} />
            }
            {teams.length > 0 && <Separator />}
            <CustomPagination loading={loading} limit={limit} page={page} totalItems={totalItems} onChange={onPaginationChange} />
        </div>
    );
}
