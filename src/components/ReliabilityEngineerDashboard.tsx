import { useState, useEffect } from "react";
import MetricCard from "@/components/MetricCard";
import { Activity, TrendingUp, Loader2, ShieldAlert, AlertTriangle } from "lucide-react";
import { PrecisionRecallChart } from "./PrecisionRecallChart";
import QualityMonitoring from "./QualityMonitoring";
import { apiService, type ReliabilityStats } from "@/services/index";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReliabilityEngineerDashboard = () => {
    const [reliabilityStats, setReliabilityStats] = useState<ReliabilityStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReliabilityStats = async () => {
            try {
                setLoading(true);

                const stats = await apiService.getReliabilityStats();
                setReliabilityStats(stats);
            } catch (error) {
                console.error("Failed to load reliability stats:", error);
                toast({
                    title: "Error",
                    description: "Failed to load reliability statistics",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadReliabilityStats();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">Reliability Engineer Dashboard</h2>
                <p className="text-muted-foreground">Analyze performance and optimize maintenance strategies</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-muted-foreground">Loading reliability statistics...</p>
                </div>
            ) : (
                <Tabs defaultValue="model-performance" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="model-performance">Model Performance</TabsTrigger>
                        <TabsTrigger value="quality-monitoring">Quality Monitoring</TabsTrigger>
                    </TabsList>

                    <TabsContent value="model-performance" className="space-y-6 mt-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <MetricCard title="Model Accuracy" value={`${(reliabilityStats?.f1_score * 100).toFixed(2)}%`} variant="success" icon={<TrendingUp className="w-4 h-4" />} />
                            <MetricCard title="Mean Squared Error" value={`${reliabilityStats?.mean_squared_error.toFixed(2) || 0} cycles`} icon={<ShieldAlert className="w-4 h-4" />} />
                            <MetricCard title="Mean Absolute Error" value={`${reliabilityStats?.mean_absolute_error.toFixed(2) || 0} cycles`} variant="warning" icon={<AlertTriangle className="w-4 h-4" />} />
                            <MetricCard title="Mean Absolute Percentage Error" value={`${reliabilityStats?.mean_absolute_percentage_error.toFixed(2) || 0}%`} icon={<Activity className="w-4 h-4" />} />
                        </div>

                        <div className="bg-card rounded-lg border p-6 shadow-card">
                            {reliabilityStats && (
                                <PrecisionRecallChart
                                    precisionArray={reliabilityStats.precision}
                                    recallArray={reliabilityStats.recall}
                                />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="quality-monitoring" className="space-y-6 mt-6">
                        <QualityMonitoring />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default ReliabilityEngineerDashboard;