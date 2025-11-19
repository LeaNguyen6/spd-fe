import QualityMonitoring from "./QualityMonitoring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModelPerformance from "./ModelPerformance";

const ReliabilityEngineerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Reliability Engineer Dashboard
        </h2>
        <p className="text-muted-foreground">
          Analyze performance and optimize maintenance strategies
        </p>
      </div>

      <Tabs defaultValue="model-performance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="model-performance">Model Performance</TabsTrigger>
          <TabsTrigger value="quality-monitoring">
            Quality Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="model-performance" className="space-y-6 mt-6">
          <ModelPerformance />
        </TabsContent>

        <TabsContent value="quality-monitoring" className="space-y-6 mt-6">
          <QualityMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReliabilityEngineerDashboard;
