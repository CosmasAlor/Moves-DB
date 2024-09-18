'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchMovieDetails, fetchSimilarMovies } from '@/redux/movieDetails';
import { AppDispatch, RootState } from '@/redux/store';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; // Import Slick Carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import Slick Carousel theme CSS
import Link from 'next/link';
import Loading from '@/app/loading';

const MovieDetails: React.FC = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { data: movie, similarMovies, loading, error } = useSelector((state: RootState) => state.movieDetailsSlice || { data: null, similarMovies: [], loading: false, error: null });

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieDetails(movieId));
      dispatch(fetchSimilarMovies(movieId));
    }
  }, [dispatch, movieId]);

  if (loading) return <div><Loading/></div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>No movie details available.</div>;


  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 6, // Changed from 8 to 4 to match the number of movies displayed
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    arrows: false,
    autoplay: true,
    responsive: [ // Added responsive settings for different screen sizes
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
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
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen">
      <section className="py-12 md:py-20 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`}}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:flex lg:items-start lg:space-x-8">
            <div className="flex-shrink-0 mb-8 lg:mb-0">
              <img 
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg" 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} 
              />
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {movie.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{movie.tagline}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres && movie.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
                  {movie.release_date}
                </span>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {movie.vote_average.toFixed(1)}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {movie.overview}
              </p>



            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Similar Movies</h2>
          <Slider {...settings}>
            {similarMovies.map((similarMovie) => (
              <Link href={`/movie/${similarMovie.id}`} key={similarMovie.id}>
                <div className="px-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 h-full flex flex-col">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                      alt={similarMovie.title}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover"
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        
                        {similarMovie.title.length > 13 ? `${similarMovie.title.slice(0, 13)}...` : similarMovie.title}  
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-auto">
                        Released: <span className="font-medium">{similarMovie.release_date}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;