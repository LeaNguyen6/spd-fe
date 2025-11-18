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
    const [models, setModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [isSelectingModel, setIsSelectingModel] = useState(false);

    // Load models when modal opens
    useEffect(() => {
        if (open) {
            loadModels();
        }
    }, [open]);

    const loadModels = async () => {
        try {
            setIsLoadingModels(true);
            const response = await apiService.getModelList();
            setModels(response.data.models);

            // Set default selection to first available model
            if (response.data.models.length > 0) {
                setSelectedModel(response.data.models[0]);
            }
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
        if (!selectedModel) {
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
                classification_model: selectedModel.model_type === "classification" ? selectedModel.model_name : undefined,
                regression_model: selectedModel.model_type === "regression" ? selectedModel.model_name : undefined,
            });

            toast({
                title: "Success",
                description: response.message || "Model selection completed successfully",
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
                            <span className="ml-2 text-sm text-muted-foreground">Loading models...</span>
                        </div>
                    ) : (
                        <>
                            {models.length > 0 ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="model">Select Model</Label>
                                    <Select
                                        value={selectedModel?.model_name || ""}
                                        onValueChange={(modelName) => {
                                            const model = models.find(m => m.model_name === modelName);
                                            if (model) setSelectedModel(model);
                                        }}
                                    >
                                        <SelectTrigger id="model">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {models.map((model) => (
                                                <SelectItem key={model.model_name} value={model.model_name}>
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
                        disabled={isSelectingModel || isLoadingModels || models?.length === 0}
                    >
                        {isSelectingModel && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isSelectingModel ? "Selecting..." : "Confirm Selection"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SelectModelDialog;
