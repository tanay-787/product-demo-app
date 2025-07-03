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
        // Generate a mock public link for now. In a real app, this would be a dedicated public viewer route.
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
    <div className="border p-4 rounded-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Publish Tour</h3>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="public-mode"
          checked={isPublic}
          onCheckedChange={setIsPublic}
          disabled={!tourId || isPublishing} // Disable if no tourId or currently publishing
        />
        <Label htmlFor="public-mode">Make Public</Label>
      </div>
      <Button onClick={handlePublish} disabled={!tourId || isPublishing} className="w-full bg-purple-600 text-white">
        {isPublishing ? 'Publishing...' : 'Update Publish Status'}
      </Button>
      {publishError && <p className="text-red-500 text-sm mt-2">Error: {publishError}</p>}
      {publishSuccess && <p className="text-green-500 text-sm mt-2">Publish status updated!</p>}
      {shareLink && (
        <div className="mt-4">
          <Label htmlFor="share-link" className="block mb-2">Shareable Public Link:</Label>
          <Input
            id="share-link"
            type="text"
            value={shareLink}
            readOnly
            className="w-full bg-gray-100 dark:bg-gray-700"
          />
          <Button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="mt-2 w-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            Copy Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublishControls;
