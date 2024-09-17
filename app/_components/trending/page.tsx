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
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    arrows: false,
    autoplay: true,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 9999,
        settings: {
          slidesToShow: 6,
          centerMode: false,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          centerMode: false,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '40px',
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-2">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">
          Trending {timeWindow === 'day' ? 'Today' : 'This Week'} 
        </h2>
        <button 
          onClick={handleToggle}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {timeWindow === 'day' ? 'View Weekly Trending' : 'View Daily Trending'}
        </button>
      </div> 
      <div className="overflow-hidden">
        <Slider {...settings}>
          {Movie.map((movie) => (
            <div key={movie.id} className="px-2">
              <Link href={`/movie/${movie.id}`}>
                <div className="hover:scale-105 transition duration-300">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                    className="rounded-lg shadow-md w-full"
                  />
                  <h3 className="mt-2 mb-1 text-sm sm:text-lg font-semibold text-center truncate">{movie.title}</h3>
                  <div className="text-center">
                    <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {movie.release_date}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Trending;
