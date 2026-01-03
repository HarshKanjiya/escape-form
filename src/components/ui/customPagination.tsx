import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "./button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface CustomPaginationProps {
    page: number;
    limit: number;
    totalItems: number;
    loading?: boolean;
    onChange: (page: number, limit: number) => void;
}

const CustomPagination = ({ page, limit, totalItems, loading, onChange }: CustomPaginationProps) => {

    // if (loading || totalItems === 0 || totalItems <= Number(process.env.DEFAULT_PAGINATION_LIMIT || 10)) {
    //     return null
    // }

    const totalPages = Math.ceil(totalItems / limit);


    const changePage = (newPage: number) => {
        onChange(newPage, limit);
    }

    const getVisiblePages = () => {
        const maxVisible = 5;
        const halfVisible = Math.floor(maxVisible / 2);

        let startPage = Math.max(1, page - halfVisible);
        const endPage = Math.min(totalPages, startPage + maxVisible - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );
    };


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
                    showing {(page - 1) * limit + 1} to {page * limit} of {totalItems}
                </span>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button variant="ghost" size="icon" onClick={() => changePage(1)}
                                disabled={page === 1}>
                                <ChevronFirst />
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button variant="ghost" size="icon" onClick={() => changePage(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft />
                            </Button>
                        </PaginationItem>
                        {getVisiblePages().map((pageNum) => (
                            <PaginationItem key={pageNum} onClick={() => changePage(pageNum)}>
                                <PaginationLink
                                    isActive={pageNum === page}
                                    className={pageNum === page ? cn("shadow-none hover:text-secondary-foreground border-none", buttonVariants({ variant: "outline", size: "icon", className: 'dark:!bg-muted' })) : ""}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <Button variant="ghost" size="icon" onClick={() => changePage(page + 1)}
                                disabled={page === totalPages}>
                                <ChevronRight />
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button variant="ghost" size="icon" onClick={() => changePage(totalPages)}
                                disabled={page === totalPages}>
                                <ChevronLast />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default CustomPagination