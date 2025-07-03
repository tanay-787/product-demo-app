import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useUser } from '@stackframe/react';

interface Tour {
  id: string;
  title: string;
  status: string;
  views?: number;
  createdAt: string;
}

const TourList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useUser({ or: "redirect" });

  const { data: tours, isLoading, isError, error } = useQuery<Tour[], Error>({
    queryKey: ['tours'],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      const authHeaders = await user.getAuthHeaders();
      const response = await api.get<Tour[]>('/tours', { headers: authHeaders });
      return response.data;
    },
    enabled: !!user,
  });

  const deleteTourMutation = useMutation<void, Error, string>({
    mutationFn: async (tourId: string) => {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      const { accessToken } = await user.getAuthJson();
      await api.delete(`/tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      alert('Tour deleted successfully!');
    },
    onError: (err) => {
      console.error('Error deleting tour:', err);
      alert(`Failed to delete tour: ${err.message}`);
    },
  });

  const handleDeleteTour = (tourId: string) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      deleteTourMutation.mutate(tourId);
    }
  };

  const handleEditTour = (tourId: string) => {
    navigate(`/editor?tourId=${tourId}`);
  };

  if (isLoading) {
    return <div className="mt-4 text-center text-muted-foreground">Loading tours...</div>;
  }

  if (isError) {
    return <div className="mt-4 text-center text-destructive">Error: {error?.message}</div>;
  }

  return (
    <div className="mt-4 p-6 border rounded-lg bg-card shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">Your Product Tours</h2>
        <Link to="/editor">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Create New Tour
          </Button>
        </Link>
      </div>
      {tours && tours.length === 0 ? (
        <p className="text-muted-foreground">No tours created yet. Click "Create New Tour" to start!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border-border rounded-md overflow-hidden">
            <thead>
              <tr className="bg-muted/50">
                <th className="py-3 px-4 border-b border-border text-left text-sm font-medium text-muted-foreground">Tour Title</th>
                <th className="py-3 px-4 border-b border-border text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="py-3 px-4 border-b border-border text-left text-sm font-medium text-muted-foreground">Views</th>
                <th className="py-3 px-4 border-b border-border text-left text-sm font-medium text-muted-foreground">Created At</th>
                <th className="py-3 px-4 border-b border-border text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours?.map((tour) => (
                <tr key={tour.id} className="border-b border-border hover:bg-muted/20 last:border-b-0">
                  <td className="py-2 px-4 text-foreground">{tour.title}</td>
                  <td className="py-2 px-4 text-muted-foreground">{tour.status}</td>
                  <td className="py-2 px-4 text-muted-foreground">{tour.views || 'N/A'}</td>
                  <td className="py-2 px-4 text-muted-foreground">{tour.createdAt ? new Date(tour.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-2 px-4">
                    <Button variant="outline" size="sm" onClick={() => handleEditTour(tour.id)} className="mr-2">
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTour(tour.id)}
                      disabled={deleteTourMutation.isPending && deleteTourMutation.variables === tour.id}
                    >
                      {deleteTourMutation.isPending && deleteTourMutation.variables === tour.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteTourMutation.isError && (
        <p className="text-destructive text-sm mt-2">Error deleting tour: {deleteTourMutation.error?.message}</p>
      )}
    </div>
  );
};

export default TourList;
