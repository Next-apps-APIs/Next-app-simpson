'use client';

import { useEffect, useRef, useState } from 'react';
import { SPRINGFIELD_LOCATIONS } from '@/data/locations';

interface LocationItem {
  id?: string | number;
  name?: string;
  [key: string]: any;
}

const ITEMS_PER_PAGE = 12;

export default function LocationsList() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/locations');
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = await res.json();
        const fromApi: LocationItem[] = Array.isArray(data)
          ? data.map((loc: any, idx: number) => ({
              id: loc.id ?? idx,
              name: loc.name ?? loc.title ?? 'Unknown location',
              ...loc,
            }))
          : [];

        const source = fromApi.length > 0 ? fromApi : SPRINGFIELD_LOCATIONS;
        setLocations(source);
        setTotalPages(Math.max(1, Math.ceil(source.length / ITEMS_PER_PAGE)));
      } catch (e) {
        console.error('Error loading locations', e);
        // Use curated fallback when API fails
        setLocations(SPRINGFIELD_LOCATIONS);
        setTotalPages(Math.max(1, Math.ceil(SPRINGFIELD_LOCATIONS.length / ITEMS_PER_PAGE)));
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#locations' && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const current = locations.slice(indexOfLast - ITEMS_PER_PAGE, indexOfLast);

  return (
    <section id="locations" ref={sectionRef} className="py-16 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Locations</h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            No locations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {current.map((loc) => (
              <div key={loc.id} className="bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{loc.name}</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  {Object.entries(loc)
                    .filter(([k]) => k !== 'id' && k !== 'name')
                    .slice(0, 8)
                    .map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="font-medium capitalize">{k}:</span>
                        <span className="break-all">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {locations.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5)
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`px-3 py-1 rounded-md ${currentPage === n ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                  >
                    {n}
                  </button>
                ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md text-gray-700 bg-white border border-gray-300 disabled:opacity-50"
              >
                »
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
