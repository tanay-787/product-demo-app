import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useUser } from '@stackframe/react'; // Import useUser

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
  const user = useUser({ or: "redirect" }); // Get the user object

  // Use useQuery to fetch tours
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
    enabled: !!user, // Only run query if user is available
  });

  // Use useMutation for deleting a tour
  const deleteTourMutation = useMutation<void, Error, string>({
    mutationFn: async (tourId: string) => {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      const authHeaders = await user.getAuthHeaders();
      await api.delete(`/tours/${tourId}`, { headers: authHeaders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] }); // Invalidate and refetch tours after deletion
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
    return <div className="mt-4 text-center">Loading tours...</div>;
  }

  if (isError) {
    return <div className="mt-4 text-center text-red-500">Error: {error?.message}</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Product Tours</h2>
        <Link to="/editor">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Create New Tour
          </Button>
        </Link>
      </div>
      {tours && tours.length === 0 ? (
        <p className="text-gray-500">No tours created yet. Click "Create New Tour" to start!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Tour Title</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Views</th>
                <th className="py-2 px-4 border-b text-left">Created At</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours?.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{tour.title}</td>
                  <td className="py-2 px-4 border-b">{tour.status}</td>
                  <td className="py-2 px-4 border-b">{tour.views || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{tour.createdAt ? new Date(tour.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
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
        <p className="text-red-500 text-sm mt-2">Error deleting tour: {deleteTourMutation.error?.message}</p>
      )}
    </div>
  );
};

export default TourList;
