import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { Button } from '../src/components/Button';
import { GradientText } from '../src/components/GradientText';

interface Rating {
  id: number;
  name: string;
  type: 'company' | 'agent';
  rating: number;
  reviews: number;
}

const RatingsPage = () => {
  const router = useRouter(); // Initialize the router
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [topRatings, setTopRatings] = useState<Rating[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real application, this would be an API call
  useEffect(() => {
    // Simulate fetching data
    const fetchRatings = async () => {
      // In a real app: const response = await fetch('/api/ratings');
      // In a real app: const data = await response.json();
      const mockData: Rating[] = [
        { id: 1, name: 'SecureLife Insurance', type: 'company', rating: 4.9, reviews: 1200 },
        { id: 2, name: 'HealthFirst Providers', type: 'company', rating: 4.8, reviews: 950 },
        { id: 3, name: 'TravelGuard', type: 'company', rating: 4.7, reviews: 800 },
        { id: 4, name: 'Agent Jane Doe', type: 'agent', rating: 5.0, reviews: 50 },
        { id: 5, name: 'Agent John Smith', type: 'agent', rating: 4.6, reviews: 30 },
      ];
      
      setAllRatings(mockData);
      setTopRatings(mockData.sort((a, b) => b.rating - a.rating).slice(0, 3));
      setIsLoading(false);
    };

    fetchRatings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = allRatings.filter(rating =>
      rating.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, allRatings]);

  if (isLoading) {
    return <div className="text-center p-8">Loading ratings...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Add the "Go Back" button here */}
      <Button onClick={() => router.back()} className="mb-4">
        &larr; Go Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Insurance Companies & Agents</h1>
      
      {/* Top 3 Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4"><GradientText>Top 3 Rated</GradientText></h2>
        <div className="grid md:grid-cols-3 gap-4">
          {topRatings.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="text-gray-600 capitalize">{item.type}</p>
              <div className="mt-2 text-lg font-bold text-yellow-500">
                ★ {item.rating} <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <hr className="my-8" />
      
      {/* Search Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4"><GradientText>Search Companies & Agents</GradientText></h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600 text-sm capitalize">{item.type}</p>
                </div>
                <div className="text-lg font-bold text-yellow-500">
                  ★ {item.rating}
                </div>
              </div>
            ))}
          </div>
        )}
        {searchResults.length === 0 && searchTerm.trim() !== '' && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default RatingsPage;