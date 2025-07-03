import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PublishControlsProps {
  tourId: string | null;
  initialStatus: 'draft' | 'published' | 'private';
  onStatusChange?: (newStatus: 'draft' | 'published' | 'private') => void;
}

const PublishControls: React.FC<PublishControlsProps> = ({
  tourId,
  initialStatus,
  onStatusChange,
}) => {
  const [isPublic, setIsPublic] = useState(initialStatus === 'published');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  // Update internal state when initialStatus prop changes
  useEffect(() => {
    setIsPublic(initialStatus === 'published');
    setShareLink(null); // Clear link when status might change from external load
  }, [initialStatus]);

  const handlePublish = async () => {
    if (!tourId) {
      setPublishError("Please save the tour first before publishing.");
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    const newStatus = isPublic ? 'published' : 'private';

    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setPublishSuccess(true);
      if (newStatus === 'published') {
        setShareLink(`${window.location.origin}/view/${tourId}`);
      } else {
        setShareLink(null);
      }
      onStatusChange?.(newStatus);

    } catch (e: any) {
      console.error('Error publishing tour:', e);
      setPublishError(e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="border border-border p-6 rounded-lg mt-8 bg-card shadow-sm">
      <h3 className="text-xl font-semibold text-card-foreground mb-4">Publish Tour</h3>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="public-mode"
          checked={isPublic}
          onCheckedChange={setIsPublic}
          disabled={!tourId || isPublishing}
        />
        <Label htmlFor="public-mode" className="text-muted-foreground">Make Public</Label>
      </div>
      <Button onClick={handlePublish} disabled={!tourId || isPublishing} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        {isPublishing ? 'Publishing...' : 'Update Publish Status'}
      </Button>
      {publishError && <p className="text-destructive text-sm mt-2">Error: {publishError}</p>}
      {publishSuccess && <p className="text-green-500 text-sm mt-2">Publish status updated!</p>}
      {shareLink && (
        <div className="mt-4 p-4 border border-border rounded-md bg-background">
          <Label htmlFor="share-link" className="block mb-2 text-muted-foreground">Shareable Public Link:</Label>
          <Input
            id="share-link"
            type="text"
            value={shareLink}
            readOnly
            className="w-full bg-muted text-foreground border-border"
          />
          <Button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="mt-2 w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            Copy Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublishControls;
