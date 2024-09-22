'use client'
import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { searchMulti } from '@/redux/searchSlice';
import Loading from '../loading';
import Image from 'next/image';
import Link from 'next/link';

// Define media type mapping
const mediaTypeMap: { [key: string]: string } = {
  'all': 'All',
  'movie': 'Movies',
  'tv': 'TV Shows',
  'person': 'People'
};


const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity Descending' },
  { value: 'popularity.asc', label: 'Popularity Ascending' },
  { value: 'vote_average.desc', label: 'Rating Descending' },
  { value: 'vote_average.asc', label: 'Rating Ascending' },
  { value: 'release_date.desc', label: 'Release Date Descending' },
  { value: 'release_date.asc', label: 'Release Date Ascending' },
];

const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { results, loading, error } = useSelector((state: RootState) => state.search);
  const [displayedResults, setDisplayedResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 15;
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    mediaType: 'all',
    // Remove language from filters
    sort_by: 'popularity.desc',
    'vote_average.gte': 0,
    'primary_release_date.gte': '2020-01-01',
    'primary_release_date.lte': '2024-12-31',
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      dispatch(searchMulti({ query: q, page: currentPage, ...filters }));
    }
  }, [searchParams, dispatch, currentPage, filters]);

  useEffect(() => {
    if (results.length > 0) {
      startTransition(() => {
        const filteredResults = applyFilters(results);
        setDisplayedResults(filteredResults.slice(0, resultsPerPage * currentPage));
      });
    }
  }, [results, filters, currentPage]);

  const applyFilters = (items: any[]) => {
    return items.filter(item => {
      if (filters.mediaType !== 'all' && item.media_type !== filters.mediaType) return false;
      if (item.vote_average < filters['vote_average.gte']) return false;
      if (item.release_date) {
        const releaseDate = new Date(item.release_date);
        const minDate = new Date(filters['primary_release_date.gte']);
        const maxDate = new Date(filters['primary_release_date.lte']);
        if (releaseDate < minDate || releaseDate > maxDate) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sort_by) {
        case 'popularity.desc':
          return b.popularity - a.popularity;
        case 'popularity.asc':
          return a.popularity - b.popularity;
        case 'vote_average.desc':
          return b.vote_average - a.vote_average;
        case 'vote_average.asc':
          return a.vote_average - b.vote_average;
        case 'release_date.desc':
          return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
        case 'release_date.asc':
          return new Date(a.release_date || 0).getTime() - new Date(b.release_date || 0).getTime();
        default:
          return 0;
      }
    });
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  if (loading && displayedResults.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4 bg-gray-100 dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Search Results</h1>
        
        <h2 className="mb-2 text-lg font-semibold">Filters</h2>
        
        {/* Media Type filters */}
        <div className="mb-4">
          <h3 className="mb-1 font-medium">Media Type</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(mediaTypeMap).map(([type, label]) => (
              <button
                key={type}
                onClick={() => updateFilters({ mediaType: type })}
                className={`px-2 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                  filters.mediaType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {label}
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
        
        {/* Remove the Language filter section */}
        
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {displayedResults.map((item: any) => (
            <Link href={item.media_type === 'person' ? `/personalDetails/${item.id}` : `/${item.media_type}/${item.id}`} key={item.id}>
              <div className="h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg overflow-hidden flex flex-col" style={{ opacity: isPending ? 0.7 : 1 }}>
                <div className="relative">
                  {item.poster_path || item.profile_path ? (
                    <Image
                      className="w-full h-48 object-cover"
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                      alt={item.title || item.name}
                      width={500}
                      height={750}
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">No image</span>
                    </div>
                  )}
                  {item.vote_average && item.media_type !== 'person' && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-full p-1">
                      <div className="text-white text-sm font-bold">{Math.round(item.vote_average * 10)}%</div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">
                    {item.title || item.name}
                  </h5>
                  {item.media_type === 'person' ? (
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      Known for: {item.known_for_department}
                    </p>
                  ) : (
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">{item.overview}</p>
                  )}
                  <div className="mt-auto">
                    <span className='px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'>
                      {item.media_type === 'person' 
                        ? (item.known_for && item.known_for[0] && item.known_for[0].title) || 'Actor'
                        : (item.release_date || item.first_air_date || 'Unknown date')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {results.length > displayedResults.length && (
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

export default Search;