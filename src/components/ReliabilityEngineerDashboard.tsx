import MetricCard from "@/components/MetricCard";
import { Activity, TrendingUp } from "lucide-react";

const ReliabilityEngineerDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">Reliability Engineer Dashboard</h2>
                <p className="text-muted-foreground">Analyze performance and optimize maintenance strategies</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Model Accuracy" value="96.2%" subtitle="+1.2% improvement" trend="up" variant="success" icon={<TrendingUp className="w-4 h-4" />} />
                <MetricCard title="Prediction Confidence" value="92%" icon={<Activity className="w-4 h-4" />} />
                <MetricCard title="MTBF Average" value="2,847h" subtitle="Mean time between failures" icon={<Activity className="w-4 h-4" />} />
                <MetricCard title="Cost Savings" value="$1.2M" subtitle="vs reactive maintenance" trend="up" variant="success" icon={<TrendingUp className="w-4 h-4" />} />
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
        </div>
    );
};

export default ReliabilityEngineerDashboard;