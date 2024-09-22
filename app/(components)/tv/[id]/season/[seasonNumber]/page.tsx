'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSeasonDetails } from '@/redux/tvDetailsSlice';
import Loading from '@/app/loading';

const SeasonEpisodesPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const seasonNumber = params.seasonNumber as string;
  
  const dispatch = useDispatch<AppDispatch>();
  const { seasonDetails, loading, error } = useSelector((state: RootState) => state.tvDetails);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id && seasonNumber) {
      dispatch(fetchSeasonDetails({ tvId: id, seasonNumber }))
        .then(() => setIsDataLoaded(true));
    }
  }, [dispatch, id, seasonNumber]);

  if (loading || !isDataLoaded) {
    return <Loading />;
  }

  if (error || !seasonDetails) {
    return <div>{error || 'Error loading season details.'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{seasonDetails.name}</h1>
        <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="mr-4">Air Date: {seasonDetails.air_date || 'N/A'}</span>
          <span className="mr-4">•</span>
          <span>Episodes: {seasonDetails.episodes?.length || 0}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg">{seasonDetails.overview}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Episodes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {seasonDetails.episodes?.map((episode) => (
          <Link 
            key={episode.id} 
            href={`/tv/${id}/season/${seasonNumber}/episode/${episode.episode_number}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              {episode.still_path ? (
                <img
                  className="w-full h-48 object-cover"
                  src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                  alt={episode.name}
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No image available</span>
                </div>
              )}
              <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                Episode {episode.episode_number}
              </span>
            </div>
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{episode.name}</h3>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Air Date: {episode.air_date || 'N/A'}</span>
                <span>Rating: {episode.vote_average.toFixed(1)}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{episode.overview}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link 
          href={`/tv/${id}/seasons`}
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Back to Seasons
        </Link>
      </div>
    </div>
  );
};

export default SeasonEpisodesPage;