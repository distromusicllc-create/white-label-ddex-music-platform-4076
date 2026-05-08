import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/DashboardLayout';
import FileUpload from '@/components/FileUpload';
import db from '@/lib/shared/kliv-database.js';
import { toast } from 'sonner';
import { generateUPC, validateUPC } from '@/lib/utils/ddex';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewRelease() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [upcStatus, setUpcStatus] = useState<'valid' | 'invalid' | 'auto'>('auto');
  const [form, setForm] = useState({
    title: '',
    artist_name: '',
    release_type: 'single',
    genre: '',
    upc: '',
    release_date: '',
    label_name: '',
    description: '',
  });

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Validate UPC when it changes
    if (field === 'upc') {
      if (value === '') {
        setUpcStatus('auto');
      } else if (validateUPC(value)) {
        setUpcStatus('valid');
      } else {
        setUpcStatus('invalid');
      }
    }
  };

  const generateCodes = () => {
    const newUPC = generateUPC();
    update('upc', newUPC);
    setUpcStatus('valid');
    toast.success('UPC code generated!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Generate UPC if not provided
      const upc = form.upc || generateUPC();
      
      const release = await db.insert('releases', { 
        ...form, 
        cover_url: coverUrl, 
        upc: upc.replace(/\s/g, ''), // Remove spaces for storage
        status: 'draft' 
      });
      
      toast.success('Release created!');
      navigate(`/dashboard/releases/${release._row_id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create release');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = (path: string) => {
    setCoverUrl(path);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">New Release</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the metadata for your new release</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-5 border-border space-y-3 sticky top-6">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-sm font-medium">Cover Art</CardTitle>
              <CardDescription className="text-xs">Required for distribution</CardDescription>
            </CardHeader>
            <FileUpload
              type="image"
              currentUrl={coverUrl}
              onUploadComplete={handleCoverUpload}
              maxSizeMB={10}
            />
            <p className="text-xs text-muted-foreground">Recommended: 3000x3000px, JPG or PNG</p>
          </Card>
          
          <Card className="p-5 border-border space-y-3 mt-4 sticky top-6">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Code Generation
              </CardTitle>
              <CardDescription className="text-xs">Auto-generate industry codes</CardDescription>
            </CardHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">UPC Code</span>
                <Badge variant={upcStatus === 'auto' ? 'secondary' : upcStatus === 'valid' ? 'default' : 'destructive'}>
                  {upcStatus === 'auto' ? 'Auto' : upcStatus === 'valid' ? 'Ready' : 'Invalid'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {upcStatus === 'auto' 
                  ? 'Will be auto-generated on save' 
                  : upcStatus === 'valid' 
                  ? 'Valid code ready for distribution' 
                  : 'Please enter a valid 12-digit UPC'}
              </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title"
                  value={form.title} 
                  onChange={e => update('title', e.target.value)} 
                  required 
                  placeholder="Release title" 
                />
              </div>
              <div>
                <Label htmlFor="artist_name">Artist Name *</Label>
                <Input 
                  id="artist_name"
                  value={form.artist_name} 
                  onChange={e => update('artist_name', e.target.value)} 
                  required 
                  placeholder="Primary artist" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="release_type">Type</Label>
                <select
                  id="release_type"
                  value={form.release_type}
                  onChange={e => update('release_type', e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="single">Single</option>
                  <option value="ep">EP</option>
                  <option value="album">Album</option>
                </select>
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input 
                  id="genre"
                  value={form.genre} 
                  onChange={e => update('genre', e.target.value)} 
                  placeholder="e.g. Hip-Hop" 
                />
              </div>
              <div>
                <Label htmlFor="release_date">Release Date</Label>
                <Input 
                  id="release_date"
                  type="date" 
                  value={form.release_date} 
                  onChange={e => update('release_date', e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="upc">UPC / EAN</Label>
                <div className="flex gap-2">
                  <Input
                    id="upc"
                    value={form.upc}
                    onChange={e => update('upc', e.target.value)}
                    placeholder="Auto-generated if blank"
                    className={upcStatus === 'invalid' ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateCodes}
                    title="Generate UPC code"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
                {upcStatus === 'valid' && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <p className="text-xs text-green-400">Valid UPC code</p>
                  </div>
                )}
                {upcStatus === 'invalid' && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <p className="text-xs text-red-400">Invalid UPC format (must be 12 digits)</p>
                  </div>
                )}
                {upcStatus === 'auto' && (
                  <p className="text-xs text-muted-foreground mt-1">Click the magic wand to auto-generate</p>
                )}
              </div>
              <div>
                <Label htmlFor="label_name">Label</Label>
                <Input 
                  id="label_name"
                  value={form.label_name} 
                  onChange={e => update('label_name', e.target.value)} 
                  placeholder="Label name" 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                placeholder="Optional description or notes"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? 'Creating...' : 'Create Release'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/releases')}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
