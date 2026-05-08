import { useEffect, useState } from 'react';
import { DollarSign, Download, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import db from '@/lib/shared/kliv-database.js';

interface AnalyticsData {
  period: string;
  streams: number;
  revenue_cents: number;
  platform: string;
  release_id: number;
}

export default function Earnings() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStreams, setTotalStreams] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '30d' | '90d' | '12m'>('all');

  useEffect(() => {
    fetchEarnings();
  }, [selectedPeriod]);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const data = await db.query('analytics', { order: 'period.desc' });
      
      let filteredData = data;
      const now = new Date();
      
      if (selectedPeriod === '30d') {
        const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filteredData = data.filter((d: AnalyticsData) => d.period >= cutoff);
      } else if (selectedPeriod === '90d') {
        const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filteredData = data.filter((d: AnalyticsData) => d.period >= cutoff);
      } else if (selectedPeriod === '12m') {
        const cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filteredData = data.filter((d: AnalyticsData) => d.period >= cutoff);
      }

      setAnalytics(filteredData);
      
      const revenue = filteredData.reduce((sum: number, d: AnalyticsData) => sum + (d.revenue_cents || 0), 0);
      const streams = filteredData.reduce((sum: number, d: AnalyticsData) => sum + (d.streams || 0), 0);
      
      setTotalRevenue(revenue / 100); // Convert to dollars
      setTotalStreams(streams);
    } catch (error) {
      console.log('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const platformColors: Record<string, string> = {
    'spotify': 'bg-green-500',
    'apple_music': 'bg-pink-500',
    'amazon_music': 'bg-blue-500',
    'youtube_music': 'bg-red-500',
    'tidal': 'bg-cyan-500',
    'deezer': 'bg-purple-500',
  };

  const platformNames: Record<string, string> = {
    'spotify': 'Spotify',
    'apple_music': 'Apple Music',
    'amazon_music': 'Amazon Music',
    'youtube_music': 'YouTube Music',
    'tidal': 'Tidal',
    'deezer': 'Deezer',
  };

  // Group by platform
  const platformData = analytics.reduce((acc: Record<string, { streams: number; revenue: number }>, curr) => {
    if (!acc[curr.platform]) {
      acc[curr.platform] = { streams: 0, revenue: 0 };
    }
    acc[curr.platform].streams += curr.streams || 0;
    acc[curr.platform].revenue += curr.revenue_cents || 0;
    return acc;
  }, {});

  // Group by period (monthly)
  const monthlyData = analytics.reduce((acc: Record<string, { streams: number; revenue: number }>, curr) => {
    const month = curr.period.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { streams: 0, revenue: 0 };
    }
    acc[month].streams += curr.streams || 0;
    acc[month].revenue += curr.revenue_cents || 0;
    return acc;
  }, {});

  const payoutThreshold = 50; // Minimum payout amount in dollars
  const currentBalance = totalRevenue;
  const pendingPayout = currentBalance >= payoutThreshold ? currentBalance : 0;
  const amountUntilPayout = Math.max(0, payoutThreshold - currentBalance);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Earnings</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your streaming revenue and payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">${totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">${pendingPayout.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Pending Payout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">
                  {amountUntilPayout > 0 ? `$${amountUntilPayout.toFixed(2)}` : '$0.00'}
                </p>
                <p className="text-xs text-muted-foreground">Until Payout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{totalStreams.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Streams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Filter */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border border-border p-1">
          {(['all', '30d', '90d', '12m'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {period === 'all' ? 'All Time' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Platform */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-sm">Revenue by Platform</CardTitle>
            <CardDescription>Your earnings breakdown by streaming service</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : Object.keys(platformData).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No earnings data yet</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(platformData)
                  .sort(([, a], [, b]) => b.revenue - a.revenue)
                  .map(([platform, data]) => (
                    <div key={platform} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${platformColors[platform] || 'bg-gray-400'}`} />
                          <span className="font-medium">{platformNames[platform] || platform}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">{data.streams.toLocaleString()} streams</span>
                          <span className="font-semibold w-16 text-right">${(data.revenue / 100).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${platformColors[platform] || 'bg-gray-400'}`}
                          style={{ width: `${(data.revenue / totalRevenue / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-sm">Monthly Revenue</CardTitle>
            <CardDescription>Your earnings trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : Object.keys(monthlyData).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No monthly data yet</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(monthlyData)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 6)
                  .map(([month, data]) => {
                    const monthDate = new Date(month + '-01');
                    const monthName = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    const maxRevenue = Math.max(...Object.values(monthlyData).map(d => d.revenue));
                    
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-16">{monthName}</span>
                        <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden relative">
                          <div
                            className="h-full bg-primary absolute left-0 top-0"
                            style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">${(data.revenue / 100).toFixed(2)}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payout Information */}
      <Card className="border-border mt-6">
        <CardHeader>
          <CardTitle className="font-display text-sm">Payout Information</CardTitle>
          <CardDescription>Payment details and schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Minimum Payout Threshold</p>
              <p className="text-2xl font-bold font-display">${payoutThreshold.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">You need ${payoutThreshold.toFixed(2)} in earnings before we can send a payout</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Balance</p>
              <p className="text-2xl font-bold font-display">${currentBalance.toFixed(2)}</p>
              <Badge variant={currentBalance >= payoutThreshold ? 'default' : 'secondary'}>
                {currentBalance >= payoutThreshold ? 'Ready for payout' : 'Accumulating'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Method</p>
              <p className="text-lg font-semibold">Direct Deposit</p>
              <p className="text-xs text-muted-foreground">Payouts are processed on the 15th of each month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Earnings Data Notice */}
      {analytics.length === 0 && !loading && (
        <Card className="border-border bg-muted/30">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <DollarSign className="w-10 h-10 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">No earnings data yet</p>
                <p className="text-sm text-muted-foreground">
                  Once your releases start generating streams, your earnings will appear here. 
                  It typically takes 1-2 months after release to see your first earnings data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
