import { useState, useEffect } from "react";
import MetricCard from "@/components/MetricCard";
import { Activity, TrendingUp, Loader2, ShieldAlert, ServerCrash } from "lucide-react";
import { PrecisionRecallChart } from "./PrecisionRecallChart";
import QualityMonitoring from "./QualityMonitoring";
import { apiService, logApiUsage, type ReliabilityStats } from "@/services/index";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReliabilityEngineerDashboard = () => {
    const [reliabilityStats, setReliabilityStats] = useState<ReliabilityStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReliabilityStats = async () => {
            try {
                setLoading(true);
                logApiUsage("Loading reliability statistics");
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
                            <MetricCard title="Mean Squared Error" value={`${reliabilityStats?.mean_squared_error.toFixed(2) || 0}`} icon={<ShieldAlert className="w-4 h-4" />} />
                            <MetricCard title="Mean Absolute Error" value={`${reliabilityStats?.mean_absolute_error.toFixed(2) || 0}`} icon={<ServerCrash className="w-4 h-4" />} />
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

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="bg-card rounded-lg border p-6 shadow-card">
                                <h3 className="text-lg font-semibold mb-4">AI Model Performance</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Failure Prediction Model</span>
                                            <span className="font-semibold">96.2%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-secondary" style={{ width: "96.2%" }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Maintenance Scheduling</span>
                                            <span className="font-semibold">94.8%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-secondary" style={{ width: "94.8%" }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Resource Optimization</span>
                                            <span className="font-semibold">91.5%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-secondary" style={{ width: "91.5%" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-lg border p-6 shadow-card">
                                <h3 className="text-lg font-semibold mb-4">Failure Pattern Analysis</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <span className="text-sm font-medium">Bearing Wear</span>
                                        <span className="text-sm text-muted-foreground">42% of failures</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <span className="text-sm font-medium">Seal Degradation</span>
                                        <span className="text-sm text-muted-foreground">28% of failures</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <span className="text-sm font-medium">Vibration Issues</span>
                                        <span className="text-sm text-muted-foreground">18% of failures</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <span className="text-sm font-medium">Other Causes</span>
                                        <span className="text-sm text-muted-foreground">12% of failures</span>
                                    </div>
                                </div>
                            </div>
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