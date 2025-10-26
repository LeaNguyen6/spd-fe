import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface AssetHealthCardProps {
  assetName: string;
  category: string;
  healthScore: number;
  confidence: number;
  nextMaintenance: string;
}

const AssetHealthCard = ({ assetName, category, healthScore, confidence, nextMaintenance }: AssetHealthCardProps) => {
  const isHighRisk = healthScore > 60;
  const riskLevel = healthScore > 70 ? "Critical" : healthScore > 40 ? "High" : "Low";
  const riskVariant = healthScore > 70 ? "destructive" : healthScore > 40 ? "warning" : "success";

  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{assetName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{category}</p>
          </div>
          <Badge variant={riskVariant as "default" | "destructive"} className="flex items-center gap-1">
            {isHighRisk ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
            {riskLevel} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Health Score</span>
            <span className="font-semibold">{healthScore.toFixed(2)}%</span>
          </div>
          <Progress value={healthScore} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Prediction Confidence</span>
            <span className="font-semibold">{confidence.toFixed(2)}%</span>
          </div>
          <Progress value={confidence} className="h-2 [&>div]:bg-destructive" />
        </div>
        <div className="pt-2 border-t">
          <span className="text-sm text-muted-foreground">Remaining Useful Life : </span>
          <span className="font-semibold">{nextMaintenance} days</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetHealthCard;
