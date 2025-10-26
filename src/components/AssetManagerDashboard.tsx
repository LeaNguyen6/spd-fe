import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import AssetHealthCard from "@/components/AssetHealthCard";
import { Activity, AlertTriangle, TrendingUp, Wrench, RefreshCw } from "lucide-react";
import { apiService, type Asset } from "@/services/index";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";



const AssetManagerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [displayCount, setDisplayCount] = useState(10);
    const [showLoadMore, setShowLoadMore] = useState(false);

    useEffect(() => {
        loadAssets();
    }, []);
    const loadAssets = async () => {
        try {
            setLoading(true);
            const assetsData = await apiService.getAssets();
            console.log('Assets:', assetsData);
            setAssets(assetsData);
            setShowLoadMore(assetsData.length > 10);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load assets from SAP PM",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setDisplayCount(assets.length);
        setShowLoadMore(false);
    };

    const displayedAssets = assets.slice(0, displayCount);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Asset Manager Dashboard</h2>
                    <p className="text-muted-foreground">Monitor asset health and manage replacement planning</p>
                </div>
                <Button disabled={loading} variant="outline">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Assets" value="847" icon={<Activity className="w-4 h-4" />} />
                <MetricCard title="High-Risk Assets" value="23" subtitle="+3 from last week" trend="up" variant="warning" icon={<AlertTriangle className="w-4 h-4" />} />
                <MetricCard title="Avg Health Score" value="78%" subtitle="+2% improvement" trend="up" variant="success" icon={<TrendingUp className="w-4 h-4" />} />
                <MetricCard title="Pending Replacements" value="12" icon={<Wrench className="w-4 h-4" />} />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Asset Health Overview</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {displayedAssets.map((asset) => (
                        <AssetHealthCard key={asset.assetId} {...asset} />
                    ))}
                </div>
                {showLoadMore && (
                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={handleLoadMore}
                            variant="outline"
                            className="px-8 py-2"
                        >
                            Load More Assets ({assets.length - displayCount} remaining)
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetManagerDashboard;