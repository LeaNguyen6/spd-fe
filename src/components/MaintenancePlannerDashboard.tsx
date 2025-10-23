import { useState } from "react";
import MetricCard from "@/components/MetricCard";
import WorkOrderCard from "@/components/WorkOrderCard";
import CreateWorkOrderDialog from "@/components/CreateWorkOrderDialog";
import { Activity, TrendingUp, Wrench, RefreshCw } from "lucide-react";
import { type WorkOrder } from "@/services/mockSapApi";
import { Button } from "@/components/ui/button";

interface MaintenancePlannerDashboardProps {
    workOrders: WorkOrder[];
    syncing: boolean;
    onSyncSap: () => Promise<void>;
    onWorkOrderCreated: () => Promise<void>;
}

const MaintenancePlannerDashboard = ({
    workOrders,
    syncing,
    onSyncSap,
    onWorkOrderCreated
}: MaintenancePlannerDashboardProps) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Maintenance Planner Dashboard</h2>
                    <p className="text-muted-foreground">Schedule and optimize maintenance operations</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={onSyncSap} disabled={syncing} variant="outline">
                        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <CreateWorkOrderDialog onWorkOrderCreated={onWorkOrderCreated} />
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