'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSeasonDetails } from '@/redux/tvDetailsSlice';
import Loading from '@/app/loading';
import Image from 'next/image';

interface Episode {
  id: number;
  name: string;
  episode_number: number;
  air_date: string;
  overview: string;
  still_path: string | null;
}

const SeasonEpisodesPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const seasonNumber = params.seasonNumber as string;
  
  const dispatch = useDispatch<AppDispatch>();
  const tvDetails = useSelector((state: RootState) => state.tvDetails);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Log the entire tvDetails state
  console.log('TVDetails state:', tvDetails);

  useEffect(() => {
    if (id && seasonNumber) {
      dispatch(fetchSeasonDetails({ tvId: id, seasonNumber }))
        .then(() => setIsDataLoaded(true));
    }
  }, [dispatch, id, seasonNumber]);

  if (tvDetails.loading || !isDataLoaded) {
    return <Loading />;
  }

  if (tvDetails.error) {
    return <Loading />;
  }

  const seasonData = tvDetails.seasonDetails;

  return (
    <div className="relative min-h-screen">
      {seasonData?.poster_path && (
        <Image
          src={`https://image.tmdb.org/t/p/original${seasonData.poster_path}`}
          alt={seasonData.name || 'Season poster'}
          fill
          objectFit="cover"
          className="opacity-20"
          priority
        />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">{seasonData?.name}</h1>
        
        <div className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-lg shadow-xl p-8">
          <p className="text-xl mb-6">{seasonData?.overview}</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <p><strong>Air Date:</strong> {seasonData?.air_date}</p>
            <p><strong>Episode Count:</strong> {seasonData?.episode_count}</p>
          </div>
          
          <h2 className="text-3xl font-bold mb-6">Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasonData?.episodes && seasonData.episodes.map((episode: Episode) => (
              <Link 
                key={episode.id} 
                href={`/tv/${id}/season/${seasonNumber}/episode/${episode.episode_number}`}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={episode.still_path 
                      ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                      : '/placeholder-image.jpg'} // Replace with your placeholder image path
                    alt={episode.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{episode.episode_number}. {episode.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{episode.air_date}</p>
                  <p className="text-sm">{episode.overview.slice(0, 100)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href={`/tv/${id}/seasons`}
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-md hover:bg-indigo-700 transition-colors text-lg font-medium"
          >
            Back to Seasons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeasonEpisodesPage;