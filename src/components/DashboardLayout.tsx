import { ReactNode } from "react";
import { LayoutDashboard, Wrench, TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type UserRole } from "@/types/roles";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  onLogout: () => void;
}

const DashboardLayout = ({ children, userRole, onLogout }: DashboardLayoutProps) => {
  const roleLabels = {
    assets: { label: "Asset Manager", icon: LayoutDashboard },
    maintenance: { label: "Maintenance Planner", icon: Wrench },
    reliability: { label: "Reliability Engineer", icon: TrendingUp },
  };

  const currentRole = roleLabels[userRole];
  const RoleIcon = currentRole.icon;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-gradient-primary border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img
                  src="/logospd.png"
                  alt="SPD Logo"
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-xl font-bold text-primary-foreground">AssetAI Platform</h1>
              </div>
              <Badge variant="secondary" className="hidden md:flex items-center gap-2 px-3 py-1">
                <RoleIcon className="w-4 h-4" />
                {currentRole.label}
              </Badge>
            </div>
            <Button variant="ghost" onClick={onLogout} className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/20">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
