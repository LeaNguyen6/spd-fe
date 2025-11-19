import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Settings } from "lucide-react";
import { apiService, Model } from "@/services";
import { toast } from "@/hooks/use-toast";

interface SelectModelDialogProps {
  onModelSelected?: () => void;
}

const SelectModelDialog = ({ onModelSelected }: SelectModelDialogProps) => {
  const [open, setOpen] = useState(false);
  const [classificationModels, setClassificationModels] = useState<Model[]>([]);
  const [regressionModels, setRegressionModels] = useState<Model[]>([]);
  const [selectedClassificationModel, setSelectedClassificationModel] =
    useState<Model | null>(null);
  const [selectedRegressionModel, setSelectedRegressionModel] =
    useState<Model | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isSelectingModel, setIsSelectingModel] = useState(false);

  useEffect(() => {
    if (open) {
      loadModels();
    }
  }, [open]);

  useEffect(() => {
    const selectedClassification = classificationModels.find(
      (m) => m.status === "selected"
    );
    if (selectedClassification)
      setSelectedClassificationModel(selectedClassification);

    const selectedRegression = regressionModels.find(
      (m) => m.status === "selected"
    );
    if (selectedRegression) setSelectedRegressionModel(selectedRegression);
  }, [classificationModels, regressionModels]);

  const loadModels = async () => {
    try {
      setIsLoadingModels(true);
      const response = await apiService.getModelList();
      setClassificationModels(
        response.data.models.filter(
          (item) => item.model_type === "classification"
        )
      );
      setRegressionModels(
        response.data.models.filter((item) => item.model_type === "regression")
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load models",
        variant: "destructive",
      });
      console.error("Failed to load models:", error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleModelSelection = async () => {
    if (!selectedClassificationModel && !selectedRegressionModel) {
      toast({
        title: "Error",
        description: "Please select a model",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSelectingModel(true);
      const response = await apiService.selectModel({
        classification_model:
          selectedClassificationModel?.model_name ?? undefined,
        regression_model: selectedRegressionModel?.model_name ?? undefined,
      });

      toast({
        title: "Success",
        description:
          response.message || "Model selection completed successfully",
      });

      setOpen(false);
      onModelSelected?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select model",
        variant: "destructive",
      });
      console.error("Failed to select model:", error);
    } finally {
      setIsSelectingModel(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Select Model
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select AI Model</DialogTitle>
          <DialogDescription>
            Select the model you want to use for predictions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoadingModels ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading models...
              </span>
            </div>
          ) : (
            <>
              {classificationModels.length > 0 ? (
                <div className="grid gap-2">
                  <Label htmlFor="model">Select Classification Model</Label>
                  <Select
                    value={selectedClassificationModel?.model_name || ""}
                    onValueChange={(modelName) => {
                      const model = classificationModels.find(
                        (m) => m.model_name === modelName
                      );
                      if (model) setSelectedClassificationModel(model);
                    }}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {classificationModels.map((model) => (
                        <SelectItem
                          key={model.model_name}
                          value={model.model_name}
                        >
                          {model.model_name}
                          {/* - {model.model_type} ({model.status}) */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No models available
                </p>
              )}

              {regressionModels.length > 0 ? (
                <div className="grid gap-2">
                  <Label htmlFor="model">Select Regression Model</Label>
                  <Select
                    value={selectedRegressionModel?.model_name || ""}
                    onValueChange={(modelName) => {
                      const model = regressionModels.find(
                        (m) => m.model_name === modelName
                      );
                      if (model) setSelectedRegressionModel(model);
                    }}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {regressionModels.map((model) => (
                        <SelectItem
                          key={model.model_name}
                          value={model.model_name}
                        >
                          {model.model_name}
                          {/* - {model.model_type} ({model.status}) */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No models available
                </p>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSelectingModel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleModelSelection}
            disabled={
              isSelectingModel ||
              isLoadingModels ||
              (classificationModels?.length === 0 &&
                regressionModels?.length === 0)
            }
          >
            {isSelectingModel && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isSelectingModel ? "Selecting..." : "Confirm Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectModelDialog;
