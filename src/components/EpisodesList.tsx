'use client';

import { useEffect, useRef, useState } from 'react';

interface EpisodeItem {
  id?: string | number;
  name?: string;
  title?: string;
  season?: number | string;
  episode?: number | string;
  airDate?: string;
  [key: string]: any;
}

const ITEMS_PER_PAGE = 12;

export default function EpisodesList() {
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/episodes');
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = await res.json();
        const normalized: EpisodeItem[] = Array.isArray(data)
          ? data.map((ep: any, idx: number) => ({
              id: ep.id ?? ep._id ?? idx,
              name: ep.name ?? ep.title ?? `Episode ${idx + 1}`,
              title: ep.title ?? ep.name ?? '',
              season: ep.season ?? ep.seasonNumber ?? ep.Season ?? '',
              episode: ep.episode ?? ep.episodeNumber ?? ep.Episode ?? '',
              airDate: ep.airDate ?? ep.air_date ?? '',
              ...ep,
            }))
          : [];
        setEpisodes(normalized);
        setTotalPages(Math.max(1, Math.ceil(normalized.length / ITEMS_PER_PAGE)));
      } catch (e) {
        console.error('Error loading episodes', e);
        setError('Failed to load episodes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#episodes' && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const current = episodes.slice(indexOfLast - ITEMS_PER_PAGE, indexOfLast);

  return (
    <section id="episodes" ref={sectionRef} className="py-16 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Episodes</h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {current.map((ep) => (
              <div key={ep.id} className="bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-1">{ep.title || ep.name}</h3>
                <p className="text-sm text-gray-700">Season {ep.season} · Episode {ep.episode}</p>
                {ep.airDate && <p className="text-xs text-gray-500 mt-1">Air date: {ep.airDate}</p>}
                <div className="text-sm text-gray-700 space-y-1 mt-2">
                  {Object.entries(ep)
                    .filter(([k]) => !['id', 'name', 'title', 'season', 'episode', 'airDate'].includes(k))
                    .slice(0, 6)
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

        {episodes.length > ITEMS_PER_PAGE && (
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
