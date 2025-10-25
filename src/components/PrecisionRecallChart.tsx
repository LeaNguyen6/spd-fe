import { type ChartConfig } from "@/components/ui/chart";
import { LineChart } from "./charts/LineChart";

interface PrecisionRecallChartProps {
    precisionArray: number[];
    recallArray: number[];
}

// Precision and Recall data
const createPrecisionRecallData = (precision: number[], recall: number[]) => {
    return precision.map((precisionValue, index) => ({
        threshold: (0.1 * (index + 1)).toFixed(1),
        precision: precisionValue,
        recall: recall[index]
    }));
};

// Precision-Recall chart configuration
const precisionRecallConfig: ChartConfig = {
    precision: {
        label: "Precision",
        color: "#3b82f6",
    },
    recall: {
        label: "Recall",
        color: "#ffc658",
    },
} satisfies ChartConfig;

export function PrecisionRecallChart({ precisionArray, recallArray }: PrecisionRecallChartProps) {
    // Generate the chart data using the mapping function
    const precisionRecallData = createPrecisionRecallData(precisionArray, recallArray);
    return (
        <div className="space-y-6">


            <div>
                <h3 className="text-lg font-semibold mb-4">Precision-Recall Curve</h3>
                <LineChart
                    data={precisionRecallData}
                    config={precisionRecallConfig}
                    // xAxisKey="threshold"
                    height={350}
                    showLegend={true}
                    showGrid={true}
                    strokeWidth={3}
                    dot={true}
                    activeDot={{ r: 6 }}
                    className="w-full"
                    tooltipFormatter={(value, name) => [
                        name,
                        ` : ${(Number(value)).toFixed(2)}`,
                    ]}
                // yAxisFormatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
                />
            </div>
        </div>
    );
}