import apiClient from '@/lib/apiClient';
import { AxiosResponse } from 'axios';

// Re-export types from mockSapApi for consistency
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
    // assetName: string;
    assetId: string;
    type: string;
    priority: "critical" | "high" | "medium" | "low";
    assignedTo: string;
    scheduledDate: string;
    status: "pending" | "in-progress" | "completed";
    sapOrderNumber?: string;
}

export interface CreateWorkOrderRequest {
    asset_id: string;
    type: string;
    priority: "critical" | "high" | "medium" | "low";
    assigned_to: string;
    scheduled_date: string;
    sap_order_number?: string;
    status?: "pending" | "in-progress" | "completed";
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

// Real API service using Axios
export const sapApi = {
    // Get all assets from SAP PM
    async getAssets(): Promise<Asset[]> {
        const response: AxiosResponse<Asset[]> = await apiClient.get('/v1/list-asset');
        return response.data;
    },

    // Get all work orders from SAP PM
    async getWorkOrders(): Promise<WorkOrder[]> {
        const response: AxiosResponse<WorkOrder[]> = await apiClient.get('/v1/work-orders');
        return response.data;
    },

    // Create a new work order in SAP PM
    async createWorkOrder(workOrder: CreateWorkOrderRequest): Promise<WorkOrder> {
        const response: AxiosResponse<WorkOrder> = await apiClient.post('/v1/work-orders', workOrder);
        return response.data;
    },

    // Update work order status in SAP PM
    async updateWorkOrderStatus(orderId: string, status: WorkOrder["status"]): Promise<WorkOrder> {
        const response: AxiosResponse<WorkOrder> = await apiClient.patch(`/sap/work-orders/${orderId}/status`, {
            status,
        });
        return response.data;
    },

    // Sync asset data from SAP PM
    async syncAssetData(): Promise<SyncResult> {
        const response: AxiosResponse<SyncResult> = await apiClient.post('/sap/sync/assets');
        return response.data;
    },

    // Update asset health in SAP PM
    async updateAssetHealth(assetId: string, healthScore: number): Promise<Asset> {
        const response: AxiosResponse<Asset> = await apiClient.patch(`/sap/assets/${assetId}/health`, {
            healthScore,
        });
        return response.data;
    },

    // Get SAP PM system statistics
    async getSystemStats(): Promise<SystemStats> {
        const response: AxiosResponse<SystemStats> = await apiClient.get('/sap/stats');
        return response.data;
    },

    // Get asset by ID
    async getAssetById(assetId: string): Promise<Asset> {
        const response: AxiosResponse<Asset> = await apiClient.get(`/sap/assets/${assetId}`);
        return response.data;
    },

    // Get work order by ID
    async getWorkOrderById(orderId: string): Promise<WorkOrder> {
        const response: AxiosResponse<WorkOrder> = await apiClient.get(`/sap/work-orders/${orderId}`);
        return response.data;
    },

    // Delete work order
    async deleteWorkOrder(orderId: string): Promise<void> {
        await apiClient.delete(`/sap/work-orders/${orderId}`);
    },

    // Update work order
    async updateWorkOrder(orderId: string, updates: Partial<CreateWorkOrderRequest>): Promise<WorkOrder> {
        const response: AxiosResponse<WorkOrder> = await apiClient.patch(`/sap/work-orders/${orderId}`, updates);
        return response.data;
    },

    // Get assets by category
    async getAssetsByCategory(category: string): Promise<Asset[]> {
        const response: AxiosResponse<Asset[]> = await apiClient.get(`/sap/assets/category/${category}`);
        return response.data;
    },

    // Get work orders by status
    async getWorkOrdersByStatus(status: WorkOrder["status"]): Promise<WorkOrder[]> {
        const response: AxiosResponse<WorkOrder[]> = await apiClient.get(`/sap/work-orders/status/${status}`);
        return response.data;
    },
};