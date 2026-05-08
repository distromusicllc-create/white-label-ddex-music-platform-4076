import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import functions from '@/lib/shared/kliv-functions.js';

// @ts-ignore - Kliv SDK files don't have TypeScript declarations

type HistoryEntry = {
  _row_id: number;
  deliveryId: number;
  action: string;
  status: string;
  message: string;
  xmlId: string;
  timestamp: string;
  platform: string;
  release: string;
};

type DeliveryHistoryProps = {
  releaseId: string;
};

export default function DeliveryHistory({ releaseId }: DeliveryHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [releaseId]);

  const loadHistory = async () => {
    try {
      const result = await functions.get('get-delivery-history', {
        query: { releaseId }
      });
      setHistory(result.history || []);
    } catch (err: any) {
      console.error('Failed to load delivery history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'submitted': return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'processing': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'webhook_received': return <RefreshCw className="w-4 h-4 text-purple-400" />;
      case 'retry': return <RefreshCw className="w-4 h-4 text-orange-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      'delivered': 'bg-green-500/10 text-green-400 border-green-500/20',
      'processing': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
      'pending': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'error': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return variants[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Loading delivery history...</p>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No delivery history yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Delivery History</h3>
        <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show Less' : 'Show All'}
        </Button>
      </div>
      <div className="space-y-2">
        {history.slice(0, expanded ? undefined : 3).map((entry) => (
          <div key={entry._row_id} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
            <div className="mt-0.5">
              {getActionIcon(entry.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium capitalize">{entry.action}</span>
                <Badge className={`text-xs ${getStatusBadge(entry.status)}`}>
                  {entry.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{entry.platform}</span>
              </div>
              {entry.message && (
                <p className="text-xs text-muted-foreground truncate">{entry.message}</p>
              )}
              {entry.xmlId && (
                <p className="text-xs text-muted-foreground mt-1">ID: {entry.xmlId}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(entry.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
