'use client'

import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetTopRated } from '@/redux/UpcomingSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Movie } from '@/app/interfaces';
import Image from 'next/image';
import Link from 'next/link';

const TopRated: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topRatedMovies, isLoading, error } = useSelector((state: RootState) => state.upcoming);
  const [randomMovies, setRandomMovies] = useState<Movie[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = () => {
      dispatch(GetTopRated());
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (topRatedMovies.length > 0) {
      startTransition(() => {
        const shuffled = [...topRatedMovies].sort(() => 0.5 - Math.random());
        setRandomMovies(shuffled.slice(0, 4));
      });
    }
  }, [topRatedMovies]);

  if (isLoading && randomMovies.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Top Rated Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10">
        {randomMovies.map((movie: Movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className="h-96 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-opacity duration-300 ease-in-out overflow-hidden flex flex-col" style={{ opacity: isPending ? 0.7 : 1 }}>
              <div className="relative">
                <Image
                  className="rounded-t-lg w-full h-48 object-cover"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 rounded-full p-1">
                  <div className="consensus tight">
                    <div className="outer_ring">
                      <div className="user_score_chart" data-percent={movie.vote_average * 10}>
                        <div className="percent">
                          <span className="text-white text-sm font-bold">{Math.round(movie.vote_average * 10)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {movie.title.length > 13 ? `${movie.title.slice(0, 13)}...` : movie.title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{movie.overview.slice(0, 45)}...</p>
                <div className="mt-auto">
                  Release <span className='px-3 m-0 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'>{movie.release_date}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
    </>
  );
};

export default TopRated;