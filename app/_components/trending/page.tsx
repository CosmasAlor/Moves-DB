import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetTrending } from '@/redux/TrendingSlice';
import { Movie } from '@/app/interfaces';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; // Import Slick Carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import Slick Carousel theme CSS
import Loading from '@/app/loading';
import Link from 'next/link';

interface RootState {
  moviesReducer: {
    Movie: Movie[];
    isLoading: boolean;
  };
}

function Trending() {
  const dispatch = useDispatch();
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const { Movie, isLoading } = useSelector((state: RootState) => state.moviesReducer);

  useEffect(() => {
    dispatch(GetTrending(timeWindow) as any);
  }, [dispatch, timeWindow]);

  const handleToggle = () => {
    setTimeWindow(prev => prev === 'day' ? 'week' : 'day');
  };

  if (isLoading) return <Loading />;

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    arrows: false,
    autoplay: true,



  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">
          Trending {timeWindow === 'day' ? 'Today' : 'This Week'} 
        </h2>
        <button 
          onClick={handleToggle}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {timeWindow === 'day' ? 'View Weekly Trending' : 'View Daily Trending'}
        </button>
      </div> 
      <Slider {...settings}>
        {Movie.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className="p-2 hover:scale-105 transition duration-300">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="rounded-lg shadow-md w-full"
              />
              <h3 className="mt-2 mb-1 text-lg font-semibold text-center truncate">{movie.title}</h3>
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                  {movie.release_date}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}

export default Trending;
