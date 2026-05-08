import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send, CheckCircle2, Clock, XCircle, Music, Calendar, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import db from '@/lib/shared/kliv-database.js';

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

interface Track {
  _row_id: string;
  title: string;
  artist: string;
  isrc: string;
  release_date: string;
  status: string;
  artwork?: string;
}

interface Pitch {
  _row_id: string;
  track_id: string;
  track_title: string;
  pitch_text: string;
  status: 'pending' | 'submitted' | 'accepted' | 'rejected';
  submitted_date: string;
  response_date?: string;
}

export default function SpotifyPitching() {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [pitchText, setPitchText] = useState('');
  const [pitching, setPitching] = useState(false);

  useEffect(() => {
    loadTracks();
    loadPitches();
  }, []);

  const loadTracks = async () => {
    try {
      const { data } = await db.query('tracks', {
        _created_by: `eq.${user?.userUuid}`,
        status: 'eq.live'
      }, {
        select: '*,releases!inner(title,artist,artwork,status)'
      });
      
      setTracks(data || []);
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  };

  const loadPitches = async () => {
    try {
      const { data } = await db.query('spotify_pitches', {
        _created_by: `eq.${user?.userUuid}`
      }, {
        order: '_created_at.desc'
      });
      
      setPitches(data || []);
    } catch (error) {
      console.error('Error loading pitches:', error);
    }
  };

  const handleSubmitPitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrack || !pitchText.trim()) {
      toast.error('Please select a track and write your pitch');
      return;
    }

    setPitching(true);
    try {
      await db.insert('spotify_pitches', {
        track_id: selectedTrack._row_id,
        track_title: selectedTrack.title,
        pitch_text: pitchText,
        status: 'submitted',
        submitted_date: new Date().toISOString()
      });

      toast.success('Pitch submitted to Spotify successfully!');
      setPitchText('');
      setSelectedTrack(null);
      loadPitches();
    } catch (error) {
      toast.error('Failed to submit pitch');
    } finally {
      setPitching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Draft</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500"><Send className="w-3 h-3 mr-1" /> Submitted</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = {
    submitted: pitches.filter(p => p.status === 'submitted').length,
    accepted: pitches.filter(p => p.status === 'accepted').length,
    pending: pitches.filter(p => p.status === 'submitted').length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <SpotifyIcon className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Spotify Playlist Pitching</h1>
            <p className="text-sm text-muted-foreground">Submit your tracks to Spotify's playlist editors</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pitches</p>
                <p className="text-2xl font-bold">{pitches.length}</p>
              </div>
              <Send className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-green-500">{stats.accepted}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-blue-500">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Pitch Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              New Pitch
            </CardTitle>
            <CardDescription>Select a track and write your pitch to Spotify editors</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPitch} className="space-y-4">
              <div>
                <Label htmlFor="track">Select Track *</Label>
                <select
                  id="track"
                  value={selectedTrack?._row_id || ''}
                  onChange={(e) => {
                    const track = tracks.find(t => t._row_id === e.target.value);
                    setSelectedTrack(track || null);
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="">Choose a track to pitch</option>
                  {tracks.map(track => (
                    <option key={track._row_id} value={track._row_id}>
                      {track.title} - {track.artist}
                    </option>
                  ))}
                </select>
                {tracks.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    No eligible tracks. Your tracks must be live to be pitched.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="pitch">Your Pitch *</Label>
                <Textarea
                  id="pitch"
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  placeholder="Tell Spotify editors why this track deserves to be on a playlist. Include information about the song's story, your vision, and why listeners will connect with it..."
                  rows={8}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Be specific and personal. Editors appreciate knowing the story behind the music.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 gap-2"
                disabled={pitching || !selectedTrack || !pitchText.trim()}
              >
                <SpotifyIcon className="w-4 h-4" />
                {pitching ? 'Submitting...' : 'Submit to Spotify'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Pitch History */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Pitch History
            </CardTitle>
            <CardDescription>Track your submitted pitches and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pitches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pitches submitted yet</p>
                  <p className="text-sm">Submit your first pitch to get started</p>
                </div>
              ) : (
                pitches.map(pitch => (
                  <div key={pitch._row_id} className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{pitch.track_title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(pitch.submitted_date).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(pitch.status)}
                    </div>
                    {pitch.pitch_text && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {pitch.pitch_text}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-border mt-6 bg-gradient-to-r from-green-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Pitching Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Be Authentic</p>
              <p className="text-muted-foreground">Share the genuine story behind your music and what makes it unique</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Time It Right</p>
              <p className="text-muted-foreground">Submit pitches 2-4 weeks before your release date for best results</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Know Your Audience</p>
              <p className="text-muted-foreground">Explain who your listeners are and why they'll connect with this track</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Be Specific</p>
              <p className="text-muted-foreground">Mention specific playlists that would be a good fit for your music</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}