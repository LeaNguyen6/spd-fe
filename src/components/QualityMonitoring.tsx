import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/MetricCard";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import TableData, { TableColumn } from "@/components/TableData";
import { AlertTriangle, CheckCircle, Clock, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { sapApi, MonitorsDrift, MonitorsModelDrift } from "@/services/sapApi";
import RetrainModel from "./RetrainModel";
import SelectModelDialog from "./SelectModelDialog";

const QualityMonitoring = () => {
    const [monitorsDrift, setMonitorsDrift] = useState<MonitorsDrift | null>(null);
    const [monitorsModelDrift, setMonitorsModelDrift] = useState<MonitorsModelDrift | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchMonitorsData = async () => {
        try {
            setIsLoading(true);
            const [driftData, modelDriftData] = await Promise.all([
                sapApi.getMonitorsDrift(),
                sapApi.getMonitorsModelDrift()
            ]);
            setMonitorsDrift(driftData);
            setMonitorsModelDrift(modelDriftData);
        } catch (error) {
            console.error("Failed to fetch monitors data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitorsData();
    }, []);
    // Transform API data for charts
    const missingValuesData = monitorsDrift?.top_missing_values.slice(0, 5).map(item => ({
        name: item.engine_id,
        count: item.count
    })) || [];

    const outliersData = monitorsDrift?.top_outliers.slice(0, 5).map(item => ({
        name: item.engine_id,
        count: item.count
    })) || [];

    // Data Drift: Top 5 Features
    const dataDriftData = monitorsDrift?.top_data_drift.slice(0, 5).map(item => ({
        name: item.engine_id,
        count: item.count
    })) || [];

    // System Health Overview from data quality
    const systemHealthData = monitorsDrift ? [
        { name: 'Healthy', value: monitorsDrift.data_quality.healthy_engines, fill: '#1eb3e1ff' },
        { name: 'Medium ', value: monitorsDrift.data_quality.medium_issue_engines, fill: 'hsl(var(--warning))' },
        { name: 'Critical', value: monitorsDrift.data_quality.critical_issue_engines, fill: 'hsl(var(--destructive))' },
    ] : [];

    // Critical Issues from API - sorted by severity priority
    const getSeverityPriority = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 1;
            case 'high': return 2;
            case 'medium': return 3;
            case 'low': return 4;
            default: return 5;
        }
    };

    const criticalIssues = monitorsDrift?.critical_issues.sort((a, b) => {
        const priorityA = getSeverityPriority(a.severity);
        const priorityB = getSeverityPriority(b.severity);
        return priorityA - priorityB;
    }) || [];

    // Calculate data quality score
    const dataQualityScore = monitorsDrift?.data_quality.score
        ? `${monitorsDrift.data_quality.score.toFixed(1)}%`
        : '0';

    const healthyFeatures = monitorsDrift?.data_quality.healthy_engines || 0;
    const totalFeatures = monitorsDrift?.data_quality.total_engines || 0;

    // Calculate model stability
    const stableEngines = monitorsModelDrift
        ? monitorsModelDrift.total_engines - monitorsModelDrift.unstable_engines
        : 0;
    const modelStability = monitorsModelDrift?.total_engines
        ? `${((stableEngines / monitorsModelDrift.total_engines) * 100).toFixed(0)}%`
        : '0%';

    // Count critical issues
    const criticalIssuesCount = monitorsDrift?.data_quality.critical_issues || 0;

    const getSeverityVariant = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high':
            case 'critical':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'unstable':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    // Define columns for the critical issues table
    const criticalIssuesColumns: TableColumn<Record<string, unknown>>[] = [
        {
            key: 'engine_id',
            header: 'ENGINE',
            accessor: 'engine_id',
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
            header: 'FEATURE',
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
                <Badge variant={getSeverityVariant(value as string)} className="text-xs uppercase">
                    {value as string}
                </Badge>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading monitors data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="DATA QUALITY"
                    value={dataQualityScore}
                    subtitle={`${healthyFeatures}/${totalFeatures} engines healthy`}
                    icon={<Database className="w-4 h-4" />}
                    variant="success"
                />
                <MetricCard
                    title="DATA DRIFT"
                    value={monitorsDrift?.top_data_drift.length.toString() || '0'}
                    subtitle="engines with drift"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    variant="warning"
                />
                <MetricCard
                    title="MODEL STABILITY"
                    value={modelStability}
                    subtitle={`${stableEngines}/${monitorsModelDrift?.total_engines || 0} engines stable`}
                    icon={<CheckCircle className="w-4 h-4" />}
                />
                <MetricCard
                    title="CRITICAL ISSUES"
                    value={criticalIssuesCount.toString()}
                    subtitle="Requires attention"
                    icon={<Clock className="w-4 h-4" />}
                    variant="destructive"
                />
            </div>
            <div className="flex gap-2">
                <RetrainModel />
                <SelectModelDialog onModelSelected={fetchMonitorsData} />
            </div>
            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Quality: Missing Values</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            missingValuesData.length === 0 ? (
                                <div className="my-12 text-sm text-center text-muted-foreground">
                                    No Missing Values Data
                                </div>
                            ) : (<BarChart
                                data={missingValuesData}
                                bars={[
                                    { dataKey: 'count', fill: '#1eb3e1ff', name: 'Missing Values' }
                                ]}
                                height={250}
                            />)
                        }

                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Quality: Outliers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {outliersData.length === 0 ? (
                            <div className="my-12 text-sm text-center text-muted-foreground">
                                No Outliers Data
                            </div>
                        ) : (<BarChart
                            data={outliersData}
                            bars={[
                                { dataKey: 'count', fill: '#f59e0b', name: 'Outliers' }
                            ]}
                            height={250}
                        />)}

                    </CardContent>
                </Card>
            </div>

            {/* Second Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Drift: Top 5 Engines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dataDriftData.length === 0 ? (
                            <div className="my-12 text-sm text-center text-muted-foreground">
                                No Drift Engine
                            </div>
                        ) : (
                            <BarChart
                                data={dataDriftData}
                                bars={[
                                    { dataKey: 'count', fill: 'hsl(var(--primary))' }
                                ]}
                                height={250}
                            />)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">System Health Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {systemHealthData.length === 0 ? (
                            <div className="my-12 text-sm text-center text-muted-foreground">
                                No data available
                            </div>
                        ) : (
                            <PieChart
                                data={systemHealthData}
                                height={250}
                                showLegend={true}
                                innerRadius={50}
                                outerRadius={90}
                            />
                        )}
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
                        data={criticalIssues as unknown as Record<string, unknown>[]}
                        columns={criticalIssuesColumns}
                        emptyMessage="No critical issues found"
                        pagination={{
                            enabled: true,
                            pageSize: 10
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default QualityMonitoring;