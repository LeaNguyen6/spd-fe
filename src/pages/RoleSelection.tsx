import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Wrench, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type UserRole } from "@/types/roles";

const RoleSelection = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    const roles = [
        {
            id: "assets" as const,
            title: "Asset Manager",
            description: "Monitor asset health and manage replacement planning",
            icon: LayoutDashboard,
        },
        {
            id: "maintenance" as const,
            title: "Maintenance Planner",
            description: "Schedule and optimize maintenance operations",
            icon: Wrench,
        },
        {
            id: "reliability" as const,
            title: "Reliability Engineer",
            description: "Analyze performance and optimize maintenance strategies",
            icon: TrendingUp,
        },
    ] as const;

    const handleLogin = () => {
        if (!selectedRole) {
            toast({
                title: "Please select a role",
                description: "Choose your role to continue",
                variant: "destructive",
            });
            return;
        }

        localStorage.setItem("userRole", selectedRole);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl shadow-elegant">
                <CardHeader className="text-center space-y-2 pb-6">
                    <CardTitle className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        SP Digital AssetAI Platform
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Select your role to access the dashboard (Demo Mode)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <Card
                                    key={role.id}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedRole === role.id
                                        ? "ring-2 ring-primary bg-primary/5"
                                        : "hover:bg-accent/50"
                                        }`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    <CardHeader className="text-center space-y-3">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <CardTitle className="text-lg">{role.title}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {role.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>

                    <Button
                        onClick={handleLogin}
                        className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
                        size="lg"
                    >
                        Continue to Dashboard
                    </Button>

                    {/* <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Want to create an account?{" "}
                            <button
                                onClick={() => navigate("/signin")}
                                className="font-medium text-primary hover:underline"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    );
};

export default RoleSelection;