'use client'

import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '@/redux/moviesDiscoverSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { Movie } from '@/app/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/loading'; // Import the Loading component

// Define genre mapping
const genreMap: { [key: string]: number } = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Fantasy': 14,
  'History': 36,
  'Horror': 27,
  'Music': 10402,
  'Mystery': 9648,
  'Romance': 10749,
  'Science Fiction': 878,
  'TV Movie': 10770,
  'Thriller': 53,
  'War': 10752,
  'Western': 37
};

// Add this language mapping
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

const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity Descending' },
  { value: 'popularity.asc', label: 'Popularity Ascending' },
  { value: 'vote_average.desc', label: 'Rating Descending' },
  { value: 'vote_average.asc', label: 'Rating Ascending' },
  { value: 'release_date.desc', label: 'Release Date Descending' },
  { value: 'release_date.asc', label: 'Release Date Ascending' },
];

const PopularMovies: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, status, error } = useSelector((state: RootState) => state.moviesDiscover);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 15;
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    include_adult: false,
    include_video: false,
    language: 'en-US',
    sort_by: 'popularity.desc',
    'vote_average.gte': 0,
    'primary_release_date.gte': '2020-01-01',
    'primary_release_date.lte': '2024-12-31',
    with_genres: [] as number[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchMovies({
          ...filters,
          page: currentPage,
          with_genres: filters.with_genres.join(','),
        })).unwrap();
        console.log('API Response:', result);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchData();
  }, [dispatch, currentPage, filters]);

  useEffect(() => {
    if (movies.length > 0) {
      startTransition(() => {
        setDisplayedMovies(movies.slice(0, moviesPerPage) as Movie[]);
      });
    }
  }, [movies, moviesPerPage]);

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

  if (status === 'loading' && displayedMovies.length === 0) {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4 bg-gray-100 dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Most Popular Movies</h1>
        
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
        
        {/* Release Year filter */}
        <div className="mb-3">
          <h3 className="mb-1 text-sm font-medium">Release Year Range</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={new Date(filters['primary_release_date.gte']).getFullYear()}
              onChange={(e) => updateFilters({ 'primary_release_date.gte': `${e.target.value}-01-01` })}
              className="w-1/2 p-1 text-sm border rounded"
              placeholder="From"
            />
            <span className="text-xs">to</span>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={new Date(filters['primary_release_date.lte']).getFullYear()}
              onChange={(e) => updateFilters({ 'primary_release_date.lte': `${e.target.value}-12-31` })}
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
        
        {/* Other filters... */}
        
      </div>
      <div className="w-full md:w-3/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {displayedMovies.map((movie: Movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id}>
              <div className="h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg overflow-hidden flex flex-col" style={{ opacity: isPending ? 0.7 : 1 }}>
                <div className="relative">
                  <Image
                    className="w-full h-48 object-cover"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-full p-1">
                    <div className="text-white text-sm font-bold">{Math.round(movie.vote_average * 10)}%</div>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                    {movie.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">{movie.overview}</p>
                  <div className="mt-auto">
                    <span className='px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'>{movie.release_date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {movies.length > displayedMovies.length && (
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

export default PopularMovies;