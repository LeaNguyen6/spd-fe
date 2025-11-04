# SP Digital AssetAI Platform - API Setup Documentation

## Overview

This project uses Axios for HTTP requests with authentication token management, automatic token refresh, and API integration for SAP PM operations. The system provides seamless authentication flows with JWT tokens and comprehensive error handling.

## Installation

To use the API features, you need to install Axios:

```bash
npm install axios
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:49213/api

# Environment Mode
VITE_ENV=development
```

- `VITE_API_BASE_URL`: Base URL for your API server

## File Structure

```
src/
├── lib/
│   └── apiClient.ts          # Axios configuration with interceptors and token refresh
├── services/
│   ├── index.ts              # Service exports and type definitions
│   ├── sapApi.ts             # Main API service using Axios
│   └── authApi.ts            # Authentication API service with token management
├── hooks/
│   ├── useAuth.tsx           # Authentication context and hooks
│   ├── use-mobile.tsx        # Mobile detection hook
│   └── use-toast.ts          # Toast notification hook
├── components/
│   ├── ui/                   # Reusable UI components (Button, Input, etc.)
│   ├── ProtectedRoute.tsx    # Route protection component
│   ├── ErrorBoundary.tsx     # Error handling component
│   ├── AssetManagerDashboard.tsx
│   ├── MaintenancePlannerDashboard.tsx
│   ├── ReliabilityEngineerDashboard.tsx
│   ├── WorkOrderCard.tsx
│   └── ... (other components)
└── types/
    └── roles.ts              # User role type definitions
```

## Features

### 1. Axios Configuration (`src/lib/apiClient.ts`)

- Automatic token injection in request headers
- Response interceptors for handling 401/403 errors
- Configurable base URL and timeout
- Automatic token cleanup on auth errors

### 2. Service Layer (`src/services/`)

- **API Service**: Axios-based service for production
- **Auth API**: User authentication and token management
- **Type Safety**: Full TypeScript support for all API operations

### 3. Authentication (`src/hooks/useAuth.tsx`)

- React context for global auth state
- Login/logout functionality
- Token refresh mechanism
- Automatic token persistence in localStorage

### 4. Route Protection (`src/components/ProtectedRoute.tsx`)

- Protects routes requiring authentication
- Role-based access control
- Automatic redirects for unauthorized users

## Usage

### Basic API Calls

```typescript
import { apiService } from "@/services/index";

// Get all assets
const assets = await apiService.getAssets();

// Get all work orders
const workOrders = await apiService.getWorkOrders();

// Create work order
await apiService.createWorkOrder({
  asset_id: "ASSET-123",
  type: "Preventive Maintenance",
  priority: "HIGH",
  assigned_to: "USER-456",
  scheduled_date: "2024-01-15T10:00:00Z",
});

// Update work order status
await apiService.updateWorkOrderStatus("order-id", "COMPLETED");

// Get reliability statistics
const stats = await apiService.getReliabilityStats();

// Get monitors drift data
const driftData = await apiService.getMonitorsDrift();
```

### Authentication

```typescript
import { authService } from "@/services/index";

// Login
const response = await authService.login({
  email: "user@example.com",
  password: "password",
});

// Register new user
await authService.register({
  email: "user@example.com",
  password: "password",
  full_name: "John Doe",
  role: "assets", // or "maintenance" or "reliability"
});

// Get user profile
const user = await authService.getProfile();

// Refresh token
const newTokens = await authService.refreshToken();

// Logout
await authService.logout();
```

### Error Handling

```typescript
try {
  const data = await apiService.getAssets();
} catch (error) {
  console.error("API Error:", error);
  // Handle error appropriately
}
```

## API Endpoints

### Assets API

- `GET /api/v1/assets` - Get all assets with predictions
- `GET /api/v1/reliability-stats` - Get reliability statistics

### Work Orders API

- `GET /api/v1/work-orders` - Get all work orders
- `POST /api/v1/work-orders` - Create new work order
- `PATCH /api/v1/work-orders/:id/status` - Update work order status

### Monitoring API

- `GET /api/v1/monitors/drift` - Get drift monitoring data
- `GET /api/v1/monitors/model-drift` - Get model drift data

### Authentication API

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/refresh` - Refresh authentication token
- `POST /api/v1/auth/logout` - User logout

## Authentication Flow

1. User submits login credentials
2. API returns JWT token and user information
3. Token is stored in localStorage and added to all subsequent requests
4. Token is automatically refreshed when needed
5. On logout, token is removed from localStorage

## Error Handling

The API client includes automatic error handling:

- **401 Unauthorized**: Automatically triggers logout and redirects to login
- **403 Forbidden**: Shows error message and redirects appropriately
- **Network Errors**: Displays user-friendly error messages
- **Validation Errors**: Shows field-specific error messages

## Type Safety

All API operations are fully typed with TypeScript interfaces:

```typescript
interface Asset {
  assetId: string;
  assetName: string;
  category: string;
  healthScore: number;
  confidence: number;
  nextMaintenance: number;
  sapEquipmentNumber?: string;
}

interface WorkOrder {
  id: string;
  assetId: string;
  type: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  assignedTo: string;
  scheduledDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  sapOrderNumber?: string;
}

interface CreateWorkOrderRequest {
  asset_id: string;
  type: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  assigned_to: string;
  scheduled_date: string;
  sap_order_number?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: "assets" | "maintenance" | "reliability";
}

interface User {
  id: string;
  email: string;
  role: "assets" | "maintenance" | "reliability";
  name: string;
}
```

## Development Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Update environment variables as needed
4. Start development server: `npm run dev`

## Production Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy to your hosting platform

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your API server has proper CORS configuration
2. **Authentication Failures**: Check token expiration and refresh logic
3. **Network Timeouts**: Adjust timeout settings in `apiClient.ts`
4. **Type Errors**: Ensure API response matches TypeScript interfaces

### Debug Mode

Enable debug logging by setting `VITE_ENV=development` in your `.env` file.

## Features

### 1. Axios Configuration (`src/lib/apiClient.ts`)

- Automatic token injection in request headers
- Response interceptors for handling 401/403 errors
- Configurable base URL and timeout
- Automatic token cleanup on auth errors
- Token refresh mechanism with queue management

### 2. Service Layer (`src/services/`)

- **API Service**: Axios-based service for production
- **Auth API**: User authentication and token management

### 3. Authentication (`src/hooks/useAuth.tsx`)

- React context for global auth state
- Login/logout functionality
- Token refresh mechanism
- Automatic token persistence in localStorage

### 4. Route Protection (`src/components/ProtectedRoute.tsx`)

- Protects routes requiring authentication
- Role-based access control
- Automatic redirects for unauthorized users

## Usage

### Basic API Calls

```typescript
import { apiService } from "@/services";

// Get assets and work orders
const assets = await apiService.getAssets();
const workOrders = await apiService.getWorkOrders();
```

### Authentication

```typescript
import { useAuth } from "@/hooks/useAuth";

const { login, logout, user, isAuthenticated } = useAuth();

// Login
await login({ email: "user@example.com", password: "password" });
```

### Protected Routes

```typescript
import ProtectedRoute from "@/components/ProtectedRoute";

<ProtectedRoute requiredRole="assets">
  <AssetManagerDashboard />
</ProtectedRoute>;
```

## Token Management

### Automatic Token Handling

- Tokens are automatically added to all API requests
- Invalid tokens trigger automatic logout
- Tokens are persisted in localStorage

### Manual Token Operations

```typescript
// Token management is handled automatically by apiClient
// But you can access token utilities if needed
```

## API Endpoints

### Authentication Endpoints

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/refresh` - Refresh authentication token
- `POST /api/v1/auth/logout` - User logout

### Asset Management Endpoints

- `GET /api/v1/assets` - Get all assets with AI predictions
- `GET /api/v1/reliability-stats` - Get system reliability statistics

### Work Order Management Endpoints

- `GET /api/v1/work-orders` - Get all work orders
- `POST /api/v1/work-orders` - Create new work order
- `PATCH /api/v1/work-orders/:id/status` - Update work order status

### Monitoring & Analytics Endpoints

- `GET /api/v1/monitors/drift` - Get data drift monitoring information
- `GET /api/v1/monitors/model-drift` - Get model performance drift data

## Error Handling

### Global Error Boundary

Use the ErrorBoundary component to catch and display errors:

```typescript
import ErrorBoundary from "@/components/ErrorBoundary";

<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

### API Error Handling

- 401 errors automatically clear tokens and redirect to login
- 403 errors are logged to console
- Network errors are propagated to calling components

## Development vs Production

### Development Mode

- Console logging for API calls
- Error details in development builds

### Production Mode

- Uses API endpoints
- Minimal logging
- Error boundary for graceful error handling

## Migration Guide

The components have been updated to use the API service:

```typescript
// Updated approach
import { apiService } from "@/services";
await apiService.getAssets();
```

This provides direct API integration without switching between different implementations.

## Environment Setup

1. Copy `.env.example` to `.env`
2. Update `VITE_API_BASE_URL` with your API server URL
3. Ensure your API server supports the expected endpoints

## Security Considerations

- Tokens are stored in localStorage and automatically managed by apiClient
- API calls include proper authentication headers
- Automatic token refresh prevents authentication expiration
- Automatic token cleanup on authentication errors
- Role-based access control for different user types (assets, maintenance, reliability)
- Request/response interceptors handle errors gracefully
