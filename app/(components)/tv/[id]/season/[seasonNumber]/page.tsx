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
    return <div><Loading /></div>;
  }

  // Render the content based on what's available in tvDetails
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Season Details</h1>
      
      {/* Render all properties of tvDetails */}
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
        {JSON.stringify(tvDetails, null, 2)}
      </pre>

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