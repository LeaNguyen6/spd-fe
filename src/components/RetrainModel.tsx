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
import { apiService, Model } from "@/services";
import { toast } from "@/hooks/use-toast";

interface RetrainModalProps {
    onRetrainComplete?: () => void;
}

const RetrainModal = ({ onRetrainComplete }: RetrainModalProps) => {
    const [open, setOpen] = useState(false);
    const [datasets, setDatasets] = useState<string[]>(['d']);
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [retrainClassification, setRetrainClassification] = useState(true);
    const [retrainRegression, setRetrainRegression] = useState(true);
    const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
    const [isRetraining, setIsRetraining] = useState(false);

    // Model selection states
    const [showModelSelection, setShowModelSelection] = useState(false);
    const [models, setModels] = useState<Model[]>([]);
    const [classificationModels, setClassificationModels] = useState<Model[]>([]);
    const [regressionModels, setRegressionModels] = useState<Model[]>([]);
    const [selectedClassificationModel, setSelectedClassificationModel] = useState<string>("");
    const [selectedRegressionModel, setSelectedRegressionModel] = useState<string>("");
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [isSelectingModel, setIsSelectingModel] = useState(false);

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

    const loadModels = async () => {
        try {
            setIsLoadingModels(true);
            const response = await apiService.getModelList();
            setModels(response.models);

            // Separate models by type
            const classificationModels = response.models.filter(m => m.model_type === "classification");
            const regressionModels = response.models.filter(m => m.model_type === "regression");

            setClassificationModels(classificationModels);
            setRegressionModels(regressionModels);

            // Set default selections
            if (classificationModels.length > 0) {
                setSelectedClassificationModel(classificationModels[0].model_name);
            }
            if (regressionModels.length > 0) {
                setSelectedRegressionModel(regressionModels[0].model_name);
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
            // const response = await apiService.retrainModel({
            //     partition: selectedDataset,
            //     retrain_classification: retrainClassification,
            //     retrain_regression: retrainRegression,
            // });

            // toast({
            //     title: "Success",
            //     description: response.message || "Model retrain initiated successfully",
            // });

            // Load models after successful retrain
            await loadModels();
            setShowModelSelection(true);
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

    const handleModelSelection = async () => {
        if (!selectedClassificationModel && !selectedRegressionModel) {
            toast({
                title: "Error",
                description: "Please select at least one model",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSelectingModel(true);
            const response = await apiService.selectModel({
                classification_model: selectedClassificationModel || undefined,
                regression_model: selectedRegressionModel || undefined,
            });

            toast({
                title: "Success",
                description: response.message || "Model selection completed successfully",
            });

            setOpen(false);
            setShowModelSelection(false);
            onRetrainComplete?.();
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
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retrain Model
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {showModelSelection ? "Select AI Model" : "Retrain AI Model"}
                    </DialogTitle>
                    <DialogDescription>
                        {showModelSelection
                            ? "Select the models you want to use for predictions."
                            : "Select a dataset and model types to retrain the AI model with new data."}
                    </DialogDescription>
                </DialogHeader>
                {!showModelSelection ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <div className="grid gap-4 py-4">
                            {isLoadingModels ? (
                                <div className="flex items-center justify-center h-20">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    <span className="ml-2 text-sm text-muted-foreground">Loading models...</span>
                                </div>
                            ) : (
                                <>
                                    {classificationModels.length > 0 && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="classification-model">Classification Model</Label>
                                            <Select
                                                value={selectedClassificationModel}
                                                onValueChange={setSelectedClassificationModel}
                                            >
                                                <SelectTrigger id="classification-model">
                                                    <SelectValue placeholder="Select a classification model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classificationModels.map((model) => (
                                                        <SelectItem key={model.model_name} value={model.model_name}>
                                                            {model.model_name} ({model.status})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    {regressionModels.length > 0 && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="regression-model">Regression Model</Label>
                                            <Select
                                                value={selectedRegressionModel}
                                                onValueChange={setSelectedRegressionModel}
                                            >
                                                <SelectTrigger id="regression-model">
                                                    <SelectValue placeholder="Select a regression model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {regressionModels.map((model) => (
                                                        <SelectItem key={model.model_name} value={model.model_name}>
                                                            {model.model_name} ({model.status})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    {classificationModels.length === 0 && regressionModels.length === 0 && (
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
                                onClick={() => {
                                    setShowModelSelection(false);
                                }}
                                disabled={isSelectingModel}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleModelSelection}
                                disabled={isSelectingModel || isLoadingModels || models.length === 0}
                            >
                                {isSelectingModel && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isSelectingModel ? "Selecting..." : "Confirm Selection"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RetrainModal;
