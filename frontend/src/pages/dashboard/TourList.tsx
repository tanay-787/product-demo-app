import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Tour {
  id: string;
  title: string; // Renamed from 'name' to 'title' to match backend schema
  status: string; // e.g., 'Draft', 'Published', 'Private'
  views?: number; // Optional as it might be added later
  createdAt: string;
}

const TourList: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tours'); // Proxy will redirect this to backend
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Tour[] = await response.json();
      setTours(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDeleteTour = async (tourId: string) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        const response = await fetch(`/api/tours/${tourId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Remove the deleted tour from the state
        setTours(tours.filter((tour) => tour.id !== tourId));
        alert('Tour deleted successfully!');
      } catch (e: any) {
        console.error('Error deleting tour:', e);
        alert(`Failed to delete tour: ${e.message}`);
      }
    }
  };

  const handleEditTour = (tourId: string) => {
    navigate(`/editor?tourId=${tourId}`);
  };

  if (loading) {
    return <div className="mt-4 text-center">Loading tours...</div>;
  }

  if (error) {
    return <div className="mt-4 text-center text-red-500">Error: {error}</div>;
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
      {tours.length === 0 ? (
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
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{tour.title}</td>
                  <td className="py-2 px-4 border-b">{tour.status}</td>
                  <td className="py-2 px-4 border-b">{tour.views || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{tour.createdAt ? new Date(tour.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <Button variant="outline" size="sm" onClick={() => handleEditTour(tour.id)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteTour(tour.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TourList;
