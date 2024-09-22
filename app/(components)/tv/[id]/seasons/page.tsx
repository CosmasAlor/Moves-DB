'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTVShowDetails } from '@/redux/tvDetailsSlice';
import Link from 'next/link';
import Loading from '@/app/loading';
import Image from 'next/image';

// Update this interface to match your actual data structure
interface TVShowDetails {
  name: string;
  seasons: Array<{
    id: number;
    season_number: number;
    name: string;
    poster_path: string | null;
  }>;
  // Add other properties that exist in your TVShowDetails
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
    return <Loading />;
  }

  // Log the tvShow object to see its structure
  console.log('TV Show Details:', tvShow);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">{tvShow.name}: Seasons</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {tvShow.seasons?.map((season: { id: React.Key | null | undefined; season_number: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; poster_path: any; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
          <Link
            key={season.id}
            href={`/tv/${id}/season/${season.season_number}`}
            className="block rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer h-64 relative"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: season.poster_path 
                  ? `url(https://image.tmdb.org/t/p/w300${season.poster_path})`
                  : 'none',
                backgroundColor: season.poster_path ? 'transparent' : '#374151', // fallback color
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            <div className="relative h-full flex flex-col justify-end p-4 text-white z-10">
              <h3 className="font-semibold text-lg mb-1">{season.name}</h3>
              <p className="text-sm">Season {season.season_number}</p>
            </div>
          </Link>
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