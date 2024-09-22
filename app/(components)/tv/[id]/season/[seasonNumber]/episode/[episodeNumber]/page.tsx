'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchEpisodeDetails } from '@/redux/tvDetailsSlice';
import type { EpisodeDetails as EpisodeDetailsType } from '@/redux/tvDetailsSlice';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/app/loading';
import { FaCalendarAlt, FaStar, FaClock } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import Trending from '@/app/_components/trending/page';

const EpisodeDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { episodeDetails, loading, error } = useSelector((state: RootState) => state.tvDetails);
  const params = useParams();
  const router = useRouter();

  const [showFullOverview, setShowFullOverview] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (params.id && params.seasonNumber && params.episodeNumber) {
      dispatch(fetchEpisodeDetails({
        tvId: params.id as string,
        seasonNumber: params.seasonNumber as string,
        episodeNumber: params.episodeNumber as string
      })).then(() => setIsDataLoaded(true));
    }
  }, [dispatch, params.id, params.seasonNumber, params.episodeNumber]);

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
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }), []);

  const truncateOverview = (overview: string, wordLimit: number) => {
    const words = overview.split(' ');
    if (words.length <= wordLimit) return overview;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  if (loading || !isDataLoaded) return <Loading />;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!episodeDetails) {
    router.push('/404');
    return null;
  }

  const episode = episodeDetails as EpisodeDetailsType;

  return (
    <>
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-start lg:space-x-8">
            {/* Left column: Episode Still and Info */}
            <div className="lg:w-1/3 mb-8 lg:mb-0">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                {episode.still_path ? (
                  <Image 
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={`Still from ${episode.name}`}
                    width={500}
                    height={281}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="bg-gray-400 w-full h-96 flex items-center justify-center">
                    <h1 className="text-3xl font-bold text-gray-700">No Image</h1>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Episode Info</h2>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span><strong>Air Date:</strong> {episode.air_date}</span>
                    </li>
                    <li className="flex items-center">
                      <FaStar className="mr-2" />
                      <span><strong>Rating:</strong> {episode.vote_average.toFixed(1)}/10</span>
                    </li>
                    <li className="flex items-center">
                      <FaClock className="mr-2" />
                      <span><strong>Runtime:</strong> {episode.runtime} minutes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right column: Overview and Guest Stars */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {episode.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Season {episode.season_number}, Episode {episode.episode_number}
                </p>

                <hr className="my-6 border-gray-200 dark:border-gray-600" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {showFullOverview ? episode.overview : truncateOverview(episode.overview, 50)}
                  {episode.overview.split(' ').length > 50 && (
                    <button
                      onClick={() => setShowFullOverview(!showFullOverview)}
                      className="ml-2 text-blue-600 hover:underline dark:text-blue-400 font-semibold"
                    >
                      {showFullOverview ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Guest Stars</h2>
                {episode.guest_stars.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {episode.guest_stars.map((star) => (
                      <ActorCard key={star.id} actor={star} />
                    ))}
                  </Slider>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">No guest stars for this episode.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Crew</h2>
          <Slider {...sliderSettings}>
            {episode.crew.map((member) => (
              <CrewCard key={member.credit_id} member={member} />
            ))}
          </Slider>
        </div>
      </section>

      <section className="mt-12 bg-gray-100 dark:bg-gray-800 py-12">
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
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 transform">
        {actor.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
            alt={actor.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-400 w-full h-48 flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-700">No Image</h1>
          </div>
        )}
        <div className="p-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate">{actor.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{actor.character}</p>
        </div>
      </div>
    </div>
  </Link>
);

const CrewCard: React.FC<{ member: Credit }> = ({ member }) => (
  <Link href={`/personalDetails/${member.id}`}>
    <div className="px-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 transform">
        {member.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
            alt={member.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-400 w-full h-48 flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-700">No Image</h1>
          </div>
        )}
        <div className="p-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate">{member.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{member.job}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default EpisodeDetails;