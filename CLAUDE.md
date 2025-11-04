# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AssetAI Platform** - A predictive asset management system built with React and TypeScript. Simulates integration with SAP PM (Plant Maintenance) for industrial asset monitoring, failure prediction, and maintenance scheduling.

## Common Development Commands

```bash
npm run dev          # Start Vite dev server on http://[::]:8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Tech Stack

- **React 18.3.1** with **TypeScript 5.8.3** (relaxed strict mode)
- **Vite 5.4.19** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack React Query 5.83.0** - Server state management
- **shadcn/ui** (49 components) - UI component library built on Radix UI
- **Tailwind CSS 3.4.17** - Utility-first styling
- **React Hook Form 7.61.1 + Zod 3.25.76** - Form handling and validation
- **date-fns, recharts, sonner** - Utilities

## Project Architecture

### Directory Structure

```
src/
├── pages/              # Route-level page components
│   ├── Dashboard.tsx   # Main dashboard with role-based views
│   ├── Index.tsx       # Landing/role selection page
│   └── NotFound.tsx    # 404 page
├── components/         # Feature components
│   ├── ui/            # 49 shadcn/ui components (Radix primitives)
│   ├── AssetHealthCard.tsx
│   ├── CreateWorkOrderDialog.tsx
│   ├── DashboardLayout.tsx
│   ├── MetricCard.tsx
│   └── WorkOrderCard.tsx
├── services/          # API layer
│   └── mockSapApi.ts  # Mock SAP PM integration (will be replaced)
├── hooks/             # Custom React hooks
├── lib/               # Utilities (cn() helper)
├── App.tsx            # Root component with routing setup
├── main.tsx           # Entry point
└── index.css          # Design system (CSS variables)
```

### Routing Setup

Defined in `App.tsx` using React Router v6:

- `/` - Role selection landing page
- `/dashboard` - Role-based dashboard (requires role in localStorage)
- `/*` - Catch-all 404 (must stay last)

**Adding new routes**: Insert before the catch-all `*` route in `App.tsx`.

### Role-Based UI Pattern

Three user personas with different dashboard views:

1. **Asset Manager** - Monitors asset health scores, plans replacements
2. **Maintenance Planner** - Schedules work orders, manages tasks
3. **Reliability Engineer** - Analyzes AI model performance, system insights

Role is selected on Index page, stored in `localStorage.getItem('userRole')`, and drives conditional rendering in Dashboard component.

## Key Patterns & Conventions

### Import Aliases

Always use the `@/` alias for src imports (configured in vite.config.ts and tsconfig.json):

```tsx
import { Component } from "@/components/ui/component";
import { utility } from "@/lib/utils";
import { mockSapApi } from "@/services/mockSapApi";
```

### Styling System

**CSS Variables + Tailwind**: All colors defined as HSL CSS variables in `src/index.css`:

- Colors: `--primary`, `--secondary`, `--accent`, `--muted`, `--destructive`, `--warning`, `--success`
- Gradients: `--gradient-primary`, `--gradient-secondary`, `--gradient-hero`
- Shadows: `--shadow-card`, `--shadow-elevated`
- Dark mode: `.dark` class toggles theme

**Primary color palette**:

- Primary: Deep blue `hsl(215 85% 25%)`
- Secondary: Teal `hsl(180 65% 55%)`
- Success: Green `hsl(142 76% 36%)`
- Warning: Orange `hsl(38 92% 50%)`
- Destructive: Red `hsl(0 72% 51%)`

**Conditional styling**: Use the `cn()` utility from `@/lib/utils`:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />;
```

### Component Variants

Use `class-variance-authority` for type-safe variant props. Example from MetricCard:

```tsx
const metricVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "border-border",
      warning: "border-warning",
      success: "border-success",
      destructive: "border-destructive",
    },
  },
});
```

### Form Handling

**React Hook Form + Zod** pattern (see `CreateWorkOrderDialog.tsx`):

```tsx
const schema = z.object({
  field: z.string().trim().min(1).max(100),
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { field: "" },
});

const onSubmit = async (data: FormData) => {
  // handle submission
};
```

### State Management

- **Server state**: TanStack React Query (configured in App.tsx)
- **Local UI state**: React hooks (`useState`, `useEffect`)
- **Persistence**: localStorage for simple data (user role)
- **No global state library** (Redux/Zustand) - keeping it simple

### API Service Pattern

Currently using mock API in `src/services/mockSapApi.ts`:

- Simulates SAP PM integration with in-memory data
- TypeScript interfaces for `Asset` and `WorkOrder` models
- Async functions with simulated delays
- Console logs with emoji prefixes for debugging
- Toast notifications for user feedback

**Key interfaces**:

```tsx
interface Asset {
  assetId: string;
  assetName: string;
  category: string;
  healthScore: number; // 0-100
  failureProbability: number; // 0-100
  nextMaintenance: string;
  sapEquipmentNumber?: string;
}

interface WorkOrder {
  id: string;
  assetName: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  assignedTo: string;
  scheduledDate: string;
  status: "pending" | "in-progress" | "completed";
  sapOrderNumber?: string;
}
```

When replacing with real API, keep these interfaces unchanged for smooth transition.

## Adding Components

### shadcn/ui Components

49 components already installed. To add more:

```bash
npx shadcn-ui@latest add [component-name]
```

Config is in `components.json` (uses `@/` alias, CSS variables, Tailwind).

### Custom Components

1. Create in `/src/components/` (or `/src/components/ui/` for reusable primitives)
2. Use TypeScript with explicit prop interfaces
3. Export as named or default export
4. Follow existing naming: PascalCase for component files

## Important Configuration Files

- **Entry**: `src/main.tsx`
- **Routing**: `src/App.tsx`
- **Design tokens**: `src/index.css`
- **Utilities**: `src/lib/utils.ts`
- **Mock API**: `src/services/mockSapApi.ts`
- **Vite**: `vite.config.ts` (port 8080, path aliases)
- **Tailwind**: `tailwind.config.ts`
- **TypeScript**: `tsconfig.json` (strict: false, path alias: `@/*`)
- **shadcn**: `components.json`

## TypeScript Configuration

- **Strict mode disabled**: `strict: false`, `noImplicitAny: false`
- Target: ES2020
- JSX: react-jsx
- Path alias: `@/*` → `./src/*`

## Domain Context

**Business domain**: Industrial asset management and predictive maintenance

**Key terminology**:

- **Asset**: Physical equipment (turbines, pumps, compressors)
- **Health Score**: 0-100 metric for asset condition
- **Failure Probability**: AI-predicted likelihood of failure
- **Work Order**: Maintenance task/job
- **SAP PM**: SAP Plant Maintenance module (ERP system)
- **MTBF**: Mean Time Between Failures

## Package Management

Both npm and Bun lockfiles are present. Use npm for consistency with existing setup.
