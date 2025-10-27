// Real API services
import { sapApi } from './sapApi';
import { authApi } from './authApi';

// Export the real APIs
export const apiService = sapApi;
export const authService = authApi;

// Re-export types for convenience
export type {
    Asset,
    WorkOrder,
    CreateWorkOrderRequest,
    SystemStats,
    SyncResult,
    ReliabilityStats
} from './sapApi';

export type {
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    User
} from './authApi';