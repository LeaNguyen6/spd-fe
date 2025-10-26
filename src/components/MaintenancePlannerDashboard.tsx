import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import WorkOrderCard from "@/components/WorkOrderCard";
import CreateWorkOrderDialog from "@/components/CreateWorkOrderDialog";
import { Activity, TrendingUp, Wrench, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiService, type Asset, type WorkOrder, logApiUsage } from "@/services/index";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@/types/roles";

// Normalized WorkOrder type for the component
interface NormalizedWorkOrder {
    id: string;
    assetId: string;
    assetName: string;
    type: string;
    priority: "critical" | "high" | "medium" | "low";
    assignedTo: string;
    scheduledDate: string;
    status: "pending" | "in-progress" | "completed";
    sapOrderNumber?: string;
}

interface MaintenancePlannerDashboardProps {

    onWorkOrderCreated: () => Promise<void>;
}

const MaintenancePlannerDashboard = ({

    onWorkOrderCreated
}: MaintenancePlannerDashboardProps) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [workOrders, setWorkOrders] = useState<NormalizedWorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadAssets();
        loadWorkOrders();
    }, []);

    const loadAssets = async () => {
        try {
            setLoading(true);
            logApiUsage("Loading assets data");
            const assetsData = await apiService.getAssets();
            console.log('Assets:', assetsData);
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
            logApiUsage("Loading work orders data");
            const workOrdersData = await apiService.getWorkOrders();
            console.log('Work Orders:', workOrdersData);

            // Transform the data to normalized format
            const normalizedOrders: NormalizedWorkOrder[] = workOrdersData.map((order: WorkOrder) => ({
                id: order.id,
                assetName: `Asset ${order.assetId}`, // Since real API doesn't have assetName, create it
                assetId: order.assetId,
                type: order.type,
                priority: order.priority.toLowerCase() as "critical" | "high" | "medium" | "low",
                assignedTo: order.assignedTo,
                scheduledDate: order.scheduledDate,
                status: order.status,
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
                    <CreateWorkOrderDialog onWorkOrderCreated={loadWorkOrders} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Open Work Orders" value="156" icon={<Wrench className="w-4 h-4" />} />
                <MetricCard title="Scheduled This Week" value="34" subtitle="12 high priority" variant="warning" icon={<Activity className="w-4 h-4" />} />
                <MetricCard title="Completion Rate" value="94%" subtitle="+3% vs last month" trend="up" variant="success" icon={<TrendingUp className="w-4 h-4" />} />
                <MetricCard title="Resource Utilization" value="87%" icon={<Activity className="w-4 h-4" />} />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Active Work Orders</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workOrders.map((order) => (
                        <WorkOrderCard key={order.id} {...order} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MaintenancePlannerDashboard;