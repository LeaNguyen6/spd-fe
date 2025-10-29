import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import AssetHealthCard from "@/components/AssetHealthCard";
import { Activity, AlertTriangle, TrendingUp, Wrench, RefreshCw, Loader2 } from "lucide-react";
import { apiService, type Asset, type WorkOrder } from "@/services/index";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";



const AssetManagerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [displayCount, setDisplayCount] = useState(10);
    const [showLoadMore, setShowLoadMore] = useState(false);

    // Calculate pending replacements from work orders
    const getPendingReplacements = () => {
        return workOrders.filter(order =>
            order.status === 'PENDING' || order.status === 'IN_PROGRESS'
        ).length;
    };

    const pendingReplacements = getPendingReplacements();

    useEffect(() => {
        loadAssets();
        loadWorkOrders();
    }, []);
    const loadAssets = async () => {
        try {
            setLoading(true);
            const assetsData = await apiService.getAssets();
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

    const loadWorkOrders = async () => {
        try {
            const workOrdersData = await apiService.getWorkOrders();
            setWorkOrders(workOrdersData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load work orders from SAP PM",
                variant: "destructive",
            });
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
                <Button disabled={loading} variant="outline" onClick={loadAssets}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Assets" value={assets.length} icon={<Activity className="w-4 h-4" />} />
                <MetricCard title="High-Risk Assets" value={assets.filter(asset => asset.healthScore > 70).length} trend="up" variant="warning" icon={<AlertTriangle className="w-4 h-4" />} />
                <MetricCard title="Avg Life Cycle Progress" value={`${(assets.reduce((acc, asset) => acc + asset.healthScore, 0) / assets.length || 0).toFixed(2)}%`} trend="up" variant="success" icon={<TrendingUp className="w-4 h-4" />} />
                <MetricCard title="Pending Replacements" value={pendingReplacements} icon={<Wrench className="w-4 h-4" />} />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Asset Health Overview</h3>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        <span className="ml-3 text-muted-foreground">Loading assets...</span>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default AssetManagerDashboard;