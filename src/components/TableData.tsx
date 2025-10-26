import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface TableColumn<T = Record<string, unknown>> {
    key: string;
    header: string;
    accessor?: keyof T | ((row: T) => unknown);
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
    width?: string | number;
}

export interface TableDataProps<T = Record<string, unknown>> {
    data: T[];
    columns: TableColumn<T>[];
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
    onRowClick?: (row: T, index: number) => void;
    rowClassName?: string | ((row: T, index: number) => string);
}

const TableData = <T extends Record<string, unknown>>({
    data,
    columns,
    className,
    emptyMessage = "No data available",
    loading = false,
    onRowClick,
    rowClassName,
}: TableDataProps<T>) => {
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
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-8">
                                <div className="text-muted-foreground">{emptyMessage}</div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow
                                key={index}
                                className={cn(
                                    onRowClick && "cursor-pointer hover:bg-muted/50",
                                    getRowClassName(row, index)
                                )}
                                onClick={() => onRowClick?.(row, index)}
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        className={column.className}
                                        style={{ width: column.width }}
                                    >
                                        {renderCell(row, column, index)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableData;