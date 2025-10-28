import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    showPageSizeSelector?: boolean;
    showItemsInfo?: boolean;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50, 100],
    className,
    showPageSizeSelector = true,
    showItemsInfo = true,
}) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisible = 7; // Maximum number of page buttons to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage <= 4) {
                // Near the beginning
                for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
                    pages.push(i);
                }
                if (totalPages > 5) {
                    pages.push("ellipsis");
                }
            } else if (currentPage >= totalPages - 3) {
                // Near the end
                if (totalPages > 5) {
                    pages.push("ellipsis");
                }
                for (let i = Math.max(totalPages - 4, 2); i <= totalPages - 1; i++) {
                    pages.push(i);
                }
            } else {
                // In the middle
                pages.push("ellipsis");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("ellipsis");
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    if (totalPages <= 1 && !showPageSizeSelector && !showItemsInfo) {
        return null;
    }

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t bg-background/50", className)}>
            {/* Left section - Page size selector */}
            <div className="flex items-center space-x-2 order-2 sm:order-1">
                {showPageSizeSelector && (
                    <>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">Show</p>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => onPageSizeChange(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px] bg-background">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">entries</p>
                    </>
                )}
            </div>

            {/* Center section - Items info */}
            {showItemsInfo && (
                <div className="flex items-center text-sm text-muted-foreground order-3 sm:order-2">
                    {totalItems > 0 ? (
                        <span className="whitespace-nowrap">
                            Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
                            <span className="font-medium text-foreground">{endItem}</span> of{" "}
                            <span className="font-medium text-foreground">{totalItems}</span> results
                        </span>
                    ) : (
                        <span>No results found</span>
                    )}
                </div>
            )}

            {/* Right section - Pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center space-x-2 order-1 sm:order-3">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 hover:bg-accent",
                                        currentPage <= 1 && "pointer-events-none opacity-50"
                                    )}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === "ellipsis" ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            onClick={() => onPageChange(page)}
                                            isActive={currentPage === page}
                                            className={cn(
                                                "cursor-pointer transition-all duration-200 hover:bg-accent",
                                                currentPage === page && "bg-primary text-primary-foreground hover:bg-primary/90"
                                            )}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 hover:bg-accent",
                                        currentPage >= totalPages && "pointer-events-none opacity-50"
                                    )}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default TablePagination;