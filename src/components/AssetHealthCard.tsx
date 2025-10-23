import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface AssetHealthCardProps {
  assetName: string;
  category: string;
  healthScore: number;
  failureProbability: number;
  nextMaintenance: string;
}

const AssetHealthCard = ({ assetName, category, healthScore, failureProbability, nextMaintenance }: AssetHealthCardProps) => {
  const isHighRisk = failureProbability > 60;
  const riskLevel = failureProbability > 70 ? "Critical" : failureProbability > 40 ? "High" : "Low";
  const riskVariant = failureProbability > 70 ? "destructive" : failureProbability > 40 ? "warning" : "success";

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
            <span className="font-semibold">{healthScore}%</span>
          </div>
          <Progress value={healthScore} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Failure Probability</span>
            <span className="font-semibold">{failureProbability}%</span>
          </div>
          <Progress value={failureProbability} className="h-2 [&>div]:bg-destructive" />
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">Next Maintenance</p>
          <p className="font-medium">{nextMaintenance}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetHealthCard;
