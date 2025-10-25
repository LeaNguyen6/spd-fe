import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail, Lock, User, Loader2, LayoutDashboard, Wrench, TrendingUp } from "lucide-react";
import { authService, logApiUsage } from "@/services/index";
import { tokenManager } from "@/services/authApi";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    role: 'assets' | 'maintenance' | 'reliability';
}

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters"),
    role: z.enum(["assets", "maintenance", "reliability"], {
        required_error: "Please select your role",
    }),
});

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        name: "",
        email: "",
        password: "",
        role: "assets",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const roles = [
        {
            value: "assets",
            label: "Asset Manager",
            description: "Monitor asset health and manage replacement planning",
            icon: LayoutDashboard,
        },
        {
            value: "maintenance",
            label: "Maintenance Planner",
            description: "Schedule and optimize maintenance operations",
            icon: Wrench,
        },
        {
            value: "reliability",
            label: "Reliability Engineer",
            description: "Analyze performance and optimize maintenance strategies",
            icon: TrendingUp,
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            // Validate form data
            const validated = registerSchema.parse(formData);
            setIsLoading(true);
            // logApiUsage("User registration attempt");

            // Attempt registration
            const response = await authService.register(validated as RegisterRequest);

            // Store token and user data
            tokenManager.setToken(response.token);
            localStorage.setItem('userRole', response.user.role);

            navigate("/dashboard");
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                const errorMessage = (error as Error).message || 'Registration failed';
                toast({
                    title: "Registration Failed",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof RegisterRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const selectedRole = roles.find(role => role.value === formData.role);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-elegant">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        Sign Up
                    </CardTitle>
                    <CardDescription>
                        Create your account to access AssetAI Platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    className="pl-10 pr-10"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            <p className="text-xs text-muted-foreground">
                                Password must contain uppercase, lowercase, and number
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: "assets" | "maintenance" | "reliability") =>
                                    handleInputChange("role", value)
                                }
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => {
                                        const Icon = role.icon;
                                        return (
                                            <SelectItem key={role.value} value={role.value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{role.label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {selectedRole && (
                                <p className="text-xs text-muted-foreground">
                                    {selectedRole.description}
                                </p>
                            )}
                            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/signin"
                                className="font-medium text-primary hover:underline"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            to="/role-selection"
                            className="text-sm text-muted-foreground hover:text-primary hover:underline"
                        >
                            Continue without authentication (Demo)
                        </Link>
                    </div>

                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground text-center">
                            Demo Mode: Account will be created locally for testing
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;