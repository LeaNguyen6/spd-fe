import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/MetricCard";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import TableData, { TableColumn } from "@/components/TableData";
import { AlertTriangle, CheckCircle, Clock, Database } from "lucide-react";

const QualityMonitoring = () => {
    // Mock data for Data Quality: Missing Values & Outliers
    const missingValuesData = [
        { name: 'vibration_x', Missing: 15, Outliers: 0 },
        { name: 'fuel_flow', Missing: 5, Outliers: 0 },
        { name: 'pressure_1', Missing: 0, Outliers: 17 },
        { name: 'temp_2', Missing: 0, Outliers: 8 },
        { name: 'vibration_y', Missing: 0, Outliers: 3 },
    ];

    // Mock data for Data Drift: Top 5 Features (PSI Score)
    const dataDriftData = [
        { name: 'temp_1', psi: 0.85 },
        { name: 'pressure_1', psi: 0.65 },
        { name: 'fuel_flow', psi: 0.55 },
        { name: 'vibration_1', psi: 0.45 },
        { name: 'vibration_2', psi: 0.35 },
    ];

    // Mock data for Model Drift: RUL Change Rate by Engine
    const modelDriftData = [
        { name: 'E4782', rate: 2.5 },
        { name: 'E2785', rate: 2.2 },
        { name: 'E1041', rate: 1.8 },
        { name: 'E1098', rate: 1.6 },
        { name: 'E3095', rate: 1.2 },
        { name: 'E2904', rate: 1.1 },
        { name: 'E4813', rate: 1.0 },
        { name: 'E4475', rate: 1.0 },
    ];

    // Mock data for System Health Overview
    const systemHealthData = [
        { name: 'Healthy', value: 27, fill: '#1eb3e1ff' },
        { name: 'Warning', value: 8, fill: 'hsl(var(--warning))' },
        { name: 'Critical', value: 3, fill: 'hsl(var(--destructive))' },
    ];

    // Mock data for Critical Issues & Alerts
    const criticalIssues = [
        {
            timestamp: '2025-10-26 14:23',
            category: 'Data Drift',
            feature: 'sensor_temperature_1',
            issue: 'PSI 0.21 (High drift)',
            severity: 'High'
        },
        {
            timestamp: '2025-10-26 14:15',
            category: 'Model Drift',
            feature: 'Engine_E4782',
            issue: 'Unstable predictions (rate: 2.7%)',
            severity: 'Unstable'
        },
        {
            timestamp: '2025-10-26 13:45',
            category: 'Data Quality',
            feature: 'sensor_vibration_x',
            issue: '18.5% missing values',
            severity: 'High'
        },
        {
            timestamp: '2025-10-26 13:30',
            category: 'Model Drift',
            feature: 'Engine_E2103',
            issue: 'Unstable predictions (rate: 2.06)',
            severity: 'Unstable'
        },
        {
            timestamp: '2025-10-26 12:30',
            category: 'Data Quality',
            feature: 'sensor_pressure_3',
            issue: '12 outliers detected (Z-score)',
            severity: 'Medium'
        },
        {
            timestamp: '2025-10-26 12:10',
            category: 'Data Drift',
            feature: 'sensor_pressure_2',
            issue: 'PSI 0.165 (Medium drift)',
            severity: 'Medium'
        },
        {
            timestamp: '2025-10-26 11:50',
            category: 'Data Quality',
            feature: 'fuel_flow_rate',
            issue: '6.2% missing values',
            severity: 'Medium'
        },
    ];

    const getSeverityVariant = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high':
            case 'critical':
                return 'destructive';
            case 'unstable':
                return 'secondary';
            case 'medium':
                return 'default';
            default:
                return 'outline';
        }
    };

    // Define columns for the critical issues table
    const criticalIssuesColumns: TableColumn<typeof criticalIssues[0]>[] = [
        {
            key: 'timestamp',
            header: 'TIMESTAMP',
            accessor: 'timestamp',
            className: 'text-xs',
            headerClassName: 'text-sm font-medium text-muted-foreground',
        },
        {
            key: 'category',
            header: 'CATEGORY',
            accessor: 'category',
            className: 'text-xs',
            headerClassName: 'text-sm font-medium text-muted-foreground',
        },
        {
            key: 'feature',
            header: 'FEATURE / ENGINE',
            accessor: 'feature',
            className: 'text-xs font-mono',
            headerClassName: 'text-sm font-medium text-muted-foreground',
        },
        {
            key: 'issue',
            header: 'ISSUE',
            accessor: 'issue',
            className: 'text-xs',
            headerClassName: 'text-sm font-medium text-muted-foreground',
        },
        {
            key: 'severity',
            header: 'SEVERITY',
            accessor: 'severity',
            headerClassName: 'text-sm font-medium text-muted-foreground',
            render: (value) => (
                <Badge variant={getSeverityVariant(value as string)} className="text-xs">
                    {value as string}
                </Badge>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="DATA QUALITY"
                    value="92.5%"
                    subtitle="27/30 features healthy"
                    icon={<Database className="w-4 h-4" />}
                    variant="success"
                />
                <MetricCard
                    title="DATA DRIFT (PSI)"
                    value="0.21"
                    subtitle="4 features drifted"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    variant="warning"
                />
                <MetricCard
                    title="MODEL STABILITY"
                    value="75%"
                    subtitle="15/20 engines stable"
                    icon={<CheckCircle className="w-4 h-4" />}
                />
                <MetricCard
                    title="CRITICAL ISSUES"
                    value="7"
                    subtitle="Requires attention"
                    icon={<Clock className="w-4 h-4" />}
                    variant="destructive"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Quality: Missing Values & Outliers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={missingValuesData}
                            bars={[
                                { dataKey: 'Missing', fill: '#1eb3e1ff', name: 'Missing' },
                                { dataKey: 'Outliers', fill: '#f59e0b', name: 'Outliers' }
                            ]}
                            height={250}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Drift: Top 5 Features (PSI Score)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={dataDriftData}
                            bars={[
                                { dataKey: 'psi', fill: 'hsl(var(--primary))' }
                            ]}
                            height={250}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Second Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Model Drift: RUL Change Rate by Engine</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={modelDriftData}
                            bars={[
                                { dataKey: 'rate', fill: '#1eb3e1ff' }
                            ]}
                            height={250}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">System Health Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PieChart
                            data={systemHealthData}
                            height={250}
                            showLegend={true}
                            innerRadius={50}
                            outerRadius={90}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Critical Issues Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Critical Issues & Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <TableData
                        data={criticalIssues}
                        columns={criticalIssuesColumns}
                        emptyMessage="No critical issues found"
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default QualityMonitoring;