import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { content } from '@/lib/shared/kliv-content.js';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  type: 'audio' | 'image';
  onUploadComplete: (path: string) => void;
  currentUrl?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function FileUpload({ type, onUploadComplete, currentUrl, accept, maxSizeMB = 50 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = accept || (type === 'audio' ? 'audio/*' : 'image/*');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const result = await content.uploadFile(
        file,
        `/content/${type === 'audio' ? 'audio' : 'images'}/`,
        {
          onProgress: ({ percentage }: any) => setProgress(percentage)
        }
      );
      onUploadComplete(result.path);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      {!currentUrl ? (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            uploading ? 'border-muted opacity-50' : 'border-border hover:border-primary/50 hover:bg-accent'
          }`}
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
              <Progress value={progress} className="w-full max-w-[200px] mx-auto" />
              <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {type === 'audio' ? 'Upload Audio' : 'Upload Cover Art'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {type === 'audio' ? 'WAV, FLAC, MP3' : 'JPG, PNG (min 3000x3000px)'} · Max {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative group">
          {type === 'image' ? (
            <img
              src={currentUrl}
              alt="Cover"
              className="w-full aspect-square object-cover rounded-lg"
              style={{ maxWidth: '400px' }}
            />
          ) : (
            <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Audio file uploaded</p>
                <p className="text-xs text-muted-foreground truncate">{currentUrl.split('/').pop()}</p>
              </div>
            </div>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onUploadComplete('')}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
