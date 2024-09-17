'use client';

import React, { useState } from 'react';

import TopRated from '../Toprated/page';
import NowPlayingMovies from '../Nowplaying/page';
import PopularMovies from '../Popular/page';
import Upcoming from '../Upcoming/page';

const Soonall: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');


  return (
    <>
 
            
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          {['upcoming', 'trending', 'nowPlaying', 'topRated'].map((tab) => (
            <li key={tab} className="me-2" role="presentation">
              <button
                className={`inline-block p-4 rounded-t-lg transition-all duration-300 ease-in-out ${activeTab === tab ? 'text-white bg-cyan-950 border-b-2 border-purple-600 shadow-lg' : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-purple-300`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab === 'upcoming' && '🔜 Upcoming'}
                {tab === 'trending' && '🔥 Top Rated'}
                {tab === 'nowPlaying' && '🎬 Now Playing'}
                {tab === 'topRated' && '⭐ Popular'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div id="tabContent">
        <div className={activeTab === 'upcoming' ? '' : 'hidden'} role="tabpanel" aria-labelledby="upcoming-tab">
          <Upcoming />
        </div>
        <div className={activeTab === 'trending' ? '' : 'hidden'} role="tabpanel" aria-labelledby="trending-tab">
          <TopRated />
        </div>
        <div className={activeTab === 'nowPlaying' ? '' : 'hidden'} role="tabpanel" aria-labelledby="nowPlaying-tab">
          <div>
            <NowPlayingMovies />
          </div>
        </div>
        <div className={activeTab === 'topRated' ? '' : 'hidden'} role="tabpanel" aria-labelledby="topRated-tab">
          <div>
            <PopularMovies />
          </div>
        </div>
      </div>
    </>
  );
};

export default Soonall;
