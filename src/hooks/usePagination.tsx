import { useState } from "react";

const itemsPerPage = 10;

export const usePagination = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(itemsPerPage);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const goToNextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const onPaginationChange = (newPage: number, newLimit: number) => {
        setPage(newPage);
        setLimit(newLimit);
    }

    return {
        page,
        limit,
        totalPages,
        totalItems,
        setPage,
        setLimit,
        goToNextPage,
        goToPreviousPage,
        onPaginationChange,
        setTotalItems,
    };
};
