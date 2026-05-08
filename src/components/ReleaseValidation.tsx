import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

type ValidationIssue = {
  field: string;
  message: string;
  severity: 'error' | 'warning';
};

type ReleaseValidationProps = {
  release: any;
  tracks: any[];
  onValidate?: (valid: boolean, issues: ValidationIssue[]) => void;
};

export default function ReleaseValidation({ release, tracks, onValidate }: ReleaseValidationProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  useEffect(() => {
    const validationIssues = validateRelease(release, tracks);
    setIssues(validationIssues);
    const valid = validationIssues.filter(i => i.severity === 'error').length === 0;
    onValidate?.(valid, validationIssues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [release, tracks]);

  if (issues.length === 0) {
    return (
      <Card className="p-4 bg-green-500/10 border-green-500/20">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-400">Release is ready for distribution</p>
            <p className="text-xs text-green-300/70">All required metadata is complete</p>
          </div>
        </div>
      </Card>
    );
  }

  const errorCount = issues.filter(i => i.severity === 'error').length;

  return (
    <Card className={`p-4 ${errorCount > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
      <div className="flex items-start gap-3">
        {errorCount > 0 ? (
          <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${errorCount > 0 ? 'text-red-400' : 'text-yellow-400'}`}>
            {errorCount > 0 ? 'Cannot distribute - Issues found' : 'Warning - Optional metadata missing'}
          </p>
          <div className="mt-3 space-y-2">
            {issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className={`text-xs font-medium mt-0.5 ${
                  issue.severity === 'error' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {issue.field}:
                </span>
                <span className="text-xs text-muted-foreground">{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function validateRelease(release: any, tracks: any[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Required fields
  if (!release.title || release.title.trim() === '') {
    issues.push({ field: 'Title', message: 'Release title is required', severity: 'error' });
  }

  if (!release.artist_name || release.artist_name.trim() === '') {
    issues.push({ field: 'Artist', message: 'Artist name is required', severity: 'error' });
  }

  if (!release.cover_url || release.cover_url.trim() === '') {
    issues.push({ field: 'Cover Art', message: 'Cover art image is required', severity: 'error' });
  }

  if (!release.genre || release.genre.trim() === '') {
    issues.push({ field: 'Genre', message: 'Genre is required for distribution', severity: 'error' });
  }

  if (!tracks || tracks.length === 0) {
    issues.push({ field: 'Tracks', message: 'At least one track is required', severity: 'error' });
  }

  // Track validation
  tracks.forEach((track, idx) => {
    if (!track.title || track.title.trim() === '') {
      issues.push({ 
        field: `Track ${idx + 1}`, 
        message: 'Track title is missing', 
        severity: 'error' 
      });
    }

    if (!track.audio_url || track.audio_url.trim() === '') {
      issues.push({ 
        field: `Track ${idx + 1}`, 
        message: 'Audio file is missing', 
        severity: 'error' 
      });
    }

    if (!track.duration_seconds || track.duration_seconds <= 0) {
      issues.push({ 
        field: `Track ${idx + 1}`, 
        message: 'Track duration is missing or invalid', 
        severity: 'warning' 
      });
    }
  });

  // Recommended fields
  if (!release.release_date) {
    issues.push({ field: 'Release Date', message: 'Release date recommended', severity: 'warning' });
  }

  if (!release.upc) {
    issues.push({ field: 'UPC', message: 'UPC/EAN barcode recommended (will be auto-generated)', severity: 'warning' });
  }

  if (!release.label_name) {
    issues.push({ field: 'Label', message: 'Label name recommended', severity: 'warning' });
  }

  return issues;
}
