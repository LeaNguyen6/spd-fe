import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
    data: Array<{
        name: string;
        [key: string]: string | number;
    }>;
    bars: Array<{
        dataKey: string;
        fill: string;
        name?: string;
    }>;
    title?: string;
    height?: number;
}

const BarChart = ({ data, bars, title, height = 300 }: BarChartProps) => {
    return (
        <div className="w-full">
            {title && <h4 className="text-sm font-medium mb-4">{title}</h4>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="name"
                        className="text-xs fill-muted-foreground"
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        className="text-xs fill-muted-foreground"
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                        }}
                    />
                    {bars.length > 1 && <Legend />}
                    {bars.map((bar, index) => (
                        <Bar
                            key={index}
                            dataKey={bar.dataKey}
                            fill={bar.fill}
                            name={bar.name}
                            radius={[2, 2, 0, 0]}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;