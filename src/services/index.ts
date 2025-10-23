// Service selector to switch between mock and real API
import { mockSapApi } from './mockSapApi';
import { sapApi } from './sapApi';
import { mockAuthApi } from './mockAuthApi';
import { authApi } from './authApi';

// Configuration
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.DEV;
// Export the appropriate API based on configuration
export const apiService = USE_MOCK_API ? mockSapApi : sapApi;
export const authService = USE_MOCK_API ? mockAuthApi : authApi;

// Re-export types for convenience
export type { Asset, WorkOrder } from './mockSapApi';
export type { CreateWorkOrderRequest, SystemStats, SyncResult } from './sapApi';

// Utility function to check if using mock API
export const isUsingMockApi = () => USE_MOCK_API;

// Helper function to log API usage
export const logApiUsage = (action: string) => {
    const apiType = USE_MOCK_API ? 'Mock API' : 'Real API';
    console.log(`🔄 ${apiType}: ${action}`);
};