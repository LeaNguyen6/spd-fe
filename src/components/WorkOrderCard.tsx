import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

interface WorkOrderCardProps {
  id: string;
  assetId: string;
  assetName: string;
  type: string;
  priority: "low" | "medium" | "high" | "critical";
  assignedTo: string;
  scheduledDate: string;
  status: "PENDING" | "IN-PROGRESS" | "COMPLETED";
}

const WorkOrderCard = ({ assetId, type, priority, assignedTo, scheduledDate, status }: WorkOrderCardProps) => {
  const priorityVariant = {
    low: "secondary",
    medium: "default",
    high: "warning",
    critical: "destructive",
  };

  const statusVariant = {
    "PENDING": "secondary",
    "IN-PROGRESS": "default",
    "COMPLETED": "success",
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
        <div className="flex items-center justify-between pt-2 border-t">
          <Badge variant={statusVariant[status] as "default"}>
            {status === "IN-PROGRESS" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </Badge>
          {/* <Button size="sm" variant="outline">Edit</Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderCard;
