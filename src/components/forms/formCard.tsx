"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes.constants";
import { Form, FormStatus, FormType } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { EyeIcon, MoreHorizontal, PencilRulerIcon, SaveAllIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface FormCardProps {
    form: Partial<Form>;
    projectId: string,
    teamId: string
}

export function FormCard({ form, projectId, teamId }: FormCardProps) {

    return (
        <Link href={ROUTES.form.analytics(teamId, projectId, form.id as string)} className="block">
            <Card className="p-4 sm:p-6 group relative transition-all duration-200 cursor-pointer bg-white dark:bg-accent overflow-hidden rounded-xl hover:bg-secondary/70 hover:border-primary border shadow-[0px_4px_33px_-10px_rgba(0,_0,_0,_0.05)] dark:shadow-none">
                <CardContent className="p-0 flex flex-col items-center justify-between h-34">
                    <div className="flex items-start space-x-4 w-full">
                        <div className="flex items-center justify-start w-full gap-4 sm:gap-6">
                            <div>
                                <Image src={form.logoUrl || "/logo-light.png"} alt="Form Logo" width={48} height={48} className="rounded-md" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-foreground line-clamp-1 mb-1">
                                    {form.name}
                                </h3>
                                <div className="flex items-center text-muted-foreground/60 dark:text-muted-foreground gap-2">
                                    {form?.description ? <span className=" line-clamp-1">{form.description}</span> : <span>No description</span>}
                                </div>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={ROUTES.form.analytics(teamId, projectId, form.id as string)} className="flex items-center gap-4 justify-start group">
                                        <EyeIcon className="w-4 h-4 group-hover:text-white" />
                                        Analytics
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={ROUTES.form.edit(teamId, projectId, form.id as string)} className="flex items-center gap-4 justify-start group">
                                        <PencilRulerIcon className="w-4 h-4 group-hover:text-white" />
                                        Edit form
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <div className="text-destructive flex items-center gap-4 justify-start group">
                                        <Trash2Icon className="text-destructive w-4 h-4 group-hover:text-white" />
                                        <span>Delete</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between w-full py-4">
                        <div className="flex items-center gap-2">
                            <Badge variant='outline'>
                                # {
                                    form.status == FormStatus.DRAFT ? 'Draft' :
                                        form.status == FormStatus.PUBLISHED ? 'Published' :
                                            form.status == FormStatus.ARCHIVED ? 'Archived' :
                                                form.status == FormStatus.CLOSED ? 'Archived' : 'Unknown'
                                }
                            </Badge>
                            <Badge variant='outline'>
                                # {form.type == FormType.REACH_OUT ? 'Reach Out' : 'Embedded'}
                            </Badge>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-between w-full border-t pt-4">
                        <div className="flex items-center gap-2">
                            <SaveAllIcon className="w-4 h-4 inline-block" />
                            {/* @ts-expect-error _count not added in generated type*/}
                            <span>{form?._count?.responses || 0} Responses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {form?.updatedAt && <span>Updated at <span className="tracking-widest ml-1">{formatDate(form?.updatedAt)}</span></span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
