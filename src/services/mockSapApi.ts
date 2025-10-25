import { toast } from "@/hooks/use-toast";

// Simulated delay to mimic API calls
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export interface Asset {
  assetId: string;
  assetName: string;
  category: string;
  healthScore: number;
  confidence: number;
  nextMaintenance: string;
  sapEquipmentNumber?: string;
}

export interface WorkOrder {
  id: string;
  assetName: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  assignedTo: string;
  scheduledDate: string;
  status: "pending" | "in-progress" | "completed";
  sapOrderNumber?: string;
}

// Mock data storage
let mockAssets: Asset[] = [
  { assetId: "A-301", assetName: "Turbine Unit A-301", category: "Rotating Equipment", healthScore: 72, confidence: 35, nextMaintenance: "Dec 28, 2025", sapEquipmentNumber: "EQP-10001" },
  { assetId: "B-142", assetName: "Pump System B-142", category: "Hydraulic Systems", healthScore: 45, confidence: 78, nextMaintenance: "Oct 22, 2025", sapEquipmentNumber: "EQP-10002" },
  { assetId: "C-205", assetName: "Compressor C-205", category: "Pressure Systems", healthScore: 88, confidence: 18, nextMaintenance: "Jan 15, 2026", sapEquipmentNumber: "EQP-10003" },
  { assetId: "D-112", assetName: "Heat Exchanger D-112", category: "Thermal Equipment", healthScore: 61, confidence: 52, nextMaintenance: "Nov 10, 2025", sapEquipmentNumber: "EQP-10004" },
];

const mockWorkOrders: WorkOrder[] = [
  { id: "WO-2501", assetName: "Pump System B-142", type: "Emergency Repair", priority: "critical", assignedTo: "John Smith", scheduledDate: "Oct 22, 2025", status: "pending", sapOrderNumber: "SAP-WO-5001" },
  { id: "WO-2502", assetName: "Turbine Unit A-301", type: "Preventive Maintenance", priority: "medium", assignedTo: "Sarah Johnson", scheduledDate: "Dec 28, 2025", status: "in-progress", sapOrderNumber: "SAP-WO-5002" },
  { id: "WO-2503", assetName: "Compressor C-205", type: "Inspection", priority: "low", assignedTo: "Mike Davis", scheduledDate: "Jan 15, 2026", status: "completed", sapOrderNumber: "SAP-WO-5003" },
];

export const mockSapApi = {
  // Get all assets from SAP PM
  async getAssets(): Promise<Asset[]> {
    console.log("🔄 Mock SAP API: Fetching assets from SAP PM...");
    await simulateDelay();
    console.log(`✅ Mock SAP API: Retrieved ${mockAssets.length} assets`);
    return [...mockAssets];
  },

  // Get all work orders from SAP PM
  async getWorkOrders(): Promise<WorkOrder[]> {
    console.log("🔄 Mock SAP API: Fetching work orders from SAP PM...");
    await simulateDelay();
    console.log(`✅ Mock SAP API: Retrieved ${mockWorkOrders.length} work orders`);
    return [...mockWorkOrders];
  },

  // Create a new work order in SAP PM
  async createWorkOrder(workOrder: Omit<WorkOrder, "id" | "sapOrderNumber">): Promise<WorkOrder> {
    console.log("🔄 Mock SAP API: Creating work order in SAP PM...", workOrder);
    await simulateDelay(1200);

    const newWorkOrder: WorkOrder = {
      ...workOrder,
      id: `WO-${Math.floor(Math.random() * 9000) + 1000}`,
      sapOrderNumber: `SAP-WO-${Math.floor(Math.random() * 9000) + 5000}`,
    };

    mockWorkOrders.unshift(newWorkOrder);
    console.log(`✅ Mock SAP API: Work order created successfully`, newWorkOrder);

    toast({
      title: "Work Order Created",
      description: `Work order ${newWorkOrder.id} has been synced to SAP PM (${newWorkOrder.sapOrderNumber})`,
    });

    return newWorkOrder;
  },

  // Update work order status in SAP PM
  async updateWorkOrderStatus(orderId: string, status: WorkOrder["status"]): Promise<WorkOrder> {
    console.log(`🔄 Mock SAP API: Updating work order ${orderId} status to ${status} in SAP PM...`);
    await simulateDelay();

    const orderIndex = mockWorkOrders.findIndex(wo => wo.id === orderId);
    if (orderIndex === -1) throw new Error("Work order not found");

    mockWorkOrders[orderIndex].status = status;
    console.log(`✅ Mock SAP API: Work order ${orderId} status updated in SAP PM`);

    toast({
      title: "Status Updated",
      description: `Work order ${orderId} synced to SAP PM`,
    });

    return mockWorkOrders[orderIndex];
  },

  // Sync asset data from SAP PM
  async syncAssetData(): Promise<{ success: boolean; assetsUpdated: number }> {
    console.log("🔄 Mock SAP API: Syncing asset data from SAP PM...");
    await simulateDelay(1500);

    // Simulate updating some asset health scores
    mockAssets = mockAssets.map(asset => ({
      ...asset,
      healthScore: Math.max(20, Math.min(100, asset.healthScore + Math.floor(Math.random() * 10 - 5))),
      confidence: Math.max(5, Math.min(95, asset.confidence + Math.floor(Math.random() * 10 - 5))),
    }));

    console.log(`✅ Mock SAP API: Synced ${mockAssets.length} assets from SAP PM`);

    toast({
      title: "SAP Sync Complete",
      description: `Successfully synced ${mockAssets.length} assets from SAP PM`,
    });

    return { success: true, assetsUpdated: mockAssets.length };
  },

  // Update asset health in SAP PM
  async updateAssetHealth(assetId: string, healthScore: number): Promise<Asset> {
    console.log(`🔄 Mock SAP API: Updating asset ${assetId} health score to ${healthScore} in SAP PM...`);
    await simulateDelay();

    const assetIndex = mockAssets.findIndex(a => a.assetId === assetId);
    if (assetIndex === -1) throw new Error("Asset not found");

    mockAssets[assetIndex].healthScore = healthScore;
    console.log(`✅ Mock SAP API: Asset ${assetId} health updated in SAP PM`);

    return mockAssets[assetIndex];
  },

  // Get SAP PM system statistics
  async getSystemStats(): Promise<{ totalAssets: number; openWorkOrders: number; pendingSync: number }> {
    console.log("🔄 Mock SAP API: Fetching SAP PM system statistics...");
    await simulateDelay(600);

    const stats = {
      totalAssets: 847,
      openWorkOrders: mockWorkOrders.filter(wo => wo.status !== "completed").length,
      pendingSync: Math.floor(Math.random() * 5),
    };

    console.log("✅ Mock SAP API: Retrieved system stats", stats);
    return stats;
  },
};
