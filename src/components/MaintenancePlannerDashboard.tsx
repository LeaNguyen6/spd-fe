import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import WorkOrderCard from "@/components/WorkOrderCard";
import CreateWorkOrderDialog from "@/components/CreateWorkOrderDialog";
import { Activity, TrendingUp, Wrench, CheckCircle, Loader2 } from "lucide-react";
import { apiService, type Asset, type WorkOrder } from "@/services/index";
import { toast } from "@/hooks/use-toast";

// Normalized WorkOrder type for the component
interface NormalizedWorkOrder {
    id: string;
    assetId: string;
    assetName: string;
    type: string;
    priority: "critical" | "high" | "medium" | "low";
    assignedTo: string;
    scheduledDate: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    sapOrderNumber?: string;
}


const MaintenancePlannerDashboard = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [workOrders, setWorkOrders] = useState<NormalizedWorkOrder[]>([]);
    const [loading, setLoading] = useState(true);

    // Calculate metrics from workOrders
    const getScheduledThisWeek = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return workOrders.filter(order => {
            const scheduledDate = new Date(order.scheduledDate);
            return scheduledDate >= startOfWeek && scheduledDate <= endOfWeek;
        });
    };

    const getHighPriorityThisWeek = () => {
        const scheduledThisWeek = getScheduledThisWeek();
        return scheduledThisWeek.filter(order =>
            order.priority === 'critical' || order.priority === 'high'
        ).length;
    };

    const getCompletionRate = () => {
        if (workOrders.length === 0) return 0;
        const completedOrders = workOrders.filter(order => order.status === 'COMPLETED').length;
        return Math.round((completedOrders / workOrders.length) * 100);
    };

    const scheduledThisWeek = getScheduledThisWeek();
    const highPriorityThisWeek = getHighPriorityThisWeek();
    const completionRate = getCompletionRate();

    useEffect(() => {
        loadAssets();
        loadWorkOrders();
    }, []);

    const loadAssets = async () => {
        try {
            setLoading(true);

            const assetsData = await apiService.getAssets();
            setAssets(assetsData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load assets from SAP PM",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const loadWorkOrders = async () => {
        try {
            setLoading(true);

            const workOrdersData = await apiService.getWorkOrders();
            // Transform the data to normalized format
            const normalizedOrders: NormalizedWorkOrder[] = workOrdersData.map((order: WorkOrder) => ({
                id: order.id,
                assetName: `Asset ${order.assetId}`, // Since real API doesn't have assetName, create it
                assetId: order.assetId,
                type: order.type,
                priority: order.priority.toLowerCase() as "critical" | "high" | "medium" | "low",
                assignedTo: order.assignedTo,
                scheduledDate: order.scheduledDate,
                status: order.status, // Already in correct format
                sapOrderNumber: order.sapOrderNumber
            }));

            setWorkOrders(normalizedOrders);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load work orders from SAP PM",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Maintenance Planner Dashboard</h2>
                    <p className="text-muted-foreground">Schedule and optimize maintenance operations</p>
                </div>
                <div className="flex gap-3">
                    <CreateWorkOrderDialog assets={assets} onWorkOrderCreated={loadWorkOrders} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Open Work Orders" value={workOrders.length} icon={<Wrench className="w-4 h-4" />} />
                <MetricCard
                    title="Scheduled This Week"
                    value={scheduledThisWeek.length}
                    subtitle={`${highPriorityThisWeek} high priority`}
                    variant={highPriorityThisWeek > 0 ? "warning" : "default"}
                    icon={<Activity className="w-4 h-4" />}
                />

                <MetricCard title="Completed Work Orders" value={workOrders.filter(order => order.status === "COMPLETED").length} icon={<CheckCircle className="w-4 h-4" />} />
                <MetricCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    subtitle={completionRate >= 90 ? "Excellent performance" : completionRate >= 70 ? "Good performance" : "Needs improvement"}
                    variant={completionRate >= 90 ? "success" : completionRate >= 70 ? "default" : "warning"}
                    icon={<TrendingUp className="w-4 h-4" />}
                />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Active Work Orders</h3>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        <span className="ml-3 text-muted-foreground">Loading work orders...</span>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {workOrders.map((order) => (
                            <WorkOrderCard key={order.id} {...order} onStatusUpdated={loadWorkOrders} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenancePlannerDashboard;