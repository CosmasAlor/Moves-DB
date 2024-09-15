import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetTrending } from '@/redux/TrendingSlice';
import { Movie } from '@/app/interfaces';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; // Import Slick Carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import Slick Carousel theme CSS
import Loading from '@/app/loading';

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
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    arrows: false,
    autoplay: true,



  };

  return (
    <div className='bg-gray-500'>
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
          <div key={movie.id} className='p-2'>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className='rounded' />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Trending;
