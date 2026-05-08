import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertCircle, Send, RefreshCw, Globe, RotateCcw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import DeliveryHistory from '@/components/DeliveryHistory';
import functions from '@/lib/shared/kliv-functions.js';
import { toast } from 'sonner';

type PlatformStatus = {
  _row_id: number;
  name: string;
  display_name: string;
  deliveryStatus?: string;
  deliveryDate?: string;
  deliveryId?: number;
  rejectionReason?: string;
  retryCount?: number;
};

type DeliveryData = {
  release: {
    id: number;
    title: string;
    artist: string;
    status: string;
    upc?: string;
    releaseDate?: string;
  };
  platforms: PlatformStatus[];
  trackCount: number;
  deliveredCount: number;
  processingCount: number;
  totalPlatforms: number;
};

export default function DeliveryPipeline() {
  const { id } = useParams();
  const [data, setData] = useState<DeliveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);

  useEffect(() => {
    loadDeliveryStatus();
  }, [id]);

  const loadDeliveryStatus = async () => {
    try {
      const result = await functions.get('get-delivery-status', {
        query: { releaseId: id }
      });
      setData(result as DeliveryData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load delivery status');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelivery = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }
    setSubmitting(true);
    try {
      await functions.post('submit-delivery', {
        body: { releaseId: Number(id), platforms: selectedPlatforms }
      });
      toast.success(`Submitted to ${selectedPlatforms.length} platform(s)`);
      setSelectedPlatforms([]);
      loadDeliveryStatus();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit delivery');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePlatform = (platformId: number) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const selectAllPending = () => {
    const pending = data?.platforms
      .filter(p => !p.deliveryStatus)
      .map(p => p._row_id) || [];
    setSelectedPlatforms(pending);
  };

  const handleRetryDelivery = async (_platformId: number, deliveryId?: number) => {
    if (!deliveryId) {
      toast.error('No delivery record found for retry');
      return;
    }
    
    try {
      await functions.post('process-delivery', {
        body: { deliveryId, action: 'retry' }
      });
      toast.success('Delivery retry submitted');
      loadDeliveryStatus();
    } catch (err: any) {
      toast.error(err.message || 'Failed to retry delivery');
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'taken_down': return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'delivered': return 'Live';
      case 'processing': return 'Processing';
      case 'rejected': return 'Rejected';
      case 'taken_down': return 'Taken Down';
      default: return 'Not Delivered';
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'processing': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'taken_down': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/dashboard/releases/${id}`}>
            <Button size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold">Distribution Pipeline</h1>
            <p className="text-sm text-muted-foreground">{data?.release.title} by {data?.release.artist}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={loadDeliveryStatus}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.totalPlatforms}</p>
              <p className="text-xs text-muted-foreground">Total Platforms</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.deliveredCount}</p>
              <p className="text-xs text-muted-foreground">Live</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.processingCount}</p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.trackCount}</p>
              <p className="text-xs text-muted-foreground">Tracks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery controls */}
      {selectedPlatforms.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between">
          <div>
            <p className="font-medium">{selectedPlatforms.length} platform(s) selected</p>
            <p className="text-sm text-muted-foreground">Ready to distribute via DDEX</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedPlatforms([])}>Clear</Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={handleSubmitDelivery}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : <><Send className="w-4 h-4 mr-1" /> Submit Delivery</>}
            </Button>
          </div>
        </div>
      )}

      {/* Platform list */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Digital Service Providers</h2>
          <Button size="sm" variant="outline" onClick={selectAllPending}>
            Select All Pending
          </Button>
        </div>
        <div className="divide-y divide-border">
          {data?.platforms.map(platform => (
            <div
              key={platform._row_id}
              className={`p-4 flex items-center justify-between hover:bg-accent/50 transition-colors ${
                selectedPlatforms.includes(platform._row_id) ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform._row_id)}
                  onChange={() => togglePlatform(platform._row_id)}
                  disabled={!!platform.deliveryStatus}
                  className="w-4 h-4 rounded border-border"
                />
                <div>
                  <p className="font-medium">{platform.display_name}</p>
                  {platform.deliveryDate && (
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(Number(platform.deliveryDate) * 1000).toLocaleDateString()}
                    </p>
                  )}
                  {platform.rejectionReason && (
                    <p className="text-xs text-red-400 mt-1">{platform.rejectionReason}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(platform.deliveryStatus)}`}>
                  {getStatusIcon(platform.deliveryStatus)}
                  <span className="ml-1">{getStatusText(platform.deliveryStatus)}</span>
                </span>
                {platform.deliveryStatus === 'rejected' && platform.deliveryId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRetryDelivery(platform._row_id, platform.deliveryId)}
                    className="h-7 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Retry
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-sm text-blue-300">
          <strong>DDEX Pipeline:</strong> Releases are delivered to all selected platforms via DDEX XML standard. 
          Processing typically takes 24-72 hours. You'll be notified once your release goes live on each platform.
        </p>
      </div>

      {/* Delivery History */}
      <div className="mt-6">
        <DeliveryHistory releaseId={id || ''} />
      </div>
    </DashboardLayout>
  );
}
