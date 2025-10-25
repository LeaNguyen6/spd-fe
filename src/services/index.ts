// Service selector to switch between mock and real API
import { mockSapApi } from './mockSapApi';
import { sapApi } from './sapApi';
import { mockAuthApi } from './mockAuthApi';
import { authApi } from './authApi';

// Configuration
const USE_MOCK_API = false
// const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.DEV;
// Export the appropriate API based on configuration
export const apiService = USE_MOCK_API ? mockSapApi : sapApi;
export const authService = USE_MOCK_API ? mockAuthApi : authApi;

// Re-export types for convenience
export type { Asset, WorkOrder } from './mockSapApi';
export type {
    CreateWorkOrderRequest,
    SystemStats,
    SyncResult,
    WorkOrder as RealWorkOrder,
    Asset as RealAsset,
    ReliabilityStats
} from './sapApi';

// Utility function to check if using mock API
export const isUsingMockApi = () => USE_MOCK_API;

// Helper function to log API usage
export const logApiUsage = (action: string) => {
    const apiType = USE_MOCK_API ? 'Mock API' : 'Real API';
    console.log(`🔄 ${apiType}: ${action}`);
};


// const assets = [
//     { "time_cycles": 102, "asset_name": "4", "asset_category": "FD001" }, { "time_cycles": 152, "asset_name": "70", "asset_category": "FD001" }, { "time_cycles": 48, "asset_name": "2", "asset_category": "FD001" }, { "time_cycles": 123, "asset_name": "41", "asset_category": "FD001" }, { "time_cycles": 68, "asset_name": "88", "asset_category": "FD001" }, { "time_cycles": 135, "asset_name": "19", "asset_category": "FD001" }, { "time_cycles": 76, "asset_name": "15", "asset_category": "FD001" }, { "time_cycles": 189, "asset_name": "52", "asset_category": "FD001" }, { "time_cycles": 133, "asset_name": "40", "asset_category": "FD001" }, { "time_cycles": 144, "asset_name": "60", "asset_category": "FD001" }, { "time_cycles": 243, "asset_name": "93", "asset_category": "FD001" }, { "time_cycles": 192, "asset_name": "10", "asset_category": "FD001" }, { "time_cycles": 112, "asset_name": "73", "asset_category": "FD001" }, { "time_cycles": 133, "asset_name": "94", "asset_category": "FD001" }, { "time_cycles": 186, "asset_name": "68", "asset_category": "FD001" }, { "time_cycles": 130, "asset_name": "97", "asset_category": "FD001" }, { "time_cycles": 136, "asset_name": "56", "asset_category": "FD001" }, { "time_cycles": 87, "asset_name": "95", "asset_category": "FD001" }, { "time_cycles": 121, "asset_name": "98", "asset_category": "FD001" }, { "time_cycles": 150, "asset_name": "92", "asset_category": "FD001" }, { "time_cycles": 72, "asset_name": "78", "asset_category": "FD001" }, { "time_cycles": 163, "asset_name": "53", "asset_category": "FD001" }, { "time_cycles": 74, "asset_name": "50", "asset_category": "FD001" }, { "time_cycles": 171, "asset_name": "84", "asset_category": "FD001" }, { "time_cycles": 54, "asset_name": "44", "asset_category": "FD001" }, { "time_cycles": 142, "asset_name": "30", "asset_category": "FD001" }, { "time_cycles": 140, "asset_name": "27", "asset_category": "FD001" }, { "time_cycles": 176, "asset_name": "58", "asset_category": "FD001" }, { "time_cycles": 216, "asset_name": "12", "asset_category": "FD001" }, { "time_cycles": 83, "asset_name": "11", "asset_category": "FD001" }, { "time_cycles": 110, "asset_name": "55", "asset_category": "FD001" }, { "time_cycles": 203, "asset_name": "34", "asset_category": "FD001" }, { "time_cycles": 164, "asset_name": "17", "asset_category": "FD001" }, { "time_cycles": 160, "asset_name": "57", "asset_category": "FD001" }, { "time_cycles": 166, "asset_name": "8", "asset_category": "FD001" }, { "time_cycles": 198, "asset_name": "35", "asset_category": "FD001" }, { "time_cycles": 196, "asset_name": "31", "asset_category": "FD001" }, { "time_cycles": 152, "asset_name": "45", "asset_category": "FD001" }, { "time_cycles": 97, "asset_name": "96", "asset_category": "FD001" }, { "time_cycles": 168, "asset_name": "64", "asset_category": "FD001" }, { "time_cycles": 39, "asset_name": "22", "asset_category": "FD001" }, { "time_cycles": 183, "asset_name": "20", "asset_category": "FD001" }, { "time_cycles": 167, "asset_name": "29", "asset_category": "FD001" }, { "time_cycles": 102, "asset_name": "6", "asset_category": "FD001" }, { "time_cycles": 108, "asset_name": "86", "asset_category": "FD001" }, { "time_cycles": 78, "asset_name": "48", "asset_category": "FD001" }, { "time_cycles": 186, "asset_name": "24", "asset_category": "FD001" }, { "time_cycles": 156, "asset_name": "42", "asset_category": "FD001" }, { "time_cycles": 55, "asset_name": "9", "asset_category": "FD001" }, { "time_cycles": 56, "asset_name": "87", "asset_category": "FD001" }, { "time_cycles": 130, "asset_name": "23", "asset_category": "FD001" }, { "time_cycles": 63, "asset_name": "71", "asset_category": "FD001" }, { "time_cycles": 144, "asset_name": "66", "asset_category": "FD001" }, { "time_cycles": 121, "asset_name": "37", "asset_category": "FD001" }, { "time_cycles": 145, "asset_name": "32", "asset_category": "FD001" }, { "time_cycles": 159, "asset_name": "61", "asset_category": "FD001" }, { "time_cycles": 198, "asset_name": "100", "asset_category": "FD001" }, { "time_cycles": 133, "asset_name": "80", "asset_category": "FD001" }, { "time_cycles": 51, "asset_name": "69", "asset_category": "FD001" }, { "time_cycles": 143, "asset_name": "51", "asset_category": "FD001" }, { "time_cycles": 73, "asset_name": "47", "asset_category": "FD001" }, { "time_cycles": 73, "asset_name": "83", "asset_category": "FD001" }, { "time_cycles": 172, "asset_name": "43", "asset_category": "FD001" }, { "time_cycles": 35, "asset_name": "39", "asset_category": "FD001" }, { "time_cycles": 48, "asset_name": "25", "asset_category": "FD001" }, { "time_cycles": 303, "asset_name": "49", "asset_category": "FD001" }, { "time_cycles": 97, "asset_name": "99", "asset_category": "FD001" }, { "time_cycles": 162, "asset_name": "77", "asset_category": "FD001" }, { "time_cycles": 162, "asset_name": "82", "asset_category": "FD001" }, { "time_cycles": 228, "asset_name": "62", "asset_category": "FD001" }, { "time_cycles": 101, "asset_name": "79", "asset_category": "FD001" }, { "time_cycles": 121, "asset_name": "54", "asset_category": "FD001" }, { "time_cycles": 156, "asset_name": "28", "asset_category": "FD001" }, { "time_cycles": 71, "asset_name": "67", "asset_category": "FD001" }, { "time_cycles": 68, "asset_name": "65", "asset_category": "FD001" }, { "time_cycles": 130, "asset_name": "72", "asset_category": "FD001" }, { "time_cycles": 145, "asset_name": "21", "asset_category": "FD001" }, { "time_cycles": 124, "asset_name": "38", "asset_category": "FD001" }, { "time_cycles": 211, "asset_name": "81", "asset_category": "FD001" }, { "time_cycles": 76, "asset_name": "26", "asset_category": "FD001" }, { "time_cycles": 146, "asset_name": "90", "asset_category": "FD001" }, { "time_cycles": 94, "asset_name": "59", "asset_category": "FD001" }, { "time_cycles": 145, "asset_name": "46", "asset_category": "FD001" }, { "time_cycles": 131, "asset_name": "18", "asset_category": "FD001" }, { "time_cycles": 126, "asset_name": "36", "asset_category": "FD001" }, { "time_cycles": 47, "asset_name": "33", "asset_category": "FD001" }, { "time_cycles": 34, "asset_name": "85", "asset_category": "FD001" }, { "time_cycles": 195, "asset_name": "13", "asset_category": "FD001" }, { "time_cycles": 160, "asset_name": "7", "asset_category": "FD001" }, { "time_cycles": 95, "asset_name": "5", "asset_category": "FD001" }, { "time_cycles": 155, "asset_name": "63", "asset_category": "FD001" }, { "time_cycles": 46, "asset_name": "14", "asset_category": "FD001" }, { "time_cycles": 177, "asset_name": "89", "asset_category": "FD001" }, { "time_cycles": 234, "asset_name": "91", "asset_category": "FD001" }, { "time_cycles": 203, "asset_name": "76", "asset_category": "FD001" }, { "time_cycles": 88, "asset_name": "75", "asset_category": "FD001" }, { "time_cycles": 126, "asset_name": "3", "asset_category": "FD001" }, { "time_cycles": 31, "asset_name": "1", "asset_category": "FD001" }, { "time_cycles": 137, "asset_name": "74", "asset_category": "FD001" }, { "time_cycles": 111, "asset_name": "16", "asset_category": "FD001" }]

// const workOrder = {
//     "orders": [
//         {
//             "id": "68fb4a39e491b80f4191b00e",
//             "assetId": "22",
//             "type": "Preventive Maintenance",
//             "priority": "HIGH",
//             "assignedTo": "USER-67890",
//             "scheduledDate": "2025-10-25T14:30:00Z",
//             "status": "PENDING",
//             "sapOrderNumber": "SAP-2025-002",
//             "createdAt": "2025-10-24T09:43:21.219Z",
//             "updatedAt": "2025-10-24T09:43:21.219Z"
//         },
//         {
//             "id": "68fb1afef2a33321ab966e9e",
//             "assetId": "ASSET-22345",
//             "type": "Preventive Maintenance",
//             "priority": "HIGH",
//             "assignedTo": "USER-67890",
//             "scheduledDate": "2025-10-25T14:30:00Z",
//             "status": "PENDING",
//             "sapOrderNumber": "SAP-2025-002",
//             "createdAt": "2025-10-24T06:21:50.612Z",
//             "updatedAt": "2025-10-24T06:21:50.612Z"
//         }
//     ],
//     "total": 2
// }