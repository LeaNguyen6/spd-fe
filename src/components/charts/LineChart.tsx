import * as React from "react";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface LineChartProps {
    data: Array<Record<string, string | number>>;
    config: ChartConfig;
    className?: string;
    width?: number;
    height?: number;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    xAxisKey?: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: boolean | object;
    legendPosition?: "top" | "bottom";
    tooltipFormatter?: (value: string | number, name: string) => [React.ReactNode, string];
    xAxisFormatter?: (value: string | number) => string;
    yAxisFormatter?: (value: string | number) => string;
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
    (
        {
            data,
            config,
            className,
            width,
            height = 300,
            showGrid = true,
            showTooltip = true,
            showLegend = false,
            showXAxis = true,
            showYAxis = true,
            xAxisKey = "name",
            strokeWidth = 2,
            dot = false,
            activeDot = { r: 4 },
            legendPosition = "bottom",
            tooltipFormatter,
            xAxisFormatter,
            yAxisFormatter,
            ...props
        },
        ref
    ) => {
        // Extract data keys from config for lines
        const dataKeys = Object.keys(config).filter(key => key !== xAxisKey);

        return (
            <div ref={ref} className={cn("w-full", className)} {...props}>
                <ChartContainer config={config} className="w-full" style={{ height }}>
                    <RechartsLineChart data={data} width={width} height={height}>
                        {showGrid && (
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        )}

                        {showXAxis && (
                            <XAxis
                                dataKey={xAxisKey}
                                tickLine={false}
                                axisLine={false}
                                className="text-xs fill-muted-foreground"
                                tickFormatter={xAxisFormatter}
                            />
                        )}

                        {showYAxis && (
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                className="text-xs fill-muted-foreground"
                                tickFormatter={yAxisFormatter}
                            />
                        )}

                        {showTooltip && (
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        nameKey="name"
                                        formatter={tooltipFormatter}
                                    />
                                }
                            />
                        )}

                        {showLegend && (
                            <ChartLegend
                                content={
                                    <ChartLegendContent
                                        verticalAlign={legendPosition}
                                        nameKey="name"
                                    />
                                }
                            />
                        )}

                        {dataKeys.map((key) => {
                            const lineConfig = config[key];
                            const color = lineConfig?.color || `var(--color-${key})`;

                            return (
                                <Line
                                    key={key}
                                    dataKey={key}
                                    type="monotone"
                                    stroke={color}
                                    strokeWidth={strokeWidth}
                                    dot={dot}
                                    activeDot={activeDot}
                                    name={String(lineConfig?.label || key)}
                                />
                            );
                        })}
                    </RechartsLineChart>
                </ChartContainer>
            </div>
        );
    }
);
