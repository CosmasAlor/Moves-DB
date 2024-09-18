'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { fetchMovieDetails, fetchSimilarMovies, fetchMovieCredits } from '@/redux/movieDetails';
import { AppDispatch, RootState } from '@/redux/store';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import Loading from '@/app/loading';
import { FaCalendarAlt, FaStar, FaFilm } from 'react-icons/fa';
import Trending from '@/app/_components/trending/page';

interface Movie {
  id: number;
  title: string;
  tagline: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface Credit {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

const MovieDetails: React.FC = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { data: movie, similarMovies, credits, loading, error } = useSelector((state: RootState) => state.movieDetailsSlice as { 
    data: Movie | null, 
    similarMovies: SimilarMovie[], 
    credits: { cast: Credit[] },
    loading: boolean, 
    error: string | null 
  });

  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    if (movieId) {
      Promise.all([
        dispatch(fetchMovieDetails(movieId)),
        dispatch(fetchSimilarMovies(movieId)),
        dispatch(fetchMovieCredits(movieId))
      ]).then(() => {
        setIsDataLoaded(true);
      });
    }
  }, [dispatch, movieId]);

  const sliderSettings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    arrows: false,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
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

  if (loading || !isDataLoaded) return <Loading />;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!movie) {
    router.push('/404');
    return null;
  }

  const truncateOverview = (overview: string, wordLimit: number) => {
    const words = overview.split(' ');
    if (words.length <= wordLimit) return overview;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <>
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-start lg:space-x-8">
            {/* Left column: Poster and Movie Info */}
            <div className="lg:w-1/3 mb-8 lg:mb-0">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                <img 
                  className="w-full h-auto object-cover"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title} 
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Movie Info</h2>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span><strong>Release Date:</strong> {movie.release_date}</span>
                    </li>
                    <li className="flex items-center">
                      <FaStar className="mr-2" />
                      <span><strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10</span>
                    </li>
                    <li className="flex items-center">
                      <FaFilm className="mr-2" />
                      <span><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right column: Overview and Cast */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {movie.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">{movie.tagline}</p>

                <hr className="my-6 border-gray-200 dark:border-gray-600" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {showFullOverview ? movie.overview : truncateOverview(movie.overview, 50)}
                  {movie.overview.split(' ').length > 50 && (
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cast</h2>
                {credits?.cast && credits.cast.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {credits.cast.slice(0, 10).map((actor) => (
                      <ActorCard key={actor.id} actor={actor} />
                    ))}
                  </Slider>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {credits?.cast.slice(0, 10).map((actor) => (
                      <ActorCard key={actor.id} actor={actor} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Similar Movies</h2>
          <Slider {...sliderSettings}>
            {similarMovies.map((similarMovie) => (
              <SimilarMovieCard key={similarMovie.id} movie={similarMovie} />
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
        <img 
          src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/placeholder.png'}
          alt={actor.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate">{actor.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{actor.character}</p>
        </div>
      </div>
    </div>
  </Link>
);

const SimilarMovieCard: React.FC<{ movie: SimilarMovie }> = ({ movie }) => (
  <Link href={`/movie/${movie.id}`}>
    <div className="px-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 h-full flex flex-col">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {movie.title.length > 13 ? `${movie.title.slice(0, 13)}...` : movie.title}  
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-auto">
            Released: <span className="font-medium">{movie.release_date}</span>
          </p>
        </div>
      </div>
    </div>
  </Link>
);

export default MovieDetails;