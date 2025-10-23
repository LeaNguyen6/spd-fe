import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import AssetHealthCard from "@/components/AssetHealthCard";
import WorkOrderCard from "@/components/WorkOrderCard";
import CreateWorkOrderDialog from "@/components/CreateWorkOrderDialog";
import { Activity, AlertTriangle, TrendingUp, Wrench, RefreshCw } from "lucide-react";
import { mockSapApi, type Asset, type WorkOrder } from "@/services/mockSapApi";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"assets" | "maintenance" | "reliability" | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole") as "assets" | "maintenance" | "reliability" | null;
    if (!role) {
      navigate("/");
    } else {
      setUserRole(role);
      loadData();
    }
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assetsData, workOrdersData] = await Promise.all([
        mockSapApi.getAssets(),
        mockSapApi.getWorkOrders(),
      ]);
      setAssets(assetsData);
      setWorkOrders(workOrdersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data from SAP PM",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSap = async () => {
    try {
      setSyncing(true);
      await mockSapApi.syncAssetData();
      await loadData();
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync data with SAP PM",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (!userRole || loading) {
    return null;
  }

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      {userRole === "assets" && (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Asset Manager Dashboard</h2>
              <p className="text-muted-foreground">Monitor asset health and manage replacement planning</p>
            </div>
            <Button onClick={handleSyncSap} disabled={syncing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              Sync SAP PM
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Assets" value="847" icon={<Activity className="w-4 h-4" />} />
            <MetricCard title="High-Risk Assets" value="23" subtitle="+3 from last week" trend="up" variant="warning" icon={<AlertTriangle className="w-4 h-4" />} />
            <MetricCard title="Avg Health Score" value="78%" subtitle="+2% improvement" trend="up" variant="success" icon={<TrendingUp className="w-4 h-4" />} />
            <MetricCard title="Pending Replacements" value="12" icon={<Wrench className="w-4 h-4" />} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Asset Health Overview</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {assets.map((asset) => (
                <AssetHealthCard key={asset.assetId} {...asset} />
              ))}
            </div>
          </div>
        </div>
      )}

      {userRole === "maintenance" && (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">Maintenance Planner Dashboard</h2>
              <p className="text-muted-foreground">Schedule and optimize maintenance operations</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSyncSap} disabled={syncing} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                Sync SAP PM
              </Button>
              <CreateWorkOrderDialog onWorkOrderCreated={loadData} />
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
      )}

      {userRole === "reliability" && (
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
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
