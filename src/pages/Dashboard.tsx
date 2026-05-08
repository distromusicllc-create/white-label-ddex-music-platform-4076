import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Disc3, Music2, Plus, DollarSign, Headphones, Upload, BarChart3, Settings, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import db from '@/lib/shared/kliv-database.js';

interface Release {
  _row_id: number;
  title: string;
  artist_name: string;
  release_type: string;
  status: string;
  release_date: string;
  cover_url: string;
}

export default function Dashboard() {
  const [releaseCount, setReleaseCount] = useState(0);
  const [recentReleases, setRecentReleases] = useState<Release[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [totalStreams, setTotalStreams] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [upcomingReleases, setUpcomingReleases] = useState<Release[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const releases = await db.query('releases', { order: '_created_at.desc', limit: '10' });
        setRecentReleases(releases);
        
        const count = await db.count('releases');
        setReleaseCount(count);

        const live = await db.count('releases', { status: 'eq.live' });
        setLiveCount(live);

        // Get deliveries data
        const deliveries = await db.query('deliveries', { status: 'eq.pending' });
        setPendingDeliveries(deliveries.length);

        // Get analytics data
        const analytics = await db.query('analytics');
        const streams = analytics.reduce((sum: number, a: any) => sum + (a.streams || 0), 0);
        const revenue = analytics.reduce((sum: number, a: any) => sum + (a.revenue_cents || 0), 0);
        setTotalStreams(streams);
        setTotalRevenue(revenue / 100); // Convert to dollars

        // Get upcoming releases (scheduled for future)
        const today = new Date().toISOString().split('T')[0];
        const upcoming = releases.filter((r: Release) => r.release_date && r.release_date > today);
        setUpcomingReleases(upcoming.slice(0, 3));
      } catch (error) {
        console.log('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: 'Live Releases', value: liveCount, icon: CheckCircle2, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { label: 'Total Releases', value: releaseCount, icon: Disc3, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Pending Deliveries', value: pendingDeliveries, icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { label: 'Total Streams', value: totalStreams.toLocaleString(), icon: Headphones, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { label: 'Est. Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { label: 'Active Platforms', value: '10+', icon: Music2, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  ];

  const quickActions = [
    { title: 'New Release', description: 'Upload and distribute your music', icon: Upload, href: '/dashboard/releases/new', color: 'bg-primary' },
    { title: 'Analytics', description: 'View streaming performance', icon: BarChart3, href: '/dashboard/analytics', color: 'bg-green-500' },
    { title: 'Manage Releases', description: 'Edit and track releases', icon: Disc3, href: '/dashboard/releases', color: 'bg-purple-500' },
    { title: 'Settings', description: 'Account and label settings', icon: Settings, href: '/dashboard/settings', color: 'bg-orange-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your music distribution overview</p>
        </div>
        <Link to="/dashboard/releases/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> New Release
          </Button>
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className={`w-8 h-8 rounded-lg ${s.bgColor} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold font-display">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {quickActions.map(action => (
          <Link key={action.title} to={action.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Releases */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-primary" /> Recent Releases
                </CardTitle>
                <Link to="/dashboard/releases" className="text-sm text-primary hover:underline">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentReleases.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  <Disc3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm mb-4">No releases yet. Create your first release to get started.</p>
                  <Link to="/dashboard/releases/new">
                    <Button className="bg-primary hover:bg-primary/90 gap-2" size="sm">
                      <Plus className="w-4 h-4" /> Create Release
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentReleases.slice(0, 5).map(r => (
                    <Link key={r._row_id} to={`/dashboard/releases/${r._row_id}`} className="block hover:bg-muted/50 transition-colors">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {r.cover_url ? (
                            <img src={r.cover_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" style={{ maxWidth: '48px' }} />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Disc3 className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{r.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{r.artist_name} · {r.release_type}</p>
                          </div>
                        </div>
                        <Badge variant={
                          r.status === 'live' ? 'default' :
                          r.status === 'processing' ? 'secondary' :
                          'outline'
                        } className={
                          r.status === 'live' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/10' :
                          r.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                          ''
                        }>
                          {r.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Releases */}
        <div>
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="font-display flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" /> Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {upcomingReleases.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No upcoming releases</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReleases.map(r => (
                    <Link key={r._row_id} to={`/dashboard/releases/${r._row_id}`} className="block">
                      <div className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                        <p className="font-medium text-sm truncate">{r.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{r.release_date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="border-border mt-4">
            <CardHeader className="border-b border-border">
              <CardTitle className="font-display text-sm">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">Upload high-quality cover art (3000x3000px recommended)</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">Submit releases at least 2 weeks before release date</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">Check analytics daily to track performance</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
