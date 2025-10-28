import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/TablePagination";
import { cn } from "@/lib/utils";

export interface TableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
    key: string;
    header: string;
    accessor?: keyof T | ((row: T) => unknown);
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
    width?: string | number;
}

export interface TableDataProps<T extends Record<string, unknown> = Record<string, unknown>> {
    data: T[];
    columns: TableColumn<T>[];
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
    onRowClick?: (row: T, index: number) => void;
    rowClassName?: string | ((row: T, index: number) => string);
    // Pagination props
    pagination?: {
        enabled: boolean;
        currentPage?: number;
        pageSize?: number;
        pageSizeOptions?: number[];
        onPageChange?: (page: number) => void;
        onPageSizeChange?: (pageSize: number) => void;
        showPageSizeSelector?: boolean;
        showItemsInfo?: boolean;
    };
}

const TableData = <T extends Record<string, unknown> = Record<string, unknown>>({
    data,
    columns,
    className,
    emptyMessage = "No data available",
    loading = false,
    onRowClick,
    rowClassName,
    pagination,
}: TableDataProps<T>) => {
    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(pagination?.currentPage || 1);
    const [pageSize, setPageSize] = React.useState(pagination?.pageSize || 10);

    // Calculate pagination
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = pagination?.enabled ? data.slice(startIndex, endIndex) : data;

    // Handle page changes
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        pagination?.onPageChange?.(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page
        pagination?.onPageSizeChange?.(newPageSize);
    };

    // Reset to first page when data changes
    React.useEffect(() => {
        if (pagination?.enabled && currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [data.length, totalPages, currentPage, pagination?.enabled]);
    // Get value from row using accessor
    const getCellValue = (row: T, column: TableColumn<T>) => {
        if (column.accessor) {
            if (typeof column.accessor === "function") {
                return column.accessor(row);
            }
            return row[column.accessor];
        }
        return row[column.key];
    };

    // Render cell content
    const renderCell = (row: T, column: TableColumn<T>, index: number) => {
        const value = getCellValue(row, column);

        if (column.render) {
            return column.render(value, row, index);
        }

        // Default rendering for common types
        if (value === null || value === undefined) {
            return <span className="text-muted-foreground">-</span>;
        }

        if (typeof value === "boolean") {
            return value ? "Yes" : "No";
        }

        return String(value);
    };

    // Get row class name
    const getRowClassName = (row: T, index: number) => {
        if (typeof rowClassName === "function") {
            return rowClassName(row, index);
        }
        return rowClassName || "";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className={cn("rounded-md border", className)}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={column.headerClassName}
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8">
                                    <div className="text-muted-foreground">{emptyMessage}</div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((row, index) => {
                                const actualIndex = pagination?.enabled ? startIndex + index : index;
                                return (
                                    <TableRow
                                        key={actualIndex}
                                        className={cn(
                                            onRowClick && "cursor-pointer hover:bg-muted/50",
                                            getRowClassName(row, actualIndex)
                                        )}
                                        onClick={() => onRowClick?.(row, actualIndex)}
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.key}
                                                className={column.className}
                                                style={{ width: column.width }}
                                            >
                                                {renderCell(row, column, actualIndex)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination?.enabled && totalItems > 0 && (
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={pagination.pageSizeOptions}
                    showPageSizeSelector={pagination.showPageSizeSelector}
                    showItemsInfo={pagination.showItemsInfo}
                />
            )}
        </div>
    );
};

export default TableData;