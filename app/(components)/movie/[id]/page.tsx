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
    <>
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`}}
        ></div>
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 relative z-10">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-xs lg:max-w-full mx-auto">
              <img 
                className="w-full h-auto object-cover" 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} 
              />
            </div>
            
            <div className="mt-6 sm:mt-8 lg:mt-0 lg:col-span-3">
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                {movie.title} ({movie.origin_country})
              </h1>
              <span>{movie.tagline}</span>

              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres && movie.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <span className='px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'>{movie.release_date}</span>
                    {/* Star rating SVGs */}
                  </div>
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                    ({movie.vote_average})
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    345 Reviews
                  </a>
                </div>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
              <span className='text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white'>Overview</span>
              <p className="mb-6 mt-6 text-gray-500 dark:text-gray-400 w-5/6">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl px-4 mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Similar Movies</h2>
          <Slider {...settings}>
            {similarMovies.map((similarMovie) => ( // Removed slice(0, 4) to show all similar movies
              
              <Link href={`${similarMovie.id}`}>
              <div key={similarMovie.id} className="px-2"> {/* Added padding for spacing between slides */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                    alt={similarMovie.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{similarMovie.title}</h3>
                    Release <span className='px-3 m-0 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'>{similarMovie.release_date}</span>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </Slider>
        </div>
      </section>

    </>
  );
};

export default MovieDetails;