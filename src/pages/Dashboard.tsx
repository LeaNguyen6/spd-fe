import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import AssetManagerDashboard from "@/components/AssetManagerDashboard";
import MaintenancePlannerDashboard from "@/components/MaintenancePlannerDashboard";
import ReliabilityEngineerDashboard from "@/components/ReliabilityEngineerDashboard";
import { type Asset } from "@/services/index";
import { type UserRole } from "@/types/roles";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);


  useEffect(() => {
    const role = localStorage.getItem("userRole") as UserRole | null;
    if (!role) {
      navigate("/");
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  // const loadData = async () => {
  //   try {
  //     setLoading(true);
  //     logApiUsage("Loading dashboard data");
  //     const [assetsData, workOrdersData] = await Promise.all([
  //       apiService.getAssets(),
  //       apiService.getWorkOrders(),
  //     ]);
  //     setAssets(assetsData);
  //     setWorkOrders(workOrdersData);
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to load data from SAP PM",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");
    localStorage.removeItem('refreshToken');
    navigate("/");
  };

  if (!userRole) {
    return null;
  }

  return (

    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      {userRole === "assets" && (
        <AssetManagerDashboard
        />
      )}

      {userRole === "maintenance" && (
        <MaintenancePlannerDashboard
        />
      )}

      {userRole === "reliability" && (
        <ReliabilityEngineerDashboard />
      )}
    </DashboardLayout>

  );
};

export default Dashboard;
