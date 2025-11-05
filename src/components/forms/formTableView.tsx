
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";


function FormTableView({ forms, teamId, loading }: { forms: Partial<Form>[]; teamId: string; loading: boolean }) {
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
                                                ID: {form.id!.slice(0, 8)}...
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] truncate">
                                            {form.description || "No description"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(form.createdAt!)}</TableCell>
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

export default FormTableView;