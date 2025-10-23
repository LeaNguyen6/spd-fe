import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "warning" | "success" | "destructive";
}

const MetricCard = ({ title, value, subtitle, icon, trend, variant = "default" }: MetricCardProps) => {
  const variantStyles = {
    default: "border-border",
    warning: "border-warning/30 bg-warning/5",
    success: "border-success/30 bg-success/5",
    destructive: "border-destructive/30 bg-destructive/5",
  };

  return (
    <Card className={cn("shadow-card", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className={cn("text-sm mt-1", {
            "text-muted-foreground": !trend,
            "text-success": trend === "up",
            "text-destructive": trend === "down",
          })}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
