'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetTopRated } from '@/redux/UpcomingSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Movie } from '@/app/interfaces';
import Image from 'next/image';
import Link from 'next/link';

const Carousel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topRatedMovies, isLoading, error } = useSelector((state: RootState) => state.upcoming);
  const [randomMovies, setRandomMovies] = useState<Movie[]>([]);

  useEffect(() => {
    dispatch(GetTopRated());
  }, [dispatch]);

  useEffect(() => {
    if (topRatedMovies.length > 0) {
      const shuffled = [...topRatedMovies].sort(() => 0.5 - Math.random());
      setRandomMovies(shuffled.slice(0, 5));
    }
  }, [topRatedMovies]);

  if (isLoading && randomMovies.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div id="top-rated-carousel" className="relative w-full" data-carousel="slide">
      {/* Carousel wrapper */}
      <div className="relative h-64 sm:h-72 md:h-96 lg:h-[28rem] xl:h-[32rem] overflow-hidden">
        {randomMovies.map((movie, index) => (
          <div 
            key={movie.id} 
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}`} 
            data-carousel-item
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              className="absolute block w-full h-full object-cover"
              alt={movie.title}
              width={1280}
              height={1080}
            />
            {/* Grey overlay layer */}
            <div className="absolute inset-0 bg-black opacity-70"></div>

            <div className="absolute bottom-4 sm:bottom-10 md:bottom-20 lg:bottom-40 left-0 right-0 p-4 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">{movie.title}</h2>
              <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">{movie.overview.slice(0, 100)}...</p>
              <Link href={`/movie/${movie.id}`} className="mt-2 inline-block px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-blue-700 transition-colors duration-300">
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;