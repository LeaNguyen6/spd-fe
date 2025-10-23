import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Users, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Asset Health Monitoring",
      description: "Real-time monitoring and predictive analytics for your industrial assets",
    },
    {
      icon: Zap,
      title: "Predictive Maintenance",
      description: "AI-powered predictions to prevent failures and optimize maintenance schedules",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Tailored dashboards for Asset Managers, Maintenance Planners, and Reliability Engineers",
    },
    {
      icon: Shield,
      title: "SAP Integration",
      description: "Seamless integration with SAP PM for centralized asset management",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AssetAI Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Intelligent Asset Management with AI-Powered Predictive Maintenance
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your industrial operations with smart asset monitoring, predictive analytics,
              and seamless SAP PM integration.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate("/signin")}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Create Account
            </Button>

          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>


        </div>
      </div>
    </div>
  );
};

export default Index;
