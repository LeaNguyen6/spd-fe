# SP Digital AssetAI Platform

A modern, intelligent predictive maintenance management system built with React, TypeScript, and Vite. SP Digital AssetAI Platform provides comprehensive asset management, predictive maintenance planning, and quality monitoring capabilities integrated with SAP PM systems.

## 🚀 Features

- **Asset Health Monitoring**: Real-time tracking of asset health scores with AI-powered predictions
- **Work Order Management**: Create, assign, and track maintenance work orders
- **Role-Based Dashboards**: Specialized interfaces for Asset Managers, Maintenance Planners, and Reliability Engineers
- **Quality Monitoring**: Track precision and recall metrics for AI predictions
- **SAP PM Integration**: Seamless integration with SAP Plant Maintenance systems
- **Authentication & Authorization**: Secure user authentication with JWT tokens and role-based access control
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [User Roles](#user-roles)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or **bun** as an alternative)
- **Git**: For version control

## 📦 Installation

**Install dependencies**

```bash
npm install
```

Or if using bun:

```bash
bun install
```

## 🔐 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:49231/api

# Environment Mode
VITE_ENV=development
```

### Environment Variables Description

- `VITE_API_BASE_URL`: Base URL for the backend API server
- `VITE_ENV`: Current environment (development/production)

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Development Features

- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **TypeScript Support**: Full type checking during development
- **ESLint Integration**: Code quality checks

## 🏗️ Building for Production

### Build the application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build for development mode

```bash
npm run build:dev
```

### Preview production build

```bash
npm run preview
```

## 📁 Project Structure

```
spd-fe/
├── public/                      # Static assets
│   └── robots.txt
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # UI components
│   │   ├── charts/              # Chart components (Bar, Line, Pie)
│   │   ├── AssetHealthCard.tsx
│   │   ├── AssetManagerDashboard.tsx
│   │   ├── CreateWorkOrderDialog.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── MaintenancePlannerDashboard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── QualityMonitoring.tsx
│   │   ├── ReliabilityEngineerDashboard.tsx
│   │   └── WorkOrderCard.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.tsx          # Authentication hook
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                     # Utility libraries
│   │   ├── apiClient.ts         # Axios configuration
│   │   └── utils.ts
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   ├── RoleSelection.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── services/                # API services
│   │   ├── authApi.ts           # Authentication API
│   │   ├── sapApi.ts            # SAP PM API integration
│   │   └── index.ts
│   ├── types/                   # TypeScript type definitions
│   │   └── roles.ts
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── API_SETUP.md                 # API setup documentation
├── package.json
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── README.md
```

## 📜 Available Scripts

| Script              | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start development server with HMR  |
| `npm run build`     | Build for production               |
| `npm run build:dev` | Build for development mode         |
| `npm run lint`      | Run ESLint for code quality checks |
| `npm run preview`   | Preview production build locally   |

## 🔌 API Integration

The application integrates with backend services for comprehensive asset management. For detailed API setup and integration guide, see [API_SETUP.md](./API_SETUP.md).

### Key Features

- **Automatic Token Management**: JWT tokens are automatically handled
- **Token Refresh**: Automatic token refresh on expiration
- **Error Handling**: Global error handling with automatic redirects
- **Type Safety**: Fully typed API responses with TypeScript

### Quick Start

```typescript
import { apiService } from "@/services";

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

## 👥 User Roles

The application supports three main user roles:

### 1. Asset Manager

- Monitor asset health scores
- View asset inventory
- Track maintenance schedules
- Create and assign work orders

### 2. Maintenance Planner

- View all work orders
- Manage maintenance schedules
- Track work order completion
- Monitor team workload

### 3. Reliability Engineer

- Monitor quality metrics (precision/recall)
- Analyze prediction accuracy
- Track asset failure patterns
- Optimize maintenance strategies

## 🛠️ Technologies Used

### Frontend Framework

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server

### UI Components & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Icon library

### Data Management

- **React Query** - Server state management
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Data Visualization

- **Recharts** - Composable charting library

### API & HTTP

- **Axios** - HTTP client
- **JWT** - Token-based authentication

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/create-work-order`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feat/create-work-order`)
5. Open a Pull Request

### Commit Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

## 📄 License

This project is private and proprietary.

## 📞 Support

For support and questions, please contact the development team or open an issue in the repository.

## 🔄 Version History

- **v0.0.0** - Initial development version
  - Asset management dashboard
  - Work order creation and management
  - Role-based access control
  - SAP PM integration setup

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Icons from [Lucide](https://lucide.dev/)

---

**Current Branch**: `develop`

For more detailed API documentation, please refer to [API_SETUP.md](./API_SETUP.md)
