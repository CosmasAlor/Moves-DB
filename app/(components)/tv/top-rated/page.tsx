'use client'

import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTopRated, TvShow } from '@/redux/tv';
import { TVShow } from '@/app/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/loading';

// Define genre mapping
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

const languageOptions = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
];

const TopRatedTVShows: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topRated, loading, error } = useSelector((state: RootState) => state.tv);
  const [displayedShows, setDisplayedShows] = useState<TvShow[]>([]);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const showsPerPage = 15;

  const [filters, setFilters] = useState({
    language: 'en-US',
    'vote_average.gte': 0,
    with_genres: [] as number[],
  });

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchTopRated());
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, filters, currentPage]);

  useEffect(() => {
    if (topRated.length > 0) {
      startTransition(() => {
        const filteredShows = topRated.filter(show => 
          show.vote_average >= filters['vote_average.gte'] &&
          (filters.with_genres.length === 0 || filters.with_genres.some(genreId => show.genre_ids.includes(genreId)))
        );
        setDisplayedShows(filteredShows.slice(0, currentPage * showsPerPage));
      });
    }
  }, [topRated, currentPage, filters]);

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
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
  };

  if (loading === 'pending' && displayedShows.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4 bg-gray-100 dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Top Rated TV Shows</h1>
        
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
      </div>
      <div className="w-full md:w-3/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {displayedShows.map((show: TvShow) => (
            <Link href={`/tv/${show.id}`} key={show.id}>
              <div className="h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg overflow-hidden flex flex-col" style={{ opacity: isPending ? 0.7 : 1 }}>
                <div className="relative">
                  <Image
                    className="w-full h-48 object-cover"
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
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
        {topRated.length > displayedShows.length && (
          <div className="flex justify-center mt-4 mb-8">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedTVShows;