import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import AssetManagerDashboard from "@/components/AssetManagerDashboard";
import MaintenancePlannerDashboard from "@/components/MaintenancePlannerDashboard";
import ReliabilityEngineerDashboard from "@/components/ReliabilityEngineerDashboard";
import { apiService, type Asset, type WorkOrder, logApiUsage } from "@/services/index";
import { toast } from "@/hooks/use-toast";
import { type UserRole } from "@/types/roles";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  // const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole") as UserRole | null;
    console.log('rollll', role)
    if (!role) {
      navigate("/");
    } else {
      setUserRole(role);
      // loadData();
    }
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      logApiUsage("Loading dashboard data");
      const [assetsData, workOrdersData] = await Promise.all([
        apiService.getAssets(),
        apiService.getWorkOrders(),
      ]);
      console.log('Assets:', assetsData);
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
      logApiUsage("Syncing SAP data");
      await apiService.syncAssetData();
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

  if (!userRole) {
    return null;
  }

  return (

    <DashboardLayout userRole={userRole} onLogout={handleLogout}>

      fdsfdsfds

      {userRole === "assets" && (
        <AssetManagerDashboard
          assets={assets}
          syncing={syncing}
        />
      )}

      {userRole === "maintenance" && (
        <MaintenancePlannerDashboard

          onWorkOrderCreated={loadData}
        />
      )}

      {userRole === "reliability" && (
        <ReliabilityEngineerDashboard />
      )}
    </DashboardLayout>

  );
};

export default Dashboard;
