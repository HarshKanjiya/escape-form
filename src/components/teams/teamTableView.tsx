import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Team } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Eye, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";


function TeamTableView({ teams, teamId, loading }: { teams: Team[]; teamId: string; loading: boolean }) {

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
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
                                </TableRow>
                            ))
                            :
                            teams.map((team) => (
                                <TableRow key={team.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{team.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="tracking-widest">{formatDate(team.createdAt)}</TableCell>
                                    <TableCell className="flex gap-3 p-2">
                                        <Link href={`/${teamId}/${team.id}`}>
                                            <Button size="icon" variant="outline">
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

export default TeamTableView;