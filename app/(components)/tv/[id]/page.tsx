'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTVShowDetails, fetchSimilarTVShows, fetchTVShowCredits } from '@/redux/tvDetailsSlice';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import Loading from '@/app/loading';
import { FaCalendarAlt, FaStar, FaFilm, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Trending from '@/app/_components/trending/page';


interface TVShowDetails {
  // ... existing properties ...
  status?: string;
  // ... other properties ...
}

const TVShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { data: tvShow, similarShows, credits, loading, error } = useSelector((state: RootState) => state.tvDetails);

  const [showFullOverview, setShowFullOverview] = useState(false);

  const sliderSettings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  }), []);

  useEffect(() => {
    if (id) {
      Promise.all([
        dispatch(fetchTVShowDetails(id)),
        dispatch(fetchSimilarTVShows(id)),
        dispatch(fetchTVShowCredits(id))
      ]).then(() => {
        setIsDataLoaded(true);
      });
    }
  }, [dispatch, id]);

  const truncateOverview = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !tvShow) {
    return <div>Error loading TV show details.</div>;
  }
  console.log(tvShow);

  return (
    <>
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-start lg:space-x-8">
            {/* Left column: Poster and TV Show Info */}
            <div className="lg:w-1/3 mb-8 lg:mb-0">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                {/* Poster image */}
                {tvShow.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                    alt={tvShow.name}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">No poster available</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">TV Show Info</h2>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span><strong>First Air Date:</strong> {tvShow.first_air_date || 'N/A'}</span>
                    </li>
                    <li className="flex items-center">
                      <FaStar className="mr-2" />
                      <span><strong>Rating:</strong> {tvShow.vote_average ? `${tvShow.vote_average.toFixed(1)}/10` : 'N/A'}</span>
                    </li>
                    <li className="flex items-center">
                      <FaFilm className="mr-2" />
                      <span><strong>Genres:</strong> {tvShow.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
                    </li>
                    <li><strong>Status:</strong> {tvShow.status || 'N/A'}</li>
                    <li>
                      <strong>Homepage:</strong>{' '}
                      {tvShow.homepage ? (
                        <a
                          href={tvShow.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {tvShow.name}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </li>
                    <li><strong>Original Language:</strong> {tvShow.original_language || 'N/A'}</li>
                    <li><strong>Networks:</strong> {tvShow.networks?.map(n => n.name).join(', ') || 'N/A'}</li>
                  </ul>
                  <div className="created">
                
                  {tvShow.created_by && tvShow.created_by.length > 0 && (
                <div className='mt-4'>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Created By</h2>
                  <ul className="list-inside text-gray-600 dark:text-gray-300">
                    {tvShow.created_by.map(creator => (
                      <li key={creator.id}><strong>{creator.name}</strong></li>
                    ))}
                  </ul>
                </div>
              )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Overview, Created By, and Last Episode */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {showFullOverview ? tvShow.overview : truncateOverview(tvShow.overview, 500)}
                </p>
                {tvShow.overview.length > 200 && (
                  <button
                    onClick={() => setShowFullOverview(!showFullOverview)}
                    className="mt-2 text-blue-600 dark:text-blue-400 flex items-center"
                  >
                    {showFullOverview ? (
                      <>
                        Show Less <FaChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        Read More <FaChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>



              {tvShow.last_episode_to_air && (
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Last Episode</h2>
                  <p><strong>Name:</strong> {tvShow.last_episode_to_air.name}</p>
                  <p><strong>Air Date:</strong> {tvShow.last_episode_to_air.air_date}</p>
                  <p><strong>Episode:</strong> S{tvShow.last_episode_to_air.season_number}E{tvShow.last_episode_to_air.episode_number}</p>
                  <p><strong>Overview:</strong> {tvShow.last_episode_to_air.overview}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p><strong>Number of Seasons:</strong> {tvShow.number_of_seasons || 'N/A'}</p>
                    {tvShow.number_of_seasons > 0 && (
                      <Link 
                        href={`/tv/${id}/seasons`} 
                        className="inline-block mt-2 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        View All {tvShow.number_of_seasons} Seasons
                      </Link>
                    )}
                  </div>
                </div>
              )}

                    {/* Cast Section */}
      <section className="py-12 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Cast</h2>
          <div className='overflow-hidden'>
            {credits?.cast && credits.cast.length > 1 ? (
              <Slider {...sliderSettings}>
                {credits.cast.map((actor) => (
                  <ActorCard key={actor.id} actor={actor} />
                ))}
              </Slider>
            ) : credits?.cast && credits.cast.length === 1 ? (
              <div className="flex justify-center">
                <ActorCard actor={credits.cast[0]} />
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-700">No cast information available.</h1>
            )}
          </div>
        </div>
      </section>
            </div>
          </div>
        </div>
      </section>



      {/* Similar TV Shows Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Similar TV Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarShows.slice(0, 10).map((similarShow) => (
              <SimilarTVShowCard key={similarShow.id} show={similarShow} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Trending Now</h2>
          <Trending />
        </div>
      </section>
    </>
  );
};

const ActorCard: React.FC<{ actor: Credit }> = ({ actor }) => (
  <Link href={`/personalDetails/${actor.id}`}>
    <div className="px-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
        {actor.profile_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
            alt={actor.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="bg-gray-400 w-full h-64 flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-700">No Image</h1>
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{actor.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{actor.character}</p>
        </div>
      </div>
    </div>
  </Link>
);

const SimilarTVShowCard: React.FC<{ show: SimilarTVShow }> = ({ show }) => (
  <Link href={`/tv/${show.id}`}>
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 transform">
      {show.poster_path ? (
        <img 
          src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
          alt={show.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="bg-gray-400 w-full h-48 flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-700">No Image</h1>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate">{show.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{show.first_air_date?.split('-')[0]}</p>
      </div>
    </div>
  </Link>
);

export default TVShowDetails;