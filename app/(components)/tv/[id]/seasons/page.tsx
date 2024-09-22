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
    return <div>Error loading TV show details.</div>;
  }

  // Log the tvShow object to see its structure
  console.log('TV Show Details:', tvShow);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">{tvShow.name}: Seasons</h1>
      
      {/* Render the raw data for debugging */}
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto mb-8">
        {JSON.stringify(tvShow, null, 2)}
      </pre>

      {/* Uncomment and modify this section once we know the correct structure */}
      {/*
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {tvShow.seasons?.map((season) => (
          <Link
            key={season.id}
            href={`/tv/${id}/season/${season.season_number}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
          >
            // ... (rest of the season card content)
          </Link>
        ))}
      </div>
      */}

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