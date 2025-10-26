# API Setup Documentation

## Overview

This project uses Axios for HTTP requests with authentication token management and real API integration for SAP PM operations.

## Installation

To use the API features, you need to install Axios:

```bash
npm install axios
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
```

- `VITE_API_BASE_URL`: Base URL for your API server

## File Structure

```
src/
├── lib/
│   └── apiClient.ts          # Axios configuration with interceptors
├── services/
│   ├── index.ts              # Service exports and API integration
│   ├── sapApi.ts             # Real API service using Axios
│   └── authApi.ts            # Authentication API service
├── hooks/
│   └── useAuth.tsx           # Authentication context and hooks
├── components/
│   ├── ProtectedRoute.tsx    # Route protection component
│   └── ErrorBoundary.tsx     # Error handling component
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

- **Real API**: Axios-based service for production
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

// Create work order
await apiService.createWorkOrder({
  asset_id: "ASSET-123",
  type: "Preventive Maintenance",
  priority: "high",
  assigned_to: "USER-456",
  scheduled_date: "2024-01-15T10:00:00Z",
});
```

### Authentication

```typescript
import { authService } from "@/services/index";

// Login
const response = await authService.login({
  email: "user@example.com",
  password: "password",
});

// Get user profile
const user = await authService.getProfile();
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

- `GET /api/sap/assets` - Get all assets
- `GET /api/sap/assets/:id` - Get asset by ID
- `PATCH /api/sap/assets/:id/health` - Update asset health

### Work Orders API

- `GET /api/sap/work-orders` - Get all work orders
- `POST /api/sap/work-orders` - Create new work order
- `PATCH /api/sap/work-orders/:id/status` - Update work order status

### Authentication API

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/refresh` - Refresh authentication token

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
  nextMaintenance: string;
  sapEquipmentNumber?: string;
}

interface WorkOrder {
  id: string;
  assetId: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  assignedTo: string;
  scheduledDate: string;
  status: "pending" | "in-progress" | "completed";
  sapOrderNumber?: string;
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

```
src/
├── lib/
│   └── apiClient.ts          # Axios configuration with interceptors
├── services/
│   ├── index.ts              # Service selector (mock vs real API)
│   ├── mockSapApi.ts         # Mock API service (existing)
│   ├── sapApi.ts             # Real API service using Axios
│   └── authApi.ts            # Authentication API service
├── hooks/
│   └── useAuth.tsx           # Authentication context and hooks
├── components/
│   ├── ProtectedRoute.tsx    # Route protection component
│   └── ErrorBoundary.tsx     # Error handling component
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

- **Service Selector**: Automatically switches between mock and real API based on environment
- **Mock API**: Existing mock service for development
- **Real API**: Axios-based service for production
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

// The service automatically uses mock or real API based on configuration
const assets = await apiService.getAssets();
const workOrders = await apiService.getWorkOrders();
```

### Authentication

```typescript
import { useAuth } from "@/hooks/useAuth";

const { login, logout, user, isAuthenticated } = useAuth();

// Login
await login({ email: "user@example.com", password: "password" });

// Logout
logout();
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
import { tokenManager } from "@/services/authApi";

// Check if authenticated
const isAuth = tokenManager.isAuthenticated();

// Get current token
const token = tokenManager.getToken();

// Clear tokens
tokenManager.removeToken();
```

## API Endpoints

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh` - Refresh token
- `POST /auth/register` - Register new user

### SAP PM Endpoints

- `GET /sap/assets` - Get all assets
- `GET /sap/work-orders` - Get all work orders
- `POST /sap/work-orders` - Create work order
- `PATCH /sap/work-orders/:id/status` - Update work order status
- `POST /sap/sync/assets` - Sync asset data
- `GET /sap/stats` - Get system statistics

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

- Uses mock API by default
- Console logging for API calls
- Error details in development builds

### Production Mode

- Uses real API endpoints
- Minimal logging
- Error boundary for graceful error handling

## Migration from Mock API

The existing components using `mockSapApi` have been updated to use the service selector:

```typescript
// Old way
import { mockSapApi } from "@/services/mockSapApi";
await mockSapApi.getAssets();

// New way
import { apiService } from "@/services";
await apiService.getAssets();
```

This allows seamless switching between mock and real APIs without code changes.

## Environment Setup

1. Copy `.env.example` to `.env`
2. Update `VITE_API_BASE_URL` with your API server URL
3. Set `VITE_USE_MOCK_API=false` when ready to use real API
4. Ensure your API server supports the expected endpoints

## Security Considerations

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- API calls include CSRF protection headers
- Automatic token cleanup on authentication errors
- Role-based access control for sensitive operations
