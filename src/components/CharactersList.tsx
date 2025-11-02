'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { API_BASE_URL, API_PATHS } from '@/utils/constants';

interface Character {
  _id: string;
  name: string;
  image: string;
  quote?: string;
  job?: string;
}

const ITEMS_PER_PAGE = 10;

export default function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const charactersRef = useRef<HTMLDivElement>(null);

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      const fallback = parent.querySelector('.image-fallback');
      if (fallback) {
        (fallback as HTMLElement).style.display = 'flex';
      }
    }
  };

  // Function to fetch characters from our API route
  const fetchAllCharacters = async () => {
    try {
      // Use our API route which handles CORS
      const response = await fetch('/api/characters');
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();

      if (Array.isArray(data)) {
        return data.map((char: any) => ({
          _id: char.id?.toString() || `char-${Date.now()}`,
          name: char.name || 'Unknown Character',
          image: char.image || '',
          quote: char.quote || 'No quote available',
          job: char.job || ''
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error; // Re-throw to be caught by the parent function
    }
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        
        // Fetch all unique characters from the API
        const allCharacters = await fetchAllCharacters();
        
        if (allCharacters.length === 0) {
          throw new Error('No characters found in the API');
        }
        
        setCharacters(allCharacters);
        setTotalPages(Math.ceil(allCharacters.length / ITEMS_PER_PAGE));
      } catch (err) {
        console.error('Error fetching characters:', err);
        setError('Failed to load characters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (window.location.hash === '#characters' && charactersRef.current) {
      charactersRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const indexOfLastCharacter = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCharacter = indexOfLastCharacter - ITEMS_PER_PAGE;
  const currentCharacters = characters.slice(indexOfFirstCharacter, indexOfLastCharacter);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // No local fallback images: we rely on the API to provide image URLs
  const getFallbackImage = (_name: string): string => '';

  return (
    <section ref={charactersRef} id="characters" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Characters</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Error loading characters. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentCharacters.map((character) => (
              <div key={character._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-linear-to-br from-yellow-100 to-yellow-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {character.image ? (
                      <Image
                        src={character.image}
                        alt={character.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        onError={handleImageError}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        unoptimized
                      />
                    ) : (
                      <div className="image-fallback absolute inset-0 flex items-center justify-center bg-yellow-100">
                        <div className="text-center p-4">
                          <span className="text-yellow-800 text-4xl font-bold">
                            {character.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{character.name}</h3>
                  {character.quote && (
                    <p className="text-gray-600 italic text-sm">"{character.quote}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {characters.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                «
              </button>
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md ${currentPage === pageNum 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ›
              </button>
              <button
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                »
              </button>
            </nav>
          </div>
        )}
        <div className="text-center mt-2 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </section>
  );
}
