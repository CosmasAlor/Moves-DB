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
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    arrows: false,
    autoplay: true,



  };

  return (
    <div className=''>
      <div className="time flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">Trending {timeWindow === 'day' ? 'Today' : 'This Week'}</h2>
        <button 
          onClick={handleToggle}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {timeWindow === 'day' ? 'Switch to Weekly' : 'Switch to Daily'}
        </button>
      </div> 
      <Slider {...settings}>
        {Movie.map((movie) => (
          <Link href={`/movie/${movie.id}`}>
          <div key={movie.id} className='p-2'>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='rounded' />
            <h3 className='mb-2 text-1xl text-center font-bold tracking-tight text-gray-900 dark:text-white'>{movie.title}</h3>
          
            Release <span className='px-3 m-0 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'>{movie.release_date}</span>
          </div>
        </Link>
        ))}
      </Slider>
    </div>
  );
}

export default Trending;
