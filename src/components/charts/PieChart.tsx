import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieChartProps {
    data: Array<{
        name: string;
        value: number;
        fill?: string;
    }>;
    title?: string;
    height?: number;
    showLegend?: boolean;
    innerRadius?: number;
    outerRadius?: number;
}

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--destructive))',
    'hsl(var(--accent))',
    'hsl(var(--muted-foreground))'
];

const PieChart = ({
    data,
    title,
    height = 300,
    showLegend = true,
    innerRadius = 60,
    outerRadius = 100
}: PieChartProps) => {
    const dataWithColors = data.map((item, index) => ({
        ...item,
        fill: item.fill || COLORS[index % COLORS.length]
    }));

    return (
        <div className="w-full">
            {title && <h4 className="text-sm font-medium mb-4">{title}</h4>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsPieChart>
                    <Pie
                        data={dataWithColors}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {dataWithColors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                        }}
                    />
                    {showLegend && (
                        <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            iconSize={12}
                            wrapperStyle={{ fontSize: '12px' }}
                        />
                    )}
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;