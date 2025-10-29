import apiClient from '@/lib/apiClient';
import { AxiosResponse } from 'axios';

// Asset and Work Order interfaces
export interface Asset {
    assetId: string;
    assetName: string;
    category: string;
    healthScore: number;
    confidence: number;
    nextMaintenance: number;
    sapEquipmentNumber?: string;
}

export interface AssetPrediction {
    engine_id: number;
    remaining_useful_life: number;
    is_going_to_fail: boolean;
    confidence: number;
}

export interface AssetResponse {
    time_cycles: number;
    asset_name: string;
    asset_id: number;
    asset_category: string;
    prediction: AssetPrediction;
}

export interface WorkOrder {
    id: string;
    // assetName: string;
    assetId: string;
    type: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    assignedTo: string;
    scheduledDate: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    sapOrderNumber?: string;
}

export interface CreateWorkOrderRequest {
    asset_id: string;
    type: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    assigned_to: string;
    scheduled_date: string;
    sap_order_number?: string;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface SystemStats {
    totalAssets: number;
    openWorkOrders: number;
    pendingSync: number;
}

export interface SyncResult {
    success: boolean;
    assetsUpdated: number;
}

export interface ReliabilityStats {
    f1_score: number;
    mean_absolute_error: number;
    mean_absolute_percentage_error: number;
    mean_squared_error: number;
    precision: number[];
    recall: number[];
    roc_auc: number[];
    validation_time: string;
}

export interface CriticalIssue {
    category: string;
    engine_id: string;
    feature: string;
    issue: string;
    severity: string;
}

export interface DataQuality {
    critical_issue_engines: number;
    healthy_engines: number;
    medium_issue_engines: number;
    score: number;
    total_engines: number;
}

export interface TopDriftItem {
    count: number;
    engine_id: string;
}

export interface MonitorsDrift {
    critical_issues: CriticalIssue[];
    data_quality: DataQuality;
    top_data_drift: TopDriftItem[];
    top_missing_values: TopDriftItem[];
    top_outliers: TopDriftItem[];
}

export interface MonitorsModelDrift {
    total_engines: number;
    unstable_engines: number;
}

// Real API service using Axios
export const sapApi = {
    // Get all assets from SAP PM
    async getAssets(): Promise<Asset[]> {
        const response: AxiosResponse<AssetResponse[]> = await apiClient.get('/v1/list-asset');
        return response.data.map(asset => ({
            assetId: String(asset.asset_id),
            assetName: asset.asset_name,
            category: asset.asset_category,
            healthScore: (asset.time_cycles / (asset.prediction.remaining_useful_life + asset.time_cycles) * 100),
            confidence: (asset.prediction.confidence * 100),
            nextMaintenance: asset.prediction.remaining_useful_life,
        })).sort((a, b) => Number(b.healthScore) - Number(a.healthScore));
    },

    // Get all work orders from SAP PM
    async getWorkOrders(): Promise<WorkOrder[]> {
        const response: AxiosResponse<{ orders: WorkOrder[], totals: number }> = await apiClient.get('/v1/work-orders');
        return response.data.orders;
    },

    // Create a new work order in SAP PM
    async createWorkOrder(workOrder: CreateWorkOrderRequest): Promise<WorkOrder> {
        const response: AxiosResponse<WorkOrder> = await apiClient.post('/v1/work-orders', workOrder);
        return response.data;
    },

    // Get reliability statistics
    async getReliabilityStats(): Promise<ReliabilityStats> {
        const response: AxiosResponse<ReliabilityStats> = await apiClient.get('/v1/reliability-stats');
        return response.data;
    },

    // Get monitors drift information
    async getMonitorsDrift(): Promise<MonitorsDrift> {
        const response: AxiosResponse<MonitorsDrift> = await apiClient.get('/v1/monitors/drift');
        return response.data;


    },

    // Get monitors model drift information
    async getMonitorsModelDrift(): Promise<MonitorsModelDrift> {
        const response: AxiosResponse<MonitorsModelDrift> = await apiClient.get('/v1/monitors/model-drift');
        return response.data;
    },

    // Update work order status in SAP PM
    async updateWorkOrderStatus(orderId: string, status: WorkOrder["status"]): Promise<WorkOrder> {
        const response: AxiosResponse<WorkOrder> = await apiClient.patch(`/v1/work-orders/${orderId}/status`, {
            status,
        });
        return response.data;
    },

    // // Sync asset data from SAP PM
    // async syncAssetData(): Promise<SyncResult> {
    //     const response: AxiosResponse<SyncResult> = await apiClient.post('/sap/sync/assets');
    //     return response.data;
    // },

    // // Update asset health in SAP PM
    // async updateAssetHealth(assetId: string, healthScore: number): Promise<Asset> {
    //     const response: AxiosResponse<Asset> = await apiClient.patch(`/sap/assets/${assetId}/health`, {
    //         healthScore,
    //     });
    //     return response.data;
    // },

    // // Get SAP PM system statistics
    // async getSystemStats(): Promise<SystemStats> {
    //     const response: AxiosResponse<SystemStats> = await apiClient.get('/sap/stats');
    //     return response.data;
    // },

    // // Get asset by ID
    // async getAssetById(assetId: string): Promise<Asset> {
    //     const response: AxiosResponse<Asset> = await apiClient.get(`/sap/assets/${assetId}`);
    //     return response.data;
    // },

    // // Get work order by ID
    // async getWorkOrderById(orderId: string): Promise<WorkOrder> {
    //     const response: AxiosResponse<WorkOrder> = await apiClient.get(`/sap/work-orders/${orderId}`);
    //     return response.data;
    // },

    // // Delete work order
    // async deleteWorkOrder(orderId: string): Promise<void> {
    //     await apiClient.delete(`/sap/work-orders/${orderId}`);
    // },

    // // Update work order
    // async updateWorkOrder(orderId: string, updates: Partial<CreateWorkOrderRequest>): Promise<WorkOrder> {
    //     const response: AxiosResponse<WorkOrder> = await apiClient.patch(`/sap/work-orders/${orderId}`, updates);
    //     return response.data;
    // },

    // // Get assets by category
    // async getAssetsByCategory(category: string): Promise<Asset[]> {
    //     const response: AxiosResponse<Asset[]> = await apiClient.get(`/sap/assets/category/${category}`);
    //     return response.data;
    // },

    // // Get work orders by status
    // async getWorkOrdersByStatus(status: WorkOrder["status"]): Promise<WorkOrder[]> {
    //     const response: AxiosResponse<WorkOrder[]> = await apiClient.get(`/sap/work-orders/status/${status}`);
    //     return response.data;
    // },
};