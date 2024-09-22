'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnTheAir } from '@/redux/tv';
import { RootState, AppDispatch } from '@/redux/store';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/loading';

// Define genreMap
const genreMap: { [key: string]: number } = {
  'Action & Adventure': 10759,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Kids': 10762,
  'Mystery': 9648,
  'News': 10763,
  'Reality': 10764,
  'Sci-Fi & Fantasy': 10765,
  'Soap': 10766,
  'Talk': 10767,
  'War & Politics': 10768,
  'Western': 37
};

// Define languageOptions
const languageOptions = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  // Add more languages as needed
];

// Define sortOptions
const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity Descending' },
  { value: 'popularity.asc', label: 'Popularity Ascending' },
  { value: 'vote_average.desc', label: 'Rating Descending' },
  { value: 'vote_average.asc', label: 'Rating Ascending' },
  { value: 'first_air_date.desc', label: 'Release Date Descending' },
  { value: 'first_air_date.asc', label: 'Release Date Ascending' },
];

interface TvShowExtended {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
}

const OnTheAirTVShows: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { onTheAir, loading, error } = useSelector((state: RootState) => state.tv);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [displayedShows, setDisplayedShows] = useState<TvShowExtended[]>([]);

  const showsPerPage = 20;

  const [filters, setFilters] = useState({
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_average.gte': 0,
    'first_air_date.gte': '2020-01-01',
    'first_air_date.lte': '2024-12-31',
    with_genres: [] as number[],
  });

  useEffect(() => {
    dispatch(fetchOnTheAir());
  }, [dispatch]);

  useEffect(() => {
    if (onTheAir.length > 0) {
      const filteredShows = (onTheAir as TvShowExtended[]).filter(show => {
        return (
          show.vote_average >= filters['vote_average.gte'] &&
          new Date(show.first_air_date) >= new Date(filters['first_air_date.gte']) &&
          new Date(show.first_air_date) <= new Date(filters['first_air_date.lte']) &&
          (filters.with_genres.length === 0 || filters.with_genres.some(genre => show.genre_ids.includes(genre)))
        );
      });

      const sortedShows = filteredShows.sort((a, b) => {
        if (filters.sort_by === 'popularity.desc') return b.popularity - a.popularity;
        if (filters.sort_by === 'popularity.asc') return a.popularity - b.popularity;
        if (filters.sort_by === 'vote_average.desc') return b.vote_average - a.vote_average;
        if (filters.sort_by === 'vote_average.asc') return a.vote_average - b.vote_average;
        if (filters.sort_by === 'first_air_date.desc') return new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime();
        if (filters.sort_by === 'first_air_date.asc') return new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime();
        return 0;
      });

      startTransition(() => {
        setDisplayedShows(sortedShows.slice(0, currentPage * showsPerPage));
      });
    }
  }, [onTheAir, filters, currentPage]);

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleGenreChange = (genre: string) => {
    const genreId = genreMap[genre];
    setFilters(prev => {
      const newGenres = prev.with_genres.includes(genreId)
        ? prev.with_genres.filter(g => g !== genreId)
        : [...prev.with_genres, genreId];
      return { ...prev, with_genres: newGenres };
    });
    setCurrentPage(1);
  };

  // Update the loading condition
  if (loading === 'pending' || (loading === 'idle' && displayedShows.length === 0)) {
    return <Loading />;
  }

  if (loading === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4 bg-gray-100 dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">TV Shows On The Air</h1>
        
        <h2 className="mb-2 text-lg font-semibold">Filters</h2>
        
        {/* Genre filters */}
        <div className="mb-4">
          <h3 className="mb-1 font-medium">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(genreMap).map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-2 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                  filters.with_genres.includes(genreMap[genre])
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        
        {/* First Air Date filter */}
        <div className="mb-3">
          <h3 className="mb-1 text-sm font-medium">First Air Date Range</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={new Date(filters['first_air_date.gte']).getFullYear()}
              onChange={(e) => updateFilters({ 'first_air_date.gte': `${e.target.value}-01-01` })}
              className="w-1/2 p-1 text-sm border rounded"
              placeholder="From"
            />
            <span className="text-xs">to</span>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={new Date(filters['first_air_date.lte']).getFullYear()}
              onChange={(e) => updateFilters({ 'first_air_date.lte': `${e.target.value}-12-31` })}
              className="w-1/2 p-1 text-sm border rounded"
              placeholder="To"
            />
          </div>
        </div>
        
        {/* User Score filter */}
        <div className="mb-3">
          <h3 className="mb-1 text-sm font-medium">User Score</h3>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={filters['vote_average.gte']}
              onChange={(e) => updateFilters({ 'vote_average.gte': parseFloat(e.target.value) })}
              className="w-full"
              aria-label="Minimum user score"
            />
            <span className="w-10 text-xs text-center">{filters['vote_average.gte'].toFixed(1)}</span>
          </div>
        </div>
        
        {/* Language filter */}
        <div className="mb-3">
          <h3 className="mb-1 text-sm font-medium">Language</h3>
          <select
            value={filters.language}
            onChange={(e) => updateFilters({ language: e.target.value })}
            className="w-full p-1 text-sm border rounded"
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort filter */}
        <div className="mb-3">
          <h3 className="mb-1 text-sm font-medium">Sort By</h3>
          <select
            value={filters.sort_by}
            onChange={(e) => updateFilters({ sort_by: e.target.value })}
            className="w-full p-1 text-sm border rounded"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full md:w-3/4">
        {displayedShows.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {displayedShows.map((show) => (
                <Link href={`/tv/${show.id}`} key={show.id}>
                  <div className="h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg overflow-hidden flex flex-col" style={{ opacity: isPending ? 0.7 : 1 }}>
                    <div className="relative">
                      <Image
                        className="w-full h-48 object-cover"
                        src={show.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                          : '/path/to/placeholder-image.jpg'}
                        alt={show.name}
                        width={500}
                        height={750}
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-full p-1">
                        <div className="text-white text-sm font-bold">{Math.round(show.vote_average * 10)}%</div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                        {show.name}
                      </h5>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">{show.overview}</p>
                      <div className="mt-auto">
                        <span className='px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'>{show.first_air_date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {displayedShows.length < onTheAir.length && (
              <div className="flex justify-center mt-4 mb-8">
                <button
                  onClick={loadMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={isPending}
                >
                  {isPending ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>No shows found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnTheAirTVShows;