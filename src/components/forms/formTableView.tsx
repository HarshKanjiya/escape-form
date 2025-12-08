import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes.constants";
import { Form, FormStatus, FormType } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { EyeIcon, PencilRulerIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";


function FormTableView({ forms, teamId, loading, projectId }: { forms: Partial<Form>[]; teamId: string; loading: boolean, projectId: string }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-background">
                    <TableHead className="!max-w-18 !w-16">&nbsp;</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead className="w-[120px] text-center">Last Updated</TableHead>
                    <TableHead className="w-[100px] text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="!p-3">
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
                                <TableCell className="w-18">
                                    <div className="flex items-center justify-center">
                                        <Image src={form.logoUrl || "/logo-light.png"} alt="Form Logo" width={32} height={32} className="rounded-md" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{form.name}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[300px] truncate">
                                        {form.description || "No description"}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant='outline'>
                                        {form.type == FormType.REACH_OUT ? 'Reach Out' : 'Embedded'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant='outline'>
                                        {
                                            form.status == FormStatus.DRAFT ? 'Draft' :
                                                form.status == FormStatus.PUBLISHED ? 'Published' :
                                                    form.status == FormStatus.ARCHIVED ? 'Archived' :
                                                        form.status == FormStatus.CLOSED ? 'Archived' : 'Unknown'
                                        }
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {/* @ts-expect-error _count not added in generated type*/}
                                    {form._count?.responses || 0}
                                </TableCell>
                                <TableCell className="tracking-widest">{formatDate(form.updatedAt!)}</TableCell>
                                <TableCell className="pr-2">
                                    <div className="flex gap-2">
                                        <Link href={ROUTES.form.analytics(teamId, projectId, form.id as string)}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="icon" variant="outline">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent >
                                                    <TooltipArrow />
                                                    View Analytics
                                                </TooltipContent>
                                            </Tooltip>
                                        </Link>
                                        <Link href={ROUTES.form.edit(teamId, projectId, form.id as string)}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="icon" variant="outline">
                                                        <PencilRulerIcon className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <TooltipArrow />
                                                    Edit Form
                                                </TooltipContent>
                                            </Tooltip>
                                        </Link>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="icon" variant="destructive">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <TooltipArrow />
                                                Delete Form
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))

                }
            </TableBody>
        </Table>
    );
}

export default FormTableView;