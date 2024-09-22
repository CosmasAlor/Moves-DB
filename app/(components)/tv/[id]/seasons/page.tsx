'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTVShowDetails } from '@/redux/tvDetailsSlice';
import Link from 'next/link';
import Loading from '@/app/loading';
import Image from 'next/image';

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

const SeasonsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data: tvShow, loading, error } = useSelector((state: RootState) => state.tvDetails);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTVShowDetails(id)).then(() => {
        setIsDataLoaded(true);
      });
    }
  }, [dispatch, id]);

  if (loading || !isDataLoaded) return <Loading />;

  if (error || !tvShow) {
    return <div>Error loading TV show details.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">{tvShow.name}: Seasons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tvShow.seasons?.map((season: Season) => (
          <div key={season.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="relative h-64">
              {season.poster_path ? (
                <Image 
                  src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                  alt={season.name}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No poster available</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-3">{season.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <span className="font-medium">Episodes:</span> {season.episode_count} | <span className="font-medium">Air Date:</span> {season.air_date || 'N/A'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {season.overview || 'No overview available.'}
              </p>
              <Link 
                href={`/tv/${id}/season/${season.season_number}`}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                View Episodes
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link 
          href={`/tv/${id}`}
          className="inline-block bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
        >
          Back to TV Show
        </Link>
      </div>
    </div>
  );
};

export default SeasonsPage;