import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Music, Play, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/DashboardLayout';
import FileUpload from '@/components/FileUpload';
import ReleaseValidation from '@/components/ReleaseValidation';
import db from '@/lib/shared/kliv-database.js';
import { toast } from 'sonner';

export default function ReleaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [release, setRelease] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  // New track form
  const [newTrack, setNewTrack] = useState({ title: '', audio_url: '' });
  const [showAddTrack, setShowAddTrack] = useState(false);

  useEffect(() => {
    loadRelease();
  }, [id]);

  const loadRelease = async () => {
    try {
      const r = await db.get('releases', Number(id));
      if (!r) { navigate('/dashboard/releases'); return; }
      setRelease(r);
      setForm(r);

      const t = await db.query('tracks', { release_id: `eq.${id}`, order: 'track_number.asc' });
      setTracks(t);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await db.update('releases', { _row_id: `eq.${id}` }, form);
      setRelease({ ...release, ...form });
      setEditing(false);
      toast.success('Release updated');
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this release? This cannot be undone.')) return;
    try {
      await db.delete('releases', { _row_id: `eq.${id}` });
      // Delete associated tracks
      await db.delete('tracks', { release_id: `eq.${id}` });
      toast.success('Release deleted');
      navigate('/dashboard/releases');
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  const handleCoverUpload = async (path: string) => {
    setForm({ ...form, cover_url: path });
  };

  // Add track
  const handleAddTrack = async () => {
    if (!newTrack.title || !newTrack.audio_url) {
      toast.error('Please enter track title and upload audio');
      return;
    }
    try {
      await db.insert('tracks', {
        release_id: Number(id),
        title: newTrack.title,
        audio_url: newTrack.audio_url,
        track_number: tracks.length + 1,
        status: 'pending'
      });
      toast.success('Track added');
      setNewTrack({ title: '', audio_url: '' });
      setShowAddTrack(false);
      loadRelease();
    } catch (e: any) {
      toast.error(e.message || 'Failed to add track');
    }
  };

  const handleDeleteTrack = async (trackId: number) => {
    try {
      await db.delete('tracks', { _row_id: `eq.${trackId}` });
      toast.success('Track removed');
      loadRelease();
    } catch (e: any) {
      toast.error(e.message || 'Failed to remove track');
    }
  };

  const canDistribute = tracks.length > 0 && (form.cover_url || release.cover_url);
  const [isValid, setIsValid] = useState(false);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/releases">
            <Button size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold">{editing ? (
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="text-2xl font-display font-bold h-auto py-1"
              />
            ) : release.title}</h1>
            <p className="text-sm text-muted-foreground">{release.release_type} by {release.artist_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canDistribute && (
            <Link to={`/dashboard/releases/${id}/distribution`}>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 gap-1"
                disabled={!isValid}
              >
                <Globe className="w-4 h-4" /> {isValid ? 'Distribute' : 'Not Ready'}
              </Button>
            </Link>
          )}
          {editing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => { setEditing(false); setForm(release); }}>Cancel</Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleSave}>Save</Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Cover & metadata */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cover art */}
          <div className="p-5 rounded-xl border border-border bg-card space-y-3">
            <h3 className="text-sm font-medium">Cover Art</h3>
            {editing ? (
              <FileUpload
                type="image"
                currentUrl={form.cover_url}
                onUploadComplete={handleCoverUpload}
                maxSizeMB={10}
              />
            ) : (
              <div className="w-full aspect-square rounded-lg bg-accent flex items-center justify-center overflow-hidden">
                {release.cover_url ? (
                  <img src={release.cover_url} alt="Cover" className="w-full h-full object-cover" style={{ maxWidth: '400px' }} />
                ) : (
                  <Music className="w-12 h-12 text-muted-foreground/40" />
                )}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="p-5 rounded-xl border border-border bg-card space-y-4">
            <h3 className="text-sm font-medium">Release Details</h3>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Artist</label>
                  <Input value={form.artist_name} onChange={e => setForm({ ...form, artist_name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Type</label>
                  <select
                    value={form.release_type}
                    onChange={e => setForm({ ...form, release_type: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="single">Single</option>
                    <option value="ep">EP</option>
                    <option value="album">Album</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Genre</label>
                  <Input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">UPC</label>
                  <Input value={form.upc} onChange={e => setForm({ ...form, upc: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Release Date</label>
                  <Input type="date" value={form.release_date} onChange={e => setForm({ ...form, release_date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Label</label>
                  <Input value={form.label_name} onChange={e => setForm({ ...form, label_name: e.target.value })} />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Type:</span> {release.release_type}</div>
                <div><span className="text-muted-foreground">Genre:</span> {release.genre || '-'}</div>
                <div><span className="text-muted-foreground">UPC:</span> {release.upc || '-'}</div>
                <div><span className="text-muted-foreground">Release Date:</span> {release.release_date || '-'}</div>
                <div><span className="text-muted-foreground">Label:</span> {release.label_name || '-'}</div>
                <div><span className="text-muted-foreground">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${
                  release.status === 'live' ? 'bg-green-500/10 text-green-400' :
                  release.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-muted text-muted-foreground'
                }`}>{release.status}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Tracks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Release validation */}
          <ReleaseValidation 
            release={editing ? form : release}
            tracks={tracks}
            onValidate={(valid) => setIsValid(valid)}
          />
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Tracks ({tracks.length})</h3>
              {editing && !showAddTrack && (
                <Button size="sm" onClick={() => setShowAddTrack(true)} className="gap-1">
                  <Plus className="w-3 h-3" /> Add Track
                </Button>
              )}
            </div>

            {/* Add track form */}
            {editing && showAddTrack && (
              <div className="mb-4 p-4 rounded-lg bg-accent space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Track Title</label>
                  <Input
                    value={newTrack.title}
                    onChange={e => setNewTrack({ ...newTrack, title: e.target.value })}
                    placeholder="Enter track title"
                  />
                </div>
                <FileUpload
                  type="audio"
                  currentUrl={newTrack.audio_url}
                  onUploadComplete={url => setNewTrack({ ...newTrack, audio_url: url })}
                  maxSizeMB={100}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTrack} disabled={!newTrack.title || !newTrack.audio_url}>
                    Add Track
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTrack(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Tracks list */}
            {tracks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Music className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No tracks yet</p>
                {editing && <p className="text-xs mt-1">Click "Add Track" to upload your first track</p>}
              </div>
            ) : (
              <div className="space-y-2">
                {tracks.map((track, idx) => (
                  <div key={track._row_id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                    <span className="w-6 text-sm text-muted-foreground">{idx + 1}</span>
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.audio_url?.split('/').pop()}</p>
                    </div>
                    {editing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTrack(track._row_id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
