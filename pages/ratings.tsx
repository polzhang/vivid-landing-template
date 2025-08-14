import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../src/components/Button';
import { Header } from '../src/sections/Header';
import { Footer } from '../src/sections/Footer';

interface Rating {
  id: number;
  name: string;
  type: 'company' | 'agent';
  rating: number;
  reviews: number;
  imageUrl: string;
}

const RatingsPageContent = () => {
  const router = useRouter();
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [companies, setCompanies] = useState<Rating[]>([]);
  const [agents, setAgents] = useState<Rating[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      const mockData: Rating[] = [
        // Updated imageUrls for a more consistent color scheme
        { id: 1, name: 'Great Eastern', type: 'company', rating: 4.9, reviews: 1200, imageUrl: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=SL' },
        { id: 2, name: 'NTUC Income', type: 'company', rating: 4.8, reviews: 950, imageUrl: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=HP' },
        { id: 3, name: 'AIA', type: 'company', rating: 4.7, reviews: 800, imageUrl: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=TG' },
        { id: 4, name: 'Prudential', type: 'company', rating: 4.5, reviews: 600, imageUrl: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=RC' },
        { id: 5, name: 'Manulife', type: 'company', rating: 4.6, reviews: 750, imageUrl: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=FF' },
        { id: 6, name: 'Tan Tin Wee', type: 'agent', rating: 5.0, reviews: 50, imageUrl: 'https://placehold.co/100x100/E5E7EB/6B7280?text=JD' },
        { id: 7, name: 'Navarun VARMA', type: 'agent', rating: 4.6, reviews: 30, imageUrl: 'https://placehold.co/100x100/E5E7EB/6B7280?text=JS' },
        { id: 8, name: 'Jovan TAN', 'type': 'agent', 'rating': 4.9, 'reviews': 45, 'imageUrl': 'https://placehold.co/100x100/E5E7EB/6B7280?text=SC' },
        { id: 9, name: 'Vivian NG', type: 'agent', rating: 4.2, reviews: 20, imageUrl: 'https://placehold.co/100x100/E5E7EB/6B7280?text=BW' },
        { id: 10, name: 'CHEN Hui-Chen', type: 'agent', rating: 4.8, reviews: 65, imageUrl: 'https://placehold.co/100x100/E5E7EB/6B7280?text=EW' },
      ];
      
      setAllRatings(mockData);

      const allCompanies = mockData.filter(item => item.type === 'company').sort((a, b) => b.rating - a.rating);
      setCompanies(allCompanies);

      const allAgents = mockData.filter(item => item.type === 'agent').sort((a, b) => b.rating - a.rating);
      setAgents(allAgents);
      
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
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto mb-6 space-y-3 bg-white-100 p-3 rounded-lg mt-4 pt-10">
      <div>
        {/* Updated h2 to use standard black text */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Search Companies & Agents</h2>
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
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
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
      <div className="flex items-center gap-4 mb-4 justify-between">
        <Button onClick={() => router.back()} className="mr-auto">
          &larr; Go Back
        </Button>
        {/* Updated h1 to use standard black text */}
        <h1 className="text-2xl font-bold text-gray-900">
          Company & Agent Ratings
        </h1>
        <div className="w-[100px]" />
      </div>

      {/* Browse Companies Section */}
      <div className="mb-8">
        {/* Updated h2 to use standard black text */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Browse Companies</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {companies.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex items-center gap-4">
              <img src={item.imageUrl} alt={`${item.name} logo`} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 capitalize">{item.type}</p>
                <div className="mt-2 text-lg font-bold text-yellow-500">
                  ★ {item.rating} <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <hr className="my-8" />
      
      {/* Browse Agents Section */}
      <div className="mb-8">
        {/* Updated h2 to use standard black text */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Browse Agents</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {agents.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex items-center gap-4">
              <img src={item.imageUrl} alt={`${item.name} face`} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 capitalize">{item.type}</p>
                <div className="mt-2 text-lg font-bold text-yellow-500">
                  ★ {item.rating} <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <hr className="my-8" />
      
      {/* Search Section */}
    </div>
  );
};

export default function Ratings({
    isDarkMode,
    toggleDarkMode,
}: {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}) {
    return (
        <div className="overflow-hidden col text-strong">
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
                <RatingsPageContent />
            </main>
            <Footer />
        </div>
    );
}
