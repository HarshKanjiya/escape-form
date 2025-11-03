import { Label } from "@radix-ui/react-label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button, buttonVariants } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
    page: number;
    limit: number;
    totalItems: number;
    onChange: (page: number, limit: number) => void;
}

const CustomPagination = ({ page, limit, totalItems, onChange }: CustomPaginationProps) => {


    // if (totalItems === 0 || limit <= Number(process.env.DEFAULT_PAGINATION_LIMIT || 10)) {
    //     return null
    // }

    return (
        <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">Rows per page:</Label>
                <Select
                    value={limit.toString()}
                    onValueChange={(rowsPerPage) => onChange(page, +rowsPerPage)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {(page - 1) * limit + 1}-{page * limit} of {totalItems}
                </span>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                isActive
                                className={cn(
                                    "shadow-none! hover:text-secondary-foreground! border-none!",
                                    buttonVariants({
                                        variant: "secondary",
                                        size: "icon",
                                    })
                                )}
                            >
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                {/* <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                aria-label="Go to previous page"
                                size="icon"
                                variant="ghost"
                                disabled={page === 1}
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                aria-label="Go to next page"
                                size="icon"
                                variant="ghost"
                                disabled={page * limit >= totalItems}
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination> */}
            </div>
        </div>
    )
}

export default CustomPagination