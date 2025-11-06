import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { useGlobalStore } from "@/store/useStore";
import { Eye, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

function ProjectTableView({ projects, teamId, loading }: { projects: Project[]; teamId: string; loading: boolean }) {
    const { setActiveProject } = useGlobalStore((state) => state);

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

export default ProjectTableView;