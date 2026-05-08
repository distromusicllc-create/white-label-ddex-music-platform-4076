import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Disc3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import db from '@/lib/shared/kliv-database.js';

export default function Releases() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.query('releases', { order: '_created_at.desc' })
      .then(setReleases)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Releases</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all your music releases</p>
        </div>
        <Link to="/dashboard/releases/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> New Release
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading...</div>
      ) : releases.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <Disc3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground mb-4">No releases yet</p>
          <Link to="/dashboard/releases/new">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" /> Create First Release
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {releases.map(r => (
            <Link key={r._row_id} to={`/dashboard/releases/${r._row_id}`} className="block">
              <div className="p-5 rounded-xl border border-border bg-card flex items-center justify-between hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  {r.cover_url ? (
                    <img src={r.cover_url} alt="" className="w-12 h-12 rounded-lg object-cover" style={{ maxWidth: '48px' }} />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Disc3 className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.artist_name} · {r.release_type} {r.upc ? `· UPC: ${r.upc}` : ''}</p>
                  </div>
                </div>
              <div className="flex items-center gap-3">
                {r.release_date && <span className="text-xs text-muted-foreground hidden sm:block">{r.release_date}</span>}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  r.status === 'live' ? 'bg-green-500/10 text-green-400' :
                  r.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                  r.status === 'submitted' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-muted text-muted-foreground'
                }`}>{r.status}</span>
              </div>
            </div>
          </Link>
        ))}
        </div>
      )}
    </DashboardLayout>
  );
}
