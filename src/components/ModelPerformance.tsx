import MetricCard from "@/components/MetricCard";
import {
  Activity,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  sapApi,
  MonitorsDrift,
  MonitorsModelDrift,
  ReliabilityStats,
} from "@/services/sapApi";
import RetrainModel from "./RetrainModel";
import SelectModelDialog from "./SelectModelDialog";
import { PrecisionRecallChart } from "./PrecisionRecallChart";
import { apiService } from "@/services";
import { toast } from "@/hooks/use-toast";

const ModelPerformance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reliabilityStats, setReliabilityStats] =
    useState<ReliabilityStats | null>(null);

  const loadReliabilityStats = async () => {
    try {
      setIsLoading(true);
      const stats = await apiService.getReliabilityStats();
      setReliabilityStats(stats);
    } catch (error) {
      console.error("Failed to load reliability stats:", error);
      toast({
        title: "Error",
        description: "Failed to load reliability statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadReliabilityStatsTrigger = async () => {
    try {
      setIsLoading(true);
      const stats = await apiService.getReliabilityStatsTrigger();
      setReliabilityStats(stats);
    } catch (error) {
      console.error("Failed to load reliability stats trigger:", error);
      toast({
        title: "Error",
        description: "Failed to load reliability statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReliabilityStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-muted-foreground">
          Loading reliability statistics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Model Accuracy"
          value={`${(reliabilityStats?.f1_score * 100).toFixed(2)}%`}
          variant="success"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Mean Squared Error"
          value={`${
            reliabilityStats?.mean_squared_error?.toFixed(2) || 0
          } cycles`}
          icon={<ShieldAlert className="w-4 h-4" />}
        />
        <MetricCard
          title="Mean Absolute Error"
          value={`${
            reliabilityStats?.mean_absolute_error?.toFixed(2) || 0
          } cycles`}
          variant="warning"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <MetricCard
          title="Mean Absolute Percentage Error"
          value={`${
            reliabilityStats?.mean_absolute_percentage_error?.toFixed(2) || 0
          }%`}
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      <div className="flex gap-2">
        <RetrainModel />
        <SelectModelDialog onModelSelected={loadReliabilityStatsTrigger} />
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-card">
        {reliabilityStats && (
          <PrecisionRecallChart
            precisionArray={reliabilityStats.precision}
            recallArray={reliabilityStats.recall}
          />
        )}
      </div>
    </div>
  );
};

export default ModelPerformance;
