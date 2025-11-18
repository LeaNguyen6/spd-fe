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
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Loader2 } from "lucide-react";
import { apiService } from "@/services";
import { toast } from "@/hooks/use-toast";

// interface RetrainModalProps {
//     onRetrainComplete?: () => void;
// }

const RetrainModal = () => {
    const [open, setOpen] = useState(false);
    const [datasets, setDatasets] = useState<string[]>([]);
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [retrainClassification, setRetrainClassification] = useState(true);
    const [retrainRegression, setRetrainRegression] = useState(true);
    const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
    const [isRetraining, setIsRetraining] = useState(false);

    // Load datasets when modal opens
    useEffect(() => {
        if (open) {
            loadDatasets();
        }
    }, [open]);

    const loadDatasets = async () => {
        try {
            setIsLoadingDatasets(true);
            const response = await apiService.getDatasetList();
            setDatasets(response.data.list);
            if (response.data.list.length > 0) {
                setSelectedDataset(response.data.list[0]);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load datasets",
                variant: "destructive",
            });
            console.error("Failed to load datasets:", error);
        } finally {
            setIsLoadingDatasets(false);
        }
    };

    const handleRetrain = async () => {
        if (!selectedDataset) {
            toast({
                title: "Error",
                description: "Please select a dataset",
                variant: "destructive",
            });
            return;
        }

        if (!retrainClassification && !retrainRegression) {
            toast({
                title: "Error",
                description: "Please select at least one model type to retrain",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsRetraining(true);
            const response = await apiService.retrainModel({
                partition: selectedDataset,
                retrain_classification: retrainClassification,
                retrain_regression: retrainRegression,
            });

            toast({
                title: "Success",
                description: response.message || "Model retrain initiated successfully",
            });

            setOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to retrain model",
                variant: "destructive",
            });
            console.error("Failed to retrain model:", error);
        } finally {
            setIsRetraining(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retrain Model
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Retrain AI Model</DialogTitle>
                    <DialogDescription>
                        Select a dataset and model types to retrain the AI model with new data.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="dataset">Dataset</Label>
                        {isLoadingDatasets ? (
                            <div className="flex items-center justify-center h-10">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                <span className="ml-2 text-sm text-muted-foreground">Loading datasets...</span>
                            </div>
                        ) : (
                            <Select
                                value={selectedDataset}
                                onValueChange={setSelectedDataset}
                                disabled={datasets.length === 0}
                            >
                                <SelectTrigger id="dataset">
                                    <SelectValue placeholder="Select a dataset" />
                                </SelectTrigger>
                                <SelectContent>
                                    {datasets.map((dataset) => (
                                        <SelectItem key={dataset} value={dataset}>
                                            {dataset}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {!isLoadingDatasets && datasets.length === 0 && (
                            <p className="text-sm text-muted-foreground">No datasets available</p>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label>Model Types</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="classification"
                                checked={retrainClassification}
                                onCheckedChange={(checked) => setRetrainClassification(checked as boolean)}
                                disabled={retrainClassification && !retrainRegression}
                            />
                            <label
                                htmlFor="classification"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Classification Model
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="regression"
                                checked={retrainRegression}
                                onCheckedChange={(checked) => setRetrainRegression(checked as boolean)}
                                disabled={retrainRegression && !retrainClassification}
                            />
                            <label
                                htmlFor="regression"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Regression Model
                            </label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isRetraining}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRetrain}
                        disabled={isRetraining || isLoadingDatasets || datasets.length === 0}
                    >
                        {isRetraining && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isRetraining ? "Retraining..." : "Retrain"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RetrainModal;
