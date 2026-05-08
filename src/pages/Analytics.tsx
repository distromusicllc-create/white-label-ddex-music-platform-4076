import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Headphones, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import db from '@/lib/shared/kliv-database.js';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  period: string;
  streams: number;
  revenue_cents: number;
  platform: string;
  release_id: number;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [totalStreams, setTotalStreams] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '12m' | 'all'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
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
      
      const streams = filteredData.reduce((sum: number, d: AnalyticsData) => sum + (d.streams || 0), 0);
      const revenue = filteredData.reduce((sum: number, d: AnalyticsData) => sum + (d.revenue_cents || 0), 0);
      
      setTotalStreams(streams);
      setTotalRevenue(revenue / 100);
    } catch (error) {
      console.log('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
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

  const platformColors: Record<string, string> = {
    'spotify': '#1DB954',
    'apple_music': '#FA2D48',
    'amazon_music': '#00A8E1',
    'youtube_music': '#FF0000',
    'tidal': '#000000',
    'deezer': '#6c2d96',
  };

  const platformNames: Record<string, string> = {
    'spotify': 'Spotify',
    'apple_music': 'Apple Music',
    'amazon_music': 'Amazon Music',
    'youtube_music': 'YouTube Music',
    'tidal': 'Tidal',
    'deezer': 'Deezer',
  };

  const pieData = Object.entries(platformData).map(([platform, data]) => ({
    name: platformNames[platform] || platform,
    value: data.streams,
    color: platformColors[platform] || '#888888',
    revenue: data.revenue / 100,
  })).sort((a, b) => b.value - a.value);

  // Group by period for line chart
  const monthlyData = analytics.reduce((acc: Record<string, { streams: number; revenue: number }>, curr) => {
    const month = curr.period.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { streams: 0, revenue: 0 };
    }
    acc[month].streams += curr.streams || 0;
    acc[month].revenue += curr.revenue_cents || 0;
    return acc;
  }, {});

  const lineData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      streams: data.streams,
      revenue: data.revenue / 100,
    }))
    .sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your streaming performance across platforms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border border-border p-1">
          {(['30d', '90d', '12m', 'all'] as const).map(period => (
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{totalStreams.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Streams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">${totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Est. Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">
                  {pieData.length > 0 ? pieData.length : 0}
                </p>
                <p className="text-xs text-muted-foreground">Active Platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streaming Trend */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Streaming Trend
            </CardTitle>
            <CardDescription>Your streams over time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : lineData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No data available for selected period</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="streams" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Platform Distribution
            </CardTitle>
            <CardDescription>Streams by platform</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : pieData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No platform data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()} streams`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card className="border-border mt-6">
        <CardHeader>
          <CardTitle className="font-display text-sm">Platform Breakdown</CardTitle>
          <CardDescription>Detailed performance by streaming service</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : Object.keys(platformData).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No platform data available yet</div>
          ) : (
            <div className="space-y-4">
              {Object.entries(platformData)
                .sort(([, a], [, b]) => b.streams - a.streams)
                .map(([platform, data]) => (
                  <div key={platform} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: platformColors[platform] || '#888888' }}
                        />
                        <span className="font-medium">{platformNames[platform] || platform}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-muted-foreground">{data.streams.toLocaleString()} streams</span>
                        <span className="font-medium w-16 text-right">${(data.revenue / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(data.streams / totalStreams) * 100}%`,
                          backgroundColor: platformColors[platform] || '#888888'
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Data Notice */}
      {analytics.length === 0 && !loading && (
        <Card className="border-border bg-muted/30 mt-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <BarChart3 className="w-10 h-10 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">No analytics data yet</p>
                <p className="text-sm text-muted-foreground">
                  Analytics data will appear here once your releases start generating streams. 
                  It typically takes 1-2 days for streaming data to populate after your release goes live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
