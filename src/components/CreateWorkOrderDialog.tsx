import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { apiService, type Asset } from "@/services/index";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import dayjs from "dayjs";

const workOrderSchema = z.object({
  assetName: z.string().trim().min(1, "Asset name is required").max(100, "Asset name too long"),
  type: z.string().trim().min(1, "Work order type is required").max(100, "Type too long"),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"], { required_error: "Priority is required" }),
  assignedTo: z.string().trim().min(1, "Assigned to is required").max(100, "Name too long"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
});

interface CreateWorkOrderDialogProps {
  onWorkOrderCreated: () => void;
  assets: Asset[];
}

const CreateWorkOrderDialog = ({ onWorkOrderCreated, assets }: CreateWorkOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workOrderTypes] = useState([
    { value: "Emergency Repair", label: "Emergency Repair" },
    { value: "Preventive Maintenance", label: "Preventive Maintenance" },
    { value: "Inspection", label: "Inspection" }
  ]);
  const [formData, setFormData] = useState<{
    assetName: string;
    type: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    assignedTo: string;
    scheduledDate: string;
  }>({
    assetName: "",
    type: "",
    priority: "MEDIUM",
    assignedTo: "",
    scheduledDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form function
  const resetForm = () => {
    setFormData({
      assetName: "",
      type: "",
      priority: "MEDIUM",
      assignedTo: "",
      scheduledDate: "",
    });
    setErrors({});
  };

  // Handle dialog open/close
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate form data
      const validated = workOrderSchema.parse(formData);

      setLoading(true);


      // Format the scheduled date using dayjs
      const formattedDate = dayjs(validated.scheduledDate).format();

      // Create work order via API service using real API format
      await apiService.createWorkOrder({
        asset_id: validated.assetName, // Using assetName as asset_id for now
        type: validated.type,
        priority: validated.priority,
        assigned_to: validated.assignedTo,
        scheduled_date: formattedDate,
        status: "PENDING",
      });

      // Reset form and close dialog
      resetForm();
      onWorkOrderCreated();

      setOpen(false);

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
        toast({
          title: "Error",
          description: "Failed to create work order",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assetName">Asset Name</Label>
            <Select
              value={formData.assetName}
              onValueChange={(value: string) => setFormData({ ...formData, assetName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.assetId} value={asset.assetName}>
                    {asset.assetName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assetName && <p className="text-sm text-destructive">{errors.assetName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Work Order Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: string) => setFormData({ ...formData, type: value })}

            >
              <SelectTrigger>
                <SelectValue placeholder="Select Work Order Type" />
              </SelectTrigger>
              <SelectContent>
                {workOrderTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g., Preventive Maintenance"
              maxLength={100}
            /> */}
            {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW") =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="e.g., John Smith"
              maxLength={100}
            />
            {errors.assignedTo && <p className="text-sm text-destructive">{errors.assignedTo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
            {errors.scheduledDate && <p className="text-sm text-destructive">{errors.scheduledDate}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create & Sync to SAP PM"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkOrderDialog;
