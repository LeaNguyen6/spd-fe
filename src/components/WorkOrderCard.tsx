import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import { sapApi } from "@/services/sapApi";
type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED"
interface WorkOrderCardProps {
  id: string;
  assetId: string;
  assetName: string;
  type: string;
  priority: "low" | "medium" | "high" | "critical";
  assignedTo: string;
  scheduledDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  onStatusUpdated?: () => void;
}

import { useState } from "react";

const WorkOrderCard = ({ id, assetId, type, priority, assignedTo, scheduledDate, status, onStatusUpdated }: WorkOrderCardProps) => {
  const [loading, setLoading] = useState(false);
  const priorityVariant = {
    low: "white",
    medium: "default",
    high: "secondary",
    critical: "destructive",
  };

  const statusVariant = {
    "PENDING": "secondary",
    "IN_PROGRESS": "default",
    "COMPLETED": "success",
  };
  const onStatusUpdate = async (workOrderId: string, status: Status) => {
    setLoading(true);
    try {
      await sapApi.updateWorkOrderStatus(workOrderId, status);
      // Call the callback to refresh data
      onStatusUpdated?.();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{assetId}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{type}</p>
          </div>
          <Badge variant={priorityVariant[priority] as "default" | "destructive"}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {scheduledDate}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2" />
          {assignedTo}
        </div>
        <div className="flex items-center justify-between pt-2 border-t h-12">
          <Badge variant={statusVariant[status] as "default"}>
            {status === "IN_PROGRESS" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </Badge>
          {status === "PENDING" && (
            <Button size="sm" variant="outline" onClick={() => onStatusUpdate(id, "IN_PROGRESS")}
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2 w-3 h-3 border-2 border-t-transparent border-current rounded-full inline-block" /> : null}
              Start
            </Button>
          )}
          {status === "IN_PROGRESS" && (
            <Button size="sm" variant="outline" onClick={() => onStatusUpdate(id, "COMPLETED")}
              disabled={loading}
            >
              {loading ? <span className="animate-spin mr-2 w-3 h-3 border-2 border-t-transparent border-current rounded-full inline-block" /> : null}
              Done
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderCard;
